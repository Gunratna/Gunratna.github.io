import type { LightPalette } from "@/components/lab/environment/Lighting";

export type VibeId = "study" | "cave";

export type VibeConfig = {
  id: VibeId;
  label: string;
  blurb: string;
  background: string;
  fog: { color: string; density: number };
  envIntensity: number;
  light: LightPalette;
  /** the window pane (daylight vs night) */
  window: { color: string; emissive: string; intensity: number };
  /** monitor screens */
  screen: { emissive: string; intensity: number };
  /** desk lamp bulb */
  lamp: { color: string; intensity: number };
  /** post-processing mood */
  post: { bloomIntensity: number; bloomThreshold: number; vignette: number };
};

/** Cozy warm study — soft daylight through the window, warm lamp, inviting wood tones. */
const STUDY: VibeConfig = {
  id: "study",
  label: "Cozy Study",
  blurb: "warm daylight · soft lamp",
  background: "#2e2318",
  fog: { color: "#3a2a1c", density: 0.005 },
  envIntensity: 1.15,
  light: {
    sun: "#ffd9b0",
    sunIntensity: 3.2,
    sky: "#9a8060",
    ground: "#4a3826",
    hemiIntensity: 1.1,
    warm: "#ffa860",
    warmIntensity: 14,
  },
  window: { color: "#eef4fa", emissive: "#f2f7fc", intensity: 2.1 },
  screen: { emissive: "#bfe0ff", intensity: 1.35 },
  lamp: { color: "#ffb066", intensity: 16 },
  post: { bloomIntensity: 0.42, bloomThreshold: 0.9, vignette: 0.26 },
};

/** Dark moody dev cave — near-black room lit mostly by glowing screens and a cool rim. */
const CAVE: VibeConfig = {
  id: "cave",
  label: "Dev Cave",
  blurb: "screen glow · moody dark",
  background: "#0f141c",
  fog: { color: "#0c1119", density: 0.011 },
  envIntensity: 0.55,
  light: {
    sun: "#a8c4ff",
    sunIntensity: 1.1,
    sky: "#2c3a52",
    ground: "#12161d",
    hemiIntensity: 0.55,
    warm: "#4fb0ff",
    warmIntensity: 9,
  },
  window: { color: "#1b2c4a", emissive: "#2f5688", intensity: 0.9 },
  screen: { emissive: "#5cb8ff", intensity: 2.4 },
  lamp: { color: "#4fb0ff", intensity: 12 },
  post: { bloomIntensity: 0.85, bloomThreshold: 0.7, vignette: 0.4 },
};

export const VIBES: Record<VibeId, VibeConfig> = { study: STUDY, cave: CAVE };
export const VIBE_LIST: VibeConfig[] = [STUDY, CAVE];
