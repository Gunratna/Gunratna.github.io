"use client";

import { useMemo } from "react";
import type { ArchNode } from "@/lib/content";
import { useQuality } from "@/components/providers/QualityProvider";

type Edge = [string, string, string?];

const KIND_COLOR: Record<ArchNode["kind"], string> = {
  io: "var(--accent)",
  process: "#6b8f71",
  model: "#c97c2f",
  decision: "#b58a3a",
  store: "#7d8597",
};

const KIND_LABEL: Record<ArchNode["kind"], string> = {
  io: "I/O",
  process: "Process",
  model: "Model",
  decision: "Decision",
  store: "Store",
};

/* ---- layout: assign columns by longest path from a root ---- */
function useLayout(nodes: ArchNode[], edges: Edge[]) {
  return useMemo(() => {
    const idx: Record<string, number> = {};
    nodes.forEach((n, i) => (idx[n.id] = i));
    const fwd = edges.filter(([a, b]) => idx[b] > idx[a]);

    const col: Record<string, number> = {};
    nodes.forEach((n) => (col[n.id] = 0));
    let changed = true;
    let guard = 0;
    while (changed && guard++ < 60) {
      changed = false;
      for (const [a, b] of fwd) {
        if (col[b] < col[a] + 1) {
          col[b] = col[a] + 1;
          changed = true;
        }
      }
    }

    const maxCol = Math.max(...Object.values(col));
    const cols: ArchNode[][] = Array.from({ length: maxCol + 1 }, () => []);
    nodes.forEach((n) => cols[col[n.id]].push(n));

    // geometry
    const NODE_W = 150;
    const NODE_H = 60;
    const GAP_X = 70;
    const GAP_Y = 26;
    const colHeights = cols.map((c) => c.length * NODE_H + (c.length - 1) * GAP_Y);
    const height = Math.max(...colHeights);
    const width = cols.length * NODE_W + (cols.length - 1) * GAP_X;

    const pos: Record<string, { x: number; y: number }> = {};
    cols.forEach((c, ci) => {
      const colH = c.length * NODE_H + (c.length - 1) * GAP_Y;
      const offsetY = (height - colH) / 2;
      c.forEach((n, ni) => {
        pos[n.id] = {
          x: ci * (NODE_W + GAP_X),
          y: offsetY + ni * (NODE_H + GAP_Y),
        };
      });
    });

    return { pos, width, height, NODE_W, NODE_H, idx };
  }, [nodes, edges]);
}

export function ArchDiagram({
  nodes,
  edges,
  caption,
}: {
  nodes: ArchNode[];
  edges: Edge[];
  caption: string;
}) {
  const { quality } = useQuality();
  const animate = quality === "full";
  const { pos, width, height, NODE_W, NODE_H } = useLayout(nodes, edges);

  const PAD = 16;
  const vbW = width + PAD * 2;
  const vbH = height + PAD * 2;

  const edgePaths = edges.map(([a, b, label], i) => {
    const A = pos[a];
    const B = pos[b];
    if (!A || !B) return null;
    const x1 = A.x + NODE_W + PAD;
    const y1 = A.y + NODE_H / 2 + PAD;
    const x2 = B.x + PAD;
    const y2 = B.y + NODE_H / 2 + PAD;
    const mx = (x1 + x2) / 2;
    const d = `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
    return { d, label, key: i, x1, y1, x2, y2 };
  });

  return (
    <figure className="w-full">
      <div className="overflow-x-auto rounded-xl border border-border bg-bg-elev-2 p-4">
        <svg
          viewBox={`0 0 ${vbW} ${vbH}`}
          width="100%"
          style={{ minWidth: Math.min(vbW, 680), maxWidth: vbW }}
          role="img"
          aria-label={caption}
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="7"
              markerHeight="7"
              refX="5.5"
              refY="3"
              orient="auto"
            >
              <path d="M0,0 L6,3 L0,6 Z" fill="var(--border-strong)" />
            </marker>
          </defs>

          {/* edges */}
          {edgePaths.map((e) =>
            e ? (
              <g key={e.key}>
                <path
                  d={e.d}
                  fill="none"
                  stroke="var(--border-strong)"
                  strokeWidth="1.5"
                  markerEnd="url(#arrowhead)"
                />
                {animate && (
                  <path
                    d={e.d}
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="1.5"
                    strokeDasharray="4 12"
                    style={{ animation: "dashflow 1.1s linear infinite" }}
                  />
                )}
                {animate && (
                  <circle r="3" fill="var(--accent)">
                    <animateMotion dur="2.4s" repeatCount="indefinite" path={e.d} />
                  </circle>
                )}
                {e.label && (
                  <text
                    x={(e.x1 + e.x2) / 2}
                    y={(e.y1 + e.y2) / 2 - 6}
                    textAnchor="middle"
                    className="font-mono"
                    fontSize="9"
                    fill="var(--text-dim)"
                  >
                    {e.label}
                  </text>
                )}
              </g>
            ) : null
          )}

          {/* nodes */}
          {nodes.map((n) => {
            const p = pos[n.id];
            if (!p) return null;
            const color = KIND_COLOR[n.kind];
            return (
              <g key={n.id} transform={`translate(${p.x + PAD}, ${p.y + PAD})`}>
                <rect
                  width={NODE_W}
                  height={NODE_H}
                  rx="9"
                  fill="var(--bg-elev)"
                  stroke={color}
                  strokeWidth="1.5"
                />
                <rect width="4" height={NODE_H} rx="2" fill={color} />
                {animate && (
                  <rect
                    width={NODE_W}
                    height={NODE_H}
                    rx="9"
                    fill="none"
                    stroke={color}
                    strokeWidth="1.5"
                    opacity="0.5"
                  >
                    <animate
                      attributeName="opacity"
                      values="0;0.5;0"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </rect>
                )}
                <text x="14" y="24" fontSize="12.5" fontWeight="600" fill="var(--text)">
                  {n.label}
                </text>
                <text x="14" y="42" fontSize="10" fill="var(--text-dim)" className="font-mono">
                  {n.sub}
                </text>
                <text
                  x={NODE_W - 10}
                  y="16"
                  textAnchor="end"
                  fontSize="7.5"
                  fill={color}
                  className="font-mono"
                  style={{ textTransform: "uppercase", letterSpacing: "0.08em" }}
                >
                  {KIND_LABEL[n.kind]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <figcaption className="mt-3 text-sm text-text-muted">{caption}</figcaption>
    </figure>
  );
}
