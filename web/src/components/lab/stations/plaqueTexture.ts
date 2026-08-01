"use client";

import * as THREE from "three";
import type { ArchNode, Project } from "@/lib/content";

export const TYPE_HEX: Record<Project["type"], string> = {
  LLM: "#fbbf24",
  RAG: "#4cc4f7",
  Vision: "#4ade80",
  Agentic: "#b79cff",
  VLM: "#22d3ee",
};

const KIND_HEX: Record<ArchNode["kind"], string> = {
  io: "#7dd3fc",
  process: "#86c99a",
  model: "#f0a35e",
  decision: "#e2b657",
  store: "#9aa5b8",
};

/** Canvas size — 1024 wide keeps text crisp when the plaque fills the screen. */
const W = 1024;
const H = 560;

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

/** Truncates text to fit a pixel width, adding an ellipsis when clipped. */
function fit(ctx: CanvasRenderingContext2D, text: string, max: number) {
  if (ctx.measureText(text).width <= max) return text;
  let t = text;
  while (t.length > 1 && ctx.measureText(t + "…").width > max) t = t.slice(0, -1);
  return t + "…";
}

function sectionLabel(ctx: CanvasRenderingContext2D, text: string, x: number, y: number) {
  ctx.fillStyle = "#7f8ea6";
  ctx.font = "600 16px ui-monospace, monospace";
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.save();
  ctx.letterSpacing = "2px";
  ctx.fillText(text, x, y);
  ctx.restore();
}

/**
 * Draws the project "spec sheet" used as the plaque's colour + emissive map.
 * Rendering into a texture (rather than a DOM overlay) keeps the content inside
 * the lighting model, so it reflects and dims with the room like a real panel.
 */
function paint(project: Project, index: number, glow: boolean) {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const accent = TYPE_HEX[project.type];

  /* ---- backing: light enough to stay legible in the dark vibe ---- */
  const bg = ctx.createLinearGradient(0, 0, W * 0.6, H);
  bg.addColorStop(0, glow ? "#243040" : "#1b2532");
  bg.addColorStop(1, glow ? "#151d28" : "#111823");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // accent wash behind the header for depth
  const wash = ctx.createLinearGradient(0, 0, 0, 150);
  wash.addColorStop(0, accent + (glow ? "33" : "1f"));
  wash.addColorStop(1, "#00000000");
  ctx.fillStyle = wash;
  ctx.fillRect(0, 0, W, 150);

  // accent spine
  ctx.fillStyle = accent;
  ctx.fillRect(0, 0, 14, H);

  /* ---- header ---- */
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2.5;
  roundRect(ctx, 42, 28, 52, 52, 13);
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.font = "700 28px ui-monospace, monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(String(index + 1), 68, 55);

  // type badge (top right)
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.font = "700 19px ui-monospace, monospace";
  const badge = project.type.toUpperCase();
  const bw = ctx.measureText(badge).width + 32;
  ctx.fillStyle = accent + "2e";
  roundRect(ctx, W - bw - 42, 30, bw, 44, 11);
  ctx.fill();
  ctx.strokeStyle = accent + "88";
  ctx.lineWidth = 1.5;
  roundRect(ctx, W - bw - 42, 30, bw, 44, 11);
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.textAlign = "center";
  ctx.fillText(badge, W - bw / 2 - 42, 59);

  // name + subtitle
  ctx.textAlign = "left";
  ctx.fillStyle = "#ffffff";
  ctx.font = "600 42px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.fillText(fit(ctx, project.name, W - 106 - bw - 70), 106, 62);

  ctx.fillStyle = "#a9b7ca";
  ctx.font = "400 23px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.fillText(fit(ctx, project.subtitle, W - 150), 106, 96);

  // divider
  ctx.strokeStyle = "rgba(255,255,255,0.13)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(42, 126);
  ctx.lineTo(W - 42, 126);
  ctx.stroke();

  /* ---- outcome metrics: one row of four ---- */
  const tiles = project.outcomes.slice(0, 4);
  const gap = 16;
  const tw = (W - 84 - gap * 3) / 4;
  const th = 92;
  const ty = 148;
  tiles.forEach((o, i) => {
    const tx = 42 + i * (tw + gap);
    ctx.fillStyle = "rgba(255,255,255,0.07)";
    roundRect(ctx, tx, ty, tw, th, 12);
    ctx.fill();
    // value bar
    ctx.fillStyle = accent;
    roundRect(ctx, tx, ty, 4, th, 2);
    ctx.fill();

    ctx.fillStyle = accent;
    ctx.font = "700 29px system-ui, -apple-system, Segoe UI, sans-serif";
    ctx.fillText(fit(ctx, o.value, tw - 30), tx + 16, ty + 40);
    ctx.fillStyle = "#9fadc0";
    ctx.font = "400 17px system-ui, -apple-system, Segoe UI, sans-serif";
    ctx.fillText(fit(ctx, o.label, tw - 26), tx + 16, ty + 68);
  });

  /* ---- rendered pipeline preview (mini architecture) ---- */
  sectionLabel(ctx, "PIPELINE", 42, 278);
  const nodes = project.arch.nodes.slice(0, 5);
  const nGap = 30;
  const nw = (W - 84 - nGap * (nodes.length - 1)) / nodes.length;
  const nh = 56;
  const ny = 292;
  nodes.forEach((n, i) => {
    const nx = 42 + i * (nw + nGap);
    const kc = KIND_HEX[n.kind] ?? accent;
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    roundRect(ctx, nx, ny, nw, nh, 10);
    ctx.fill();
    ctx.strokeStyle = kc + "99";
    ctx.lineWidth = 1.5;
    roundRect(ctx, nx, ny, nw, nh, 10);
    ctx.stroke();
    ctx.fillStyle = kc;
    roundRect(ctx, nx, ny, 3.5, nh, 2);
    ctx.fill();

    ctx.fillStyle = "#e6edf6";
    ctx.font = "600 16px system-ui, -apple-system, Segoe UI, sans-serif";
    ctx.fillText(fit(ctx, n.label, nw - 20), nx + 11, ny + 24);
    ctx.fillStyle = "#8494a8";
    ctx.font = "400 13px ui-monospace, monospace";
    ctx.fillText(fit(ctx, n.sub, nw - 20), nx + 11, ny + 43);

    // connector arrow
    if (i < nodes.length - 1) {
      const ax = nx + nw + 6;
      const ay = ny + nh / 2;
      ctx.strokeStyle = glow ? accent : "rgba(255,255,255,0.3)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(ax + nGap - 14, ay);
      ctx.stroke();
      ctx.fillStyle = glow ? accent : "rgba(255,255,255,0.3)";
      ctx.beginPath();
      ctx.moveTo(ax + nGap - 14, ay);
      ctx.lineTo(ax + nGap - 21, ay - 5);
      ctx.lineTo(ax + nGap - 21, ay + 5);
      ctx.closePath();
      ctx.fill();
    }
  });

  /* ---- stack chips ---- */
  sectionLabel(ctx, "STACK", 42, 400);
  let cx = 42;
  const cy = 414;
  ctx.font = "500 17px ui-monospace, monospace";
  for (const t of project.tech) {
    const cw = ctx.measureText(t).width + 26;
    if (cx + cw > W - 42) break;
    ctx.fillStyle = "rgba(255,255,255,0.06)";
    roundRect(ctx, cx, cy, cw, 38, 9);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.14)";
    ctx.lineWidth = 1.5;
    roundRect(ctx, cx, cy, cw, 38, 9);
    ctx.stroke();
    ctx.fillStyle = "#b9c6d6";
    ctx.fillText(t, cx + 13, cy + 25);
    cx += cw + 10;
  }

  /* ---- footer call to action ---- */
  ctx.textAlign = "center";
  if (glow) {
    const pw = 300;
    ctx.fillStyle = accent + "26";
    roundRect(ctx, (W - pw) / 2, 486, pw, 46, 12);
    ctx.fill();
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    roundRect(ctx, (W - pw) / 2, 486, pw, 46, 12);
    ctx.stroke();
    ctx.fillStyle = accent;
    ctx.font = "700 20px ui-monospace, monospace";
    ctx.fillText("▸  OPEN  DETAILS", W / 2, 516);
  } else {
    ctx.fillStyle = "#6d7d92";
    ctx.font = "500 19px ui-monospace, monospace";
    ctx.fillText("click to open", W / 2, 512);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

/** Builds the idle + highlighted texture pair for a project plaque. */
export function makePlaqueTextures(project: Project, index: number) {
  return { idle: paint(project, index, false), lit: paint(project, index, true) };
}
