/* ============================================================
   IDE modal component: file tree, tabs, code view + flowchart.
   Exposes window.IDEModal
   ============================================================ */
const { useState, useEffect, useRef, useLayoutEffect, useCallback } = React;

/* ---------- Lightweight syntax highlighter ---------- */
const KW_PY = "def|class|return|import|from|async|await|if|elif|else|for|while|in|not|and|or|with|as|lambda|yield|raise|try|except|finally|pass|self|cls|super|is|None|assert";
const sticky = (src) => new RegExp(src, "y");

const RULES = {
  python: [
    ["tk-com", sticky("#.*")],
    ["tk-str", sticky(`f?"(?:[^"\\\\]|\\\\.)*"|f?'(?:[^'\\\\]|\\\\.)*'`)],
    ["tk-deco", sticky("@[\\w.]+")],
    ["tk-bool", sticky("\\b(?:True|False|None)\\b")],
    ["tk-kw", sticky(`\\b(?:${KW_PY})\\b`)],
    ["tk-num", sticky("\\b\\d[\\d_]*(?:\\.\\d+)?\\b")],
    ["tk-fn", sticky("[A-Za-z_]\\w*(?=\\s*\\()")],
  ],
  json: [
    ["tk-key", sticky(`"(?:[^"\\\\]|\\\\.)*"(?=\\s*:)`)],
    ["tk-str", sticky(`"(?:[^"\\\\]|\\\\.)*"`)],
    ["tk-bool", sticky("\\b(?:true|false|null)\\b")],
    ["tk-num", sticky("-?\\b\\d[\\d_]*(?:\\.\\d+)?\\b")],
  ],
  yaml: [
    ["tk-com", sticky("#.*")],
    ["tk-key", sticky("[\\w.$-]+(?=\\s*:)")],
    ["tk-str", sticky(`"(?:[^"\\\\]|\\\\.)*"|'(?:[^'\\\\]|\\\\.)*'`)],
    ["tk-bool", sticky("\\b(?:true|false|null)\\b")],
    ["tk-num", sticky("\\b\\d[\\d_]*(?:\\.\\d+)?\\b")],
    ["tk-deco", sticky("\\$[A-Z_]+")],
  ],
};

function tokenizeLine(line, rules) {
  const out = [];
  let i = 0;
  const push = (cls, text) => {
    if (cls === null) {
      const last = out[out.length - 1];
      if (last && last.cls === null) { last.text += text; return; }
    }
    out.push({ cls, text });
  };
  while (i < line.length) {
    let hit = null;
    for (const [cls, re] of rules) {
      re.lastIndex = i;
      const m = re.exec(line);
      if (m && m.index === i && m[0].length) { hit = [cls, m[0]]; break; }
    }
    if (hit) { push(hit[0], hit[1]); i += hit[1].length; }
    else { push(null, line[i]); i += 1; }
  }
  return out;
}

function CodeView({ file }) {
  const rules = RULES[file.lang] || RULES.python;
  const lines = file.code.split("\n");
  return (
    React.createElement("div", { className: "ide-code" },
      React.createElement("div", { className: "ide-gutter" },
        lines.map((_, n) => React.createElement("div", { key: n }, n + 1))
      ),
      React.createElement("div", { className: "ide-codelines" },
        lines.map((ln, n) =>
          React.createElement("div", { key: n },
            ln.length === 0 ? "\u200b" :
            tokenizeLine(ln, rules).map((t, k) =>
              React.createElement("span", { key: k, className: t.cls || undefined }, t.text)
            )
          )
        )
      )
    )
  );
}

/* ---------- Flowchart renderer (DOM-measured edges) ---------- */
function FlowView({ flow }) {
  const canvasRef = useRef(null);
  const nodeRefs = useRef({});
  const [edges, setEdges] = useState([]);
  const [dims, setDims] = useState({ w: 0, h: 0 });

  // level assignment via longest forward path
  const idx = {};
  flow.nodes.forEach((n, i) => (idx[n.id] = i));
  const fwd = flow.edges.filter(([a, b]) => idx[b] > idx[a]);
  const level = {};
  flow.nodes.forEach((n) => (level[n.id] = 0));
  let changed = true, guard = 0;
  while (changed && guard++ < 50) {
    changed = false;
    fwd.forEach(([a, b]) => {
      if (level[b] < level[a] + 1) { level[b] = level[a] + 1; changed = true; }
    });
  }
  const maxLvl = Math.max(...Object.values(level));
  const rows = [];
  for (let l = 0; l <= maxLvl; l++) rows.push(flow.nodes.filter((n) => level[n.id] === l));

  const measure = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cb = canvas.getBoundingClientRect();
    const center = (id) => {
      const el = nodeRefs.current[id];
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        cx: r.left - cb.left + r.width / 2,
        top: r.top - cb.top,
        bottom: r.top - cb.top + r.height,
        left: r.left - cb.left,
        right: r.left - cb.left + r.width,
        midY: r.top - cb.top + r.height / 2,
      };
    };
    const next = [];
    flow.edges.forEach(([a, b, label], i) => {
      const A = center(a), B = center(b);
      if (!A || !B) return;
      const back = idx[b] <= idx[a];
      let path, lx, ly;
      if (back) {
        // route out to the left
        const x1 = A.left, y1 = A.midY, x2 = B.left, y2 = B.midY;
        const bend = Math.min(x1, x2) - 36;
        path = `M ${x1} ${y1} C ${bend} ${y1}, ${bend} ${y2}, ${x2} ${y2}`;
        lx = bend; ly = (y1 + y2) / 2;
      } else if (Math.abs(A.cx - B.cx) < 4) {
        path = `M ${A.cx} ${A.bottom} L ${B.cx} ${B.top}`;
        lx = A.cx; ly = (A.bottom + B.top) / 2;
      } else {
        const my = (A.bottom + B.top) / 2;
        path = `M ${A.cx} ${A.bottom} C ${A.cx} ${my}, ${B.cx} ${my}, ${B.cx} ${B.top}`;
        lx = (A.cx + B.cx) / 2; ly = my;
      }
      next.push({ path, label, lx, ly, back, key: i });
    });
    setDims({ w: canvas.scrollWidth, h: canvas.scrollHeight });
    setEdges(next);
  }, [flow]);

  useLayoutEffect(() => {
    measure();
    const t = setTimeout(measure, 60);
    const ro = new ResizeObserver(measure);
    if (canvasRef.current) ro.observe(canvasRef.current);
    window.addEventListener("resize", measure);
    return () => { clearTimeout(t); ro.disconnect(); window.removeEventListener("resize", measure); };
  }, [measure]);

  return (
    React.createElement("div", { className: "ide-flow" },
      React.createElement("div", { className: "ide-flow-title" },
        flow.title, " ", React.createElement("span", null, "// data flow")
      ),
      React.createElement("div", { className: "flow-canvas", ref: canvasRef },
        React.createElement("svg", { className: "flow-svg", width: dims.w, height: dims.h },
          React.createElement("defs", null,
            React.createElement("marker", {
              id: "arrow", markerWidth: 8, markerHeight: 8, refX: 6, refY: 3,
              orient: "auto", markerUnits: "userSpaceOnUse",
            },
              React.createElement("path", { d: "M0,0 L6,3 L0,6 Z", fill: "#71717a" })
            )
          ),
          edges.map((e) =>
            React.createElement("path", {
              key: e.key, d: e.path, fill: "none",
              stroke: e.back ? "#e5c07b" : "#3a3a42",
              strokeWidth: 1.5, strokeDasharray: e.back ? "4 3" : "none",
              markerEnd: "url(#arrow)",
            })
          )
        ),
        rows.map((row, ri) =>
          React.createElement("div", { className: "flow-row", key: ri },
            row.map((n) =>
              React.createElement("div", {
                key: n.id, className: `flow-node t-${n.type}`,
                ref: (el) => (nodeRefs.current[n.id] = el),
              },
                React.createElement("div", { className: "fn-label" }, n.label),
                n.sub && React.createElement("div", { className: "fn-sub" }, n.sub)
              )
            )
          )
        ),
        edges.filter((e) => e.label).map((e) =>
          React.createElement("div", {
            key: "l" + e.key, className: "flow-label-pill",
            style: { left: e.lx, top: e.ly },
          }, e.label)
        )
      )
    )
  );
}

/* ---------- File-tree icon ---------- */
function FileIcon({ icon }) {
  const map = { py: "PY", json: "{}", yaml: "Y", diagram: "◇" };
  return React.createElement("span", { className: `ide-ficon fi-${icon}` }, map[icon] || "•");
}

/* ---------- Main modal ---------- */
function IDEModal({ project, onClose }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [openTabs, setOpenTabs] = useState([0]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  const openFile = (i) => {
    setActiveIdx(i);
    setOpenTabs((t) => (t.includes(i) ? t : [...t, i]));
  };

  const file = project.files[activeIdx];
  const folder = project.id;

  return (
    React.createElement("div", { className: "ide-overlay", onMouseDown: (e) => { if (e.target === e.currentTarget) onClose(); } },
      React.createElement("div", { className: "ide", role: "dialog", "aria-modal": "true" },
        // title bar
        React.createElement("div", { className: "ide-titlebar" },
          React.createElement("div", { className: "ide-lights" },
            React.createElement("button", { className: "ide-light r", onClick: onClose, "aria-label": "Close", style: { border: 0, cursor: "pointer", padding: 0 } }),
            React.createElement("span", { className: "ide-light y" }),
            React.createElement("span", { className: "ide-light g" })
          ),
          React.createElement("div", { className: "ide-title" }, `${project.name} — architecture & code`),
          React.createElement("button", { className: "ide-close", onClick: onClose, "aria-label": "Close modal" }, "✕")
        ),
        // body
        React.createElement("div", { className: "ide-body" },
          React.createElement("div", { className: "ide-sidebar" },
            React.createElement("div", { className: "ide-explorer-label" }, "Explorer"),
            React.createElement("div", { className: "ide-folder" }, "▾ ", React.createElement("span", null, `📁 ${folder}/`)),
            project.files.map((f, i) =>
              React.createElement("div", {
                key: f.name, className: `ide-file ${i === activeIdx ? "active" : ""}`,
                onClick: () => openFile(i),
              },
                React.createElement(FileIcon, { icon: f.icon }),
                f.name
              )
            )
          ),
          React.createElement("div", { className: "ide-main" },
            React.createElement("div", { className: "ide-tabs" },
              openTabs.map((ti) =>
                React.createElement("div", {
                  key: ti, className: `ide-tab ${ti === activeIdx ? "active" : ""}`,
                  onClick: () => setActiveIdx(ti),
                },
                  React.createElement(FileIcon, { icon: project.files[ti].icon }),
                  project.files[ti].name
                )
              )
            ),
            React.createElement("div", { className: "ide-breadcrumb" },
              folder, " ❯ ", React.createElement("b", null, file.name)
            ),
            React.createElement("div", { className: "ide-content" },
              file.kind === "flow"
                ? React.createElement(FlowView, { flow: file.flow, key: project.id })
                : React.createElement(CodeView, { file })
            ),
            React.createElement("div", { className: "ide-status" },
              React.createElement("span", { className: "seg" }, "● ", project.name),
              React.createElement("span", { className: "seg" }, file.kind === "flow" ? "Diagram" : (file.lang || "text")),
              React.createElement("span", { className: "spacer" }),
              React.createElement("span", { className: "seg" }, "UTF-8"),
              React.createElement("span", { className: "seg" }, "Spaces: 4"),
              React.createElement("span", { className: "seg" }, "Esc to close")
            )
          )
        )
      )
    )
  );
}

window.IDEModal = IDEModal;
window.tokenizeLine = tokenizeLine;
window.SYNTAX_RULES = RULES;
