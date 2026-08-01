"use client";

import { CustomCursor } from "@/components/ui/CustomCursor";
import { useQuality } from "@/components/providers/QualityProvider";

/**
 * Renders the canvas CustomCursor only on the Full quality tier.
 * Isolated as a client component so the page shell can stay server-rendered.
 */
export function CursorLayer() {
  const { quality } = useQuality();
  return quality === "full" ? <CustomCursor /> : null;
}
