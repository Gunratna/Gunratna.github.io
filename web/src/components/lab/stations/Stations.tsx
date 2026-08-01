"use client";

import { projects, type Project } from "@/lib/content";
import { ProjectPlaque } from "@/components/lab/stations/ProjectPlaque";

/**
 * The project gallery: framed, backlit panels mounted on the back wall above
 * the desk, centred so they read as a curated wall of work rather than
 * floating UI. The window now lives on the right wall, leaving this wall clear.
 */
const WALL_Z = -5.93; // just in front of the back wall plane (z = -6)
const WALL_Y = 3.9; // clears the monitors below, stays under the 6-unit ceiling
const STEP_X = 2.52; // plaque is 2.34 wide → small gap between frames
const START_X = -((5 - 1) * STEP_X) / 2; // centred on the back wall

export function Stations({
  selectedId,
  screenGlow,
  onSelect,
}: {
  selectedId?: string;
  screenGlow: number;
  onSelect: (p: Project) => void;
}) {
  return (
    <group>
      {projects.map((p, i) => (
        <ProjectPlaque
          key={p.id}
          project={p}
          index={i}
          position={[START_X + i * STEP_X, WALL_Y, WALL_Z]}
          active={selectedId === p.id}
          screenGlow={screenGlow}
          onSelect={onSelect}
        />
      ))}
    </group>
  );
}
