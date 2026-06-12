"use client";

import { useRef, useState, useMemo, useCallback } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import {
  ContactShadows,
  Float,
  Html,
  OrbitControls,
  RoundedBox,
  Text,
} from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { projects } from "@/lib/content";

/* ===================== PALETTE ===================== */
const C = {
  floor: "#0e0c09",
  wall: "#171410",
  wallSide: "#141210",
  ceiling: "#110f0d",
  deskTop: "#5a4632",
  deskEdge: "#3f3122",
  deskLeg: "#2a2118",
  metal: "#7a7165",
  darkMetal: "#33302a",
  screen: "#070604",
  accent: "#e08a33",
  accent2: "#a8612a",
  green: "#6b8f71",
  blue: "#4a7a9b",
  purple: "#7a5fa0",
  red: "#9b4a4a",
  text: "#f2ede3",
  keyTop: "#3a342a",
  mug: "#9c4a2a",
  plant: "#5f7d52",
  pot: "#7a4a30",
  carpet: "#1a1510",
  wood: "#4a3828",
  bookSpine: ["#8b3a3a", "#3a5f8b", "#4a8b3a", "#8b7a3a", "#7a3a8b"],
  window: "#1a2a3a",
  cityGlow: "#2a4a6a",
};

/* ===================== REUSABLE PRIMITIVES ===================== */

function Screen({
  position,
  rotation,
  size,
  children,
  emissive = 0.08,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  size: [number, number];
  children: React.ReactNode;
  emissive?: number;
}) {
  return (
    <group position={position} rotation={rotation}>
      <RoundedBox args={[size[0] + 0.18, size[1] + 0.12, 0.07]} radius={0.03}>
        <meshStandardMaterial color={C.darkMetal} metalness={0.5} roughness={0.4} />
      </RoundedBox>
      <mesh position={[0, 0, 0.04]}>
        <planeGeometry args={size} />
        <meshStandardMaterial
          color={C.screen}
          emissive={C.accent}
          emissiveIntensity={emissive}
        />
      </mesh>
      {children}
    </group>
  );
}

function ScreenContent({
  title,
  lines,
  color = C.accent,
}: {
  title: string;
  lines: [string, string][];
  color?: string;
}) {
  return (
    <Html
      transform
      position={[0, 0, 0.06]}
      distanceFactor={1.4}
      className="pointer-events-none select-none"
      occlude={false}
    >
      <div
        style={{
          width: 320,
          padding: "10px 12px",
          fontFamily: "var(--font-jetbrains), monospace",
          color: C.text,
          fontSize: 8.5,
          lineHeight: 1.6,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            color,
            fontWeight: 600,
            fontSize: 9.5,
            marginBottom: 6,
            letterSpacing: "0.06em",
          }}
        >
          ▸ {title}
        </div>
        {lines.map(([k, v], i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", opacity: 0.85 }}>
            <span style={{ color: "#8a8170" }}>{k}</span>
            <span>{v}</span>
          </div>
        ))}
      </div>
    </Html>
  );
}

/* ===================== ENVIRONMENT ===================== */

function Room() {
  return (
    <group>
      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.3, 0]} receiveShadow>
        <planeGeometry args={[32, 24]} />
        <meshStandardMaterial color={C.floor} roughness={1} />
      </mesh>
      {/* carpet */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.28, 0]} receiveShadow>
        <planeGeometry args={[14, 10]} />
        <meshStandardMaterial color={C.carpet} roughness={0.95} />
      </mesh>
      {/* back wall */}
      <mesh position={[0, 2, -6]} receiveShadow>
        <planeGeometry args={[32, 14]} />
        <meshStandardMaterial color={C.wall} roughness={0.92} />
      </mesh>
      {/* left wall */}
      <mesh position={[-8, 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[20, 14]} />
        <meshStandardMaterial color={C.wallSide} roughness={0.92} />
      </mesh>
      {/* ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5.5, 0]}>
        <planeGeometry args={[32, 24]} />
        <meshStandardMaterial color={C.ceiling} roughness={1} />
      </mesh>
    </group>
  );
}

/* Low-poly city seen through window */
function CityWindow() {
  const buildings = useMemo(() => {
    const arr = [];
    for (let i = -5; i <= 5; i++) {
      const h = 0.4 + Math.abs(Math.sin(i * 1.7)) * 1.2;
      arr.push({ x: i * 0.55, h, w: 0.3 + Math.abs(Math.cos(i * 2.3)) * 0.15 });
    }
    return arr;
  }, []);

  return (
    <group position={[-7.85, 1.2, -1]}>
      {/* window frame */}
      <mesh>
        <boxGeometry args={[0.1, 3.2, 2.2]} />
        <meshStandardMaterial color={C.deskEdge} roughness={0.7} />
      </mesh>
      {/* glass */}
      <mesh position={[0.06, 0, 0]}>
        <planeGeometry args={[2.0, 3.0]} />
        <meshStandardMaterial
          color={C.window}
          transparent
          opacity={0.7}
          emissive={C.cityGlow}
          emissiveIntensity={0.15}
        />
      </mesh>
      {/* city silhouette */}
      <group position={[0.07, -0.8, 0]}>
        {buildings.map((b, i) => (
          <mesh key={i} position={[b.x, b.h / 2, 0]}>
            <boxGeometry args={[b.w, b.h, 0.01]} />
            <meshBasicMaterial color="#1e3050" />
          </mesh>
        ))}
        {/* window glow lights */}
        {buildings.map((b, i) =>
          Array.from({ length: 3 }).map((_, r) => (
            <mesh key={`${i}-${r}`} position={[b.x, 0.15 + r * 0.25, 0.005]}>
              <planeGeometry args={[0.04, 0.04]} />
              <meshBasicMaterial
                color={r % 2 === 0 ? "#ffe4a0" : "#a0c8ff"}
                transparent
                opacity={0.6 + Math.sin(i * r) * 0.4}
              />
            </mesh>
          ))
        )}
      </group>
      <pointLight position={[0.5, 0, 0.5]} intensity={3} color="#4a80c0" distance={6} />
    </group>
  );
}

function Bookshelf() {
  const titles = [
    "Attention is All You Need",
    "LangGraph Docs",
    "Deep Learning",
    "FastAPI Patterns",
    "GCP MLOps",
    "RAG Techniques",
    "PyTorch 2.0",
    "System Design",
  ];
  return (
    <group position={[-7.4, -0.1, -4.5]}>
      {/* frame */}
      <mesh>
        <boxGeometry args={[0.35, 3.4, 2.0]} />
        <meshStandardMaterial color={C.wood} roughness={0.8} />
      </mesh>
      {/* shelves */}
      {[0, 1, 2].map((shelf) =>
        titles.slice(shelf * 3, shelf * 3 + 3).map((title, bi) => (
          <group
            key={`${shelf}-${bi}`}
            position={[0.18, 0.6 - shelf * 1.0, -0.7 + bi * 0.65]}
          >
            <mesh>
              <boxGeometry args={[0.05, 0.8, 0.5]} />
              <meshStandardMaterial
                color={C.bookSpine[bi % C.bookSpine.length]}
                roughness={0.6}
              />
            </mesh>
            <Text
              position={[0.04, 0, 0]}
              rotation={[0, Math.PI / 2, 0]}
              fontSize={0.045}
              color={C.text}
              maxWidth={0.7}
              anchorX="center"
              textAlign="center"
            >
              {title}
            </Text>
          </group>
        ))
      )}
    </group>
  );
}

function DeskLamp({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.1, 0.12, 0.04, 12]} />
        <meshStandardMaterial color={C.darkMetal} metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.32, 0]} rotation={[0, 0, 0.18]}>
        <cylinderGeometry args={[0.01, 0.01, 0.62, 6]} />
        <meshStandardMaterial color={C.metal} metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0.14, 0.62, 0]} rotation={[0, 0, -0.85]}>
        <coneGeometry args={[0.12, 0.18, 14, 1, true]} />
        <meshStandardMaterial
          color={C.accent}
          emissive={C.accent}
          emissiveIntensity={0.5}
          side={THREE.DoubleSide}
          roughness={0.5}
        />
      </mesh>
      <pointLight position={[0.2, 0.5, 0.1]} intensity={5} color="#ffce8a" distance={4} />
    </group>
  );
}

function Mug({ position }: { position: [number, number, number] }) {
  const steam = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (!steam.current) return;
    steam.current.children.forEach((p, i) => {
      const t = (s.clock.elapsedTime * 0.35 + i * 0.33) % 1;
      p.position.y = 0.14 + t * 0.4;
      (p as THREE.Mesh & { material: THREE.Material & { opacity: number } }).material.opacity =
        (1 - t) * 0.22;
      p.scale.setScalar(0.5 + t * 0.5);
    });
  });
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.11, 0.09, 0.22, 18]} />
        <meshStandardMaterial color={C.mug} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.03, 18]} />
        <meshStandardMaterial color="#221410" roughness={0.3} />
      </mesh>
      <mesh position={[0.14, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.06, 0.018, 7, 14, Math.PI]} />
        <meshStandardMaterial color={C.mug} roughness={0.4} />
      </mesh>
      <group ref={steam}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[(i - 1) * 0.035, 0.18, 0]}>
            <sphereGeometry args={[0.025, 7, 7]} />
            <meshBasicMaterial color="#d8cbb0" transparent opacity={0.18} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Plant({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.11, 0.09, 0.18, 10]} />
        <meshStandardMaterial color={C.pot} roughness={0.7} />
      </mesh>
      {Array.from({ length: 7 }).map((_, i) => {
        const a = (i / 7) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 0.05, 0.22, Math.sin(a) * 0.05]}
            rotation={[Math.cos(a) * 0.5, a, Math.sin(a) * 0.5]}
          >
            <coneGeometry args={[0.035, 0.26, 5]} />
            <meshStandardMaterial color={C.plant} roughness={0.6} flatShading />
          </mesh>
        );
      })}
    </group>
  );
}

/* ===================== PROJECT STATIONS ===================== */

/**
 * STATION 1 — main desk with dual monitors:
 *   Left monitor: Email BOT pipeline status
 *   Right monitor: SEBI RAG pipeline status
 */
function MainDesk({ onInfo }: { onInfo: (p: string, msg: string) => void }) {
  return (
    <group position={[0, -1.4, 0]}>
      {/* desktop */}
      <RoundedBox args={[6.8, 0.18, 2.8]} radius={0.04} position={[0, 0, 0]}>
        <meshStandardMaterial color={C.deskTop} roughness={0.55} />
      </RoundedBox>
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[6.8, 0.04, 2.8]} />
        <meshStandardMaterial color={C.deskEdge} roughness={0.7} />
      </mesh>
      {[[-3.2, -0.9, -1.2], [3.2, -0.9, -1.2], [-3.2, -0.9, 1.2], [3.2, -0.9, 1.2]].map(
        (p, i) => (
          <mesh key={i} position={p as [number, number, number]}>
            <boxGeometry args={[0.14, 1.7, 0.14]} />
            <meshStandardMaterial color={C.deskLeg} roughness={0.5} metalness={0.3} />
          </mesh>
        )
      )}

      {/* monitor stand shared */}
      <mesh position={[0, 0.32, -0.88]}>
        <boxGeometry args={[5.8, 0.04, 0.28]} />
        <meshStandardMaterial color={C.darkMetal} metalness={0.5} roughness={0.4} />
      </mesh>

      {/* LEFT monitor — Email BOT */}
      <group
        position={[-1.6, 1.04, -0.95]}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          onInfo("email-bot", "📧 Email BOT processes 10k+ investor emails/day. 3-tier junk filter (Rules → PyTorch → Semantic rescue) feeds a Gemini 2.5 Flash intent engine. 80% automated, 0.1% false negatives, <500ms p95.");
        }}
      >
        <Screen position={[0, 0, 0]} size={[2.3, 1.35]}>
          <ScreenContent
            title="email_bot · ONLINE"
            color={C.green}
            lines={[
              ["pipeline", "3-tier · junk + intent"],
              ["volume", "10k+ emails / day"],
              ["amcs", "23 mutual funds"],
              ["auto_resolved", "80%"],
              ["false_neg_rate", "0.1%"],
              ["latency_p95", "<500ms"],
              ["model", "Gemini 2.5 Flash"],
            ]}
          />
        </Screen>
      </group>

      {/* RIGHT monitor — SEBI RAG */}
      <group
        position={[1.6, 1.04, -0.95]}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          onInfo("sebi-debarred", "📋 SEBI RAG pipeline uses FAISS page-relevance scoring and Gemini 2.5 Flash for schema-constrained extraction. Multimodal routing handles text (Camelot) and scanned (Gemini Vision) PDFs. 50% review reduction, 6K+ orders evaluated.");
        }}
      >
        <Screen position={[0, 0, 0]} size={[2.3, 1.35]}>
          <ScreenContent
            title="sebi_rag · ONLINE"
            color={C.blue}
            lines={[
              ["pipeline", "FAISS · RAG · schema"],
              ["orders_evaluated", "6K+"],
              ["review_reduction", "50%"],
              ["concurrent_pdfs", "10"],
              ["routing", "Camelot + Gemini Vision"],
              ["output", "Schema-constrained"],
              ["store", "Firestore · GKE"],
            ]}
          />
        </Screen>
      </group>

      {/* keyboard */}
      <group position={[0, 0.16, 0.55]}>
        <RoundedBox args={[1.9, 0.07, 0.62]} radius={0.02}>
          <meshStandardMaterial color={C.darkMetal} roughness={0.6} metalness={0.3} />
        </RoundedBox>
        {useMemo(() => {
          const rows: [number, number][] = [];
          for (let r = 0; r < 4; r++)
            for (let c = 0; c < 12; c++) rows.push([c * 0.13 - 0.72, r * 0.13 - 0.19]);
          return rows;
        }, []).map(([x, z], i) => (
          <mesh key={i} position={[x, 0.06, z]}>
            <boxGeometry args={[0.09, 0.04, 0.09]} />
            <meshStandardMaterial color={C.keyTop} roughness={0.7} />
          </mesh>
        ))}
      </group>

      {/* mouse */}
      <RoundedBox args={[0.16, 0.05, 0.24]} radius={0.02} position={[1.05, 0.15, 0.58]}>
        <meshStandardMaterial color={C.darkMetal} roughness={0.5} metalness={0.3} />
      </RoundedBox>

      <Mug position={[2.4, 0.18, 0.38]} />
      <Plant position={[-3.0, 0.2, 0.3]} />
      <DeskLamp position={[-2.5, 0.1, -0.42]} />
    </group>
  );
}

/**
 * STATION 2 — side table (right wall) with a laptop:
 *   Shows Aadhaar Redaction + GST Extraction
 */
function SideTable({ onInfo }: { onInfo: (p: string, msg: string) => void }) {
  return (
    <group position={[5.5, -1.7, -2.0]} rotation={[0, -Math.PI / 2, 0]}>
      <RoundedBox args={[3.2, 0.14, 1.6]} radius={0.03}>
        <meshStandardMaterial color={C.deskTop} roughness={0.6} />
      </RoundedBox>
      {[[-1.4, -0.65, -0.6], [1.4, -0.65, -0.6], [-1.4, -0.65, 0.6], [1.4, -0.65, 0.6]].map(
        (p, i) => (
          <mesh key={i} position={p as [number, number, number]}>
            <boxGeometry args={[0.1, 1.2, 0.1]} />
            <meshStandardMaterial color={C.deskLeg} roughness={0.5} />
          </mesh>
        )
      )}

      {/* Laptop — Aadhaar */}
      <group
        position={[-0.8, 0.12, -0.1]}
        rotation={[0, 0.2, 0]}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          onInfo("aadhaar-redaction", "🔐 Aadhaar PII Redaction: fine-tuned ResNet/EfficientNet classifies Aadhaar pages in multi-page TIFFs, then YOLO bounding-box detection masks the first 8 of 12 digits. DPDP Act compliant.");
        }}
      >
        <RoundedBox args={[1.0, 0.04, 0.68]} radius={0.02}>
          <meshStandardMaterial color={C.darkMetal} metalness={0.6} roughness={0.4} />
        </RoundedBox>
        <group position={[0, 0.32, -0.32]} rotation={[-1.1, 0, 0]}>
          <RoundedBox args={[1.0, 0.68, 0.03]} radius={0.02}>
            <meshStandardMaterial color={C.darkMetal} metalness={0.6} roughness={0.4} />
          </RoundedBox>
          <mesh position={[0, 0, 0.02]}>
            <planeGeometry args={[0.9, 0.6]} />
            <meshStandardMaterial color={C.screen} emissive={C.red} emissiveIntensity={0.15} />
          </mesh>
          <Html transform position={[0, 0, 0.04]} distanceFactor={1.0} className="pointer-events-none select-none" occlude={false}>
            <div style={{ width: 200, fontFamily: "monospace", color: C.text, fontSize: 7.5, padding: "6px 8px", lineHeight: 1.5 }}>
              <div style={{ color: "#c46a6a", fontWeight: 600, marginBottom: 4 }}>▸ aadhaar_redact · LIVE</div>
              <div style={{ color: "#8a8170" }}>backbone · ResNet / EfficientNet</div>
              <div style={{ color: "#8a8170" }}>detector · YOLO</div>
              <div style={{ color: "#8a8170" }}>compliance · DPDP Act</div>
            </div>
          </Html>
        </group>
      </group>

      {/* Tablet — GST */}
      <group
        position={[0.9, 0.1, 0.0]}
        rotation={[0, -0.15, 0]}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          onInfo("gst-extraction", "🧾 GST Invoice Extraction: RapidOCR + ONNX runtime pipeline with parallel page processing. Extracts 7 structured fields (GSTIN, invoice no., dates, amounts, taxes) from PDF/JPEG in <1s end-to-end.");
        }}
      >
        <RoundedBox args={[0.85, 0.04, 0.62]} radius={0.02}>
          <meshStandardMaterial color={C.darkMetal} metalness={0.6} roughness={0.4} />
        </RoundedBox>
        <group position={[0, 0.28, -0.29]} rotation={[-1.15, 0, 0]}>
          <RoundedBox args={[0.85, 0.6, 0.025]} radius={0.015}>
            <meshStandardMaterial color={C.darkMetal} metalness={0.6} roughness={0.4} />
          </RoundedBox>
          <mesh position={[0, 0, 0.015]}>
            <planeGeometry args={[0.76, 0.52]} />
            <meshStandardMaterial color={C.screen} emissive={C.accent2} emissiveIntensity={0.2} />
          </mesh>
          <Html transform position={[0, 0, 0.03]} distanceFactor={0.85} className="pointer-events-none select-none" occlude={false}>
            <div style={{ width: 190, fontFamily: "monospace", color: C.text, fontSize: 7.5, padding: "5px 7px", lineHeight: 1.5 }}>
              <div style={{ color: C.accent, fontWeight: 600, marginBottom: 4 }}>▸ gst_extract · LIVE</div>
              <div style={{ color: "#8a8170" }}>engine · RapidOCR + ONNX</div>
              <div style={{ color: "#8a8170" }}>fields · 7 structured</div>
              <div style={{ color: "#8a8170" }}>latency · &lt;1s</div>
            </div>
          </Html>
        </group>
      </group>
    </group>
  );
}

/**
 * STATION 3 — whiteboard on the left wall showing Agentic pipeline flow
 */
function AgentWhiteboard({ onInfo }: { onInfo: (p: string, msg: string) => void }) {
  const [hover, setHover] = useState(false);
  const AGENTS = ["Orchestrator", "Developer", "Reviewer", "Security", "Supervisor"];
  const COLORS = [C.accent, C.green, C.blue, C.purple, C.red];

  return (
    <group
      position={[-7.7, 0.8, -3.5]}
      rotation={[0, Math.PI / 2, 0]}
      onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { setHover(false); document.body.style.cursor = "auto"; }}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        onInfo("gitlab-agentic", "🤖 GitLab Agentic Pipeline: 5-agent autonomous CI/CD via LangGraph + PydanticAI. Orchestrator decomposes PRDs → Developer raises GitLab MRs → Reviewer + Security agents coordinate via MR comments → auto-deploys post human review. [Experimental]");
      }}
    >
      {/* board */}
      <mesh position={[0, 0, -0.04]}>
        <boxGeometry args={[4.5, 2.8, 0.06]} />
        <meshStandardMaterial color="#1e1c18" roughness={0.9} />
      </mesh>
      <mesh>
        <planeGeometry args={[4.3, 2.6]} />
        <meshStandardMaterial
          color={hover ? "#1c1a14" : "#181610"}
          emissive={C.accent}
          emissiveIntensity={hover ? 0.05 : 0.02}
          roughness={0.95}
        />
      </mesh>

      {/* Agents as nodes */}
      {AGENTS.map((name, i) => {
        const x = (i - 2) * 0.85;
        return (
          <group key={name} position={[x, 0.3, 0.01]}>
            <mesh>
              <boxGeometry args={[0.65, 0.35, 0.01]} />
              <meshBasicMaterial color={COLORS[i]} transparent opacity={0.25} />
            </mesh>
            <Text fontSize={0.1} color={COLORS[i]} anchorX="center">
              {name}
            </Text>
            {i < AGENTS.length - 1 && (
              <Text position={[0.75, 0, 0]} fontSize={0.09} color="#555" anchorX="center">
                →
              </Text>
            )}
          </group>
        );
      })}
      {/* description */}
      <Text position={[0, -0.5, 0.01]} fontSize={0.09} color="#8a8170" anchorX="center" maxWidth={4.0} textAlign="center">
        5-agent autonomous CI/CD · LangGraph + PydanticAI
      </Text>
      <Text position={[0, -0.75, 0.01]} fontSize={0.085} color="#6a6258" anchorX="center">
        PRD → Code → Review → Security → Deploy
      </Text>
      <Text position={[0, -1.05, 0.01]} fontSize={0.08} color={C.accent} anchorX="center">
        [Experimental] · Click to explore →
      </Text>
    </group>
  );
}

/* ===================== FLOATING PIPELINE NODES ===================== */

function FloatingNodes({ onInfo }: { onInfo: (p: string, msg: string) => void }) {
  const nodeData = [
    { id: "email-bot", label: "Email BOT", pos: [-2.5, 2.0, 1.0] as [number, number, number], color: C.accent },
    { id: "sebi-debarred", label: "SEBI RAG", pos: [0, 2.4, 1.2] as [number, number, number], color: C.blue },
    { id: "gitlab-agentic", label: "Agentic CI/CD", pos: [2.5, 2.1, 0.8] as [number, number, number], color: C.purple },
  ];

  return (
    <Float speed={0.8} rotationIntensity={0.08} floatIntensity={0.25}>
      <group>
        {nodeData.map((n) => (
          <FloatNode key={n.id} {...n} onInfo={onInfo} />
        ))}
      </group>
    </Float>
  );
}

function FloatNode({
  id, label, pos, color, onInfo,
}: {
  id: string; label: string; pos: [number, number, number]; color: string;
  onInfo: (p: string, msg: string) => void;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Mesh>(null);
  const [hover, setHover] = useState(false);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) {
      const s = hover ? 1.25 : 1;
      ref.current.scale.lerp(new THREE.Vector3(s, s, s), 0.1);
      ref.current.rotation.y = t * 0.3 + pos[0];
    }
    if (ring.current) ring.current.rotation.z = t * 0.5;
  });

  const info = useMemo(() => {
    const p = projects.find((x) => x.id === id);
    return p ? `${p.name}: ${p.tagline}` : "";
  }, [id]);

  return (
    <group position={pos}>
      <mesh
        ref={ref}
        onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { setHover(false); document.body.style.cursor = "auto"; }}
        onClick={(e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); onInfo(id, info); }}
      >
        <octahedronGeometry args={[0.28, 0]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hover ? 1.0 : 0.45} metalness={0.3} roughness={0.4} flatShading />
      </mesh>
      <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.38, 0.01, 6, 36]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} />
      </mesh>
      <Text position={[0, -0.52, 0]} fontSize={0.13} color={C.text} anchorX="center">{label}</Text>
    </group>
  );
}

/* ===================== SCENE ===================== */

const TOUR_STOPS: { pos: THREE.Vector3; target: THREE.Vector3 }[] = [
  { pos: new THREE.Vector3(0, 2, 8), target: new THREE.Vector3(0, 0, 0) },
  { pos: new THREE.Vector3(0, 1.4, 3.5), target: new THREE.Vector3(0, 0.8, -1) },
  { pos: new THREE.Vector3(4, 1.8, 2), target: new THREE.Vector3(5.5, -0.5, -2) },
  { pos: new THREE.Vector3(-5, 1.5, 0), target: new THREE.Vector3(-7.7, 0.8, -3.5) },
  { pos: new THREE.Vector3(-4, 1.5, -2), target: new THREE.Vector3(-7.4, 0.5, -4.5) },
];

function Scene({
  onInfo,
  tourStep,
  onTourDone,
}: {
  onInfo: (p: string, msg: string) => void;
  tourStep: number | null;
  onTourDone: () => void;
}) {
  const tourProgress = useRef(0);
  const prevStep = useRef<number | null>(null);
  const orbitTarget = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(({ camera }) => {
    if (tourStep === null) return;
    const stop = TOUR_STOPS[tourStep % TOUR_STOPS.length];
    if (prevStep.current !== tourStep) {
      prevStep.current = tourStep;
      tourProgress.current = 0;
    }
    tourProgress.current = Math.min(tourProgress.current + 0.016, 1);
    const ease = 1 - Math.pow(1 - tourProgress.current, 3);
    camera.position.lerp(stop.pos, ease * 0.06);
    const oc = orbitTarget.current;
    if (oc) oc.lerp(stop.target, ease * 0.06);
    if (tourProgress.current >= 0.98) onTourDone();
  });

  return (
    <>
      <color attach="background" args={[C.floor]} />
      <fog attach="fog" args={[C.floor, 10, 22]} />
      <ambientLight intensity={0.3} />
      <hemisphereLight args={["#ffd9a0", "#1a140d", 0.45]} />
      <directionalLight position={[3, 7, 4]} intensity={0.9} color="#ffd9a0" castShadow />
      <directionalLight position={[-4, 4, -2]} intensity={0.3} color={C.accent} />
      <pointLight position={[0, 3, 2]} intensity={12} color={C.accent} distance={14} />
      <pointLight position={[5, 3, -1]} intensity={5} color="#ffce8a" distance={10} />

      <Room />
      <CityWindow />
      <Bookshelf />

      <MainDesk onInfo={onInfo} />
      <SideTable onInfo={onInfo} />
      <AgentWhiteboard onInfo={onInfo} />
      <FloatingNodes onInfo={onInfo} />

      <ContactShadows position={[0, -2.27, 0]} opacity={0.45} scale={18} blur={2.4} far={6} />

      <EffectComposer>
        <Bloom intensity={0.65} luminanceThreshold={0.3} luminanceSmoothing={0.9} mipmapBlur />
        <Vignette eskil={false} offset={0.22} darkness={0.65} />
      </EffectComposer>
    </>
  );
}

/* ===================== ROOT EXPORT ===================== */

const PROJECT_DESCRIPTIONS: Record<string, string> = {
  "email-bot": "📧 Multi-stage ML + LLM pipeline processing 10k+ investor emails/day. 3-tier junk detection (Rules → PyTorch → Semantic rescue) feeds a Gemini 2.5 Flash intent engine extracting PAN, folios, ARNs across 23 intents. 80% automated, 0.1% FN, <500ms p95.",
  "sebi-debarred": "📋 SEBI RAG: FAISS page-relevance scoring + Gemini 2.5 Flash with schema-constrained output. Multimodal routing handles text (Camelot) and scanned (Gemini Vision) PDFs. 50% review reduction, 6K+ orders evaluated.",
  "aadhaar-redaction": "🔐 ResNet/EfficientNet classifies Aadhaar pages in multi-page TIFFs. YOLO bounding-box detection masks first 8 of 12 digits. DPDP Act compliant.",
  "gst-extraction": "🧾 RapidOCR + ONNX runtime with parallel page processing. Extracts 7 structured fields from PDF/JPEG invoices in <1s end-to-end.",
  "gitlab-agentic": "🤖 5-agent autonomous CI/CD via LangGraph + PydanticAI. PRD → Orchestrator → Developer (raises MR) → Reviewer + Security → Human gate → Auto-deploy. [Experimental]",
};

export default function WorkstationScene() {
  const [activeProject, setActiveProject] = useState<{ id: string; msg: string } | null>(null);
  const [tourStep, setTourStep] = useState<number | null>(null);
  const [tourIdx, setTourIdx] = useState(0);

  const handleInfo = useCallback((id: string, msg: string) => {
    const desc = PROJECT_DESCRIPTIONS[id] || msg;
    setActiveProject({ id, msg: desc });
  }, []);

  const onInfo = useCallback((p: string, msg: string) => handleInfo(p, msg), [handleInfo]);

  const startTour = () => {
    const next = (tourIdx + 1) % TOUR_STOPS.length;
    setTourIdx(next);
    setTourStep(next);
  };

  return (
    <div className="relative h-full w-full">
      <Canvas
        camera={{ position: [0, 2, 9], fov: 44 }}
        dpr={[1, 1.6]}
        shadows
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <Scene
          onInfo={onInfo}
          tourStep={tourStep}
          onTourDone={() => setTourStep(null)}
        />
        <OrbitControls
          enablePan={false}
          minDistance={4}
          maxDistance={14}
          minPolarAngle={Math.PI / 8}
          maxPolarAngle={Math.PI / 2.05}
          autoRotate={tourStep === null}
          autoRotateSpeed={0.3}
          target={[0, 0, 0]}
        />
      </Canvas>

      {/* Object tooltip removed — project detail panel covers it */}

      {/* Project detail panel */}
      {activeProject && (
        <div className="glass absolute bottom-5 left-1/2 w-[min(92%,580px)] -translate-x-1/2 rounded-xl border border-border p-5">
          <div className="flex items-start justify-between gap-4">
            <p className="text-sm leading-relaxed text-text">{activeProject.msg}</p>
            <button
              onClick={() => setActiveProject(null)}
              className="shrink-0 text-xs text-text-dim hover:text-text"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Camera tour button */}
      <button
        onClick={startTour}
        className="glass absolute right-4 top-4 flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs text-text-muted transition-colors hover:border-accent hover:text-accent"
      >
        🎥 {tourStep !== null ? "Touring…" : "Camera Tour"}
      </button>

      {/* Legend */}
      <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
        <p className="font-mono text-xs text-text-dim">
          drag to orbit · scroll to zoom · click stations & nodes to explore
        </p>
      </div>
    </div>
  );
}

