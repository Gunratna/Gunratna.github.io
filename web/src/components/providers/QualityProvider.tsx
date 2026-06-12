"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Quality = "full" | "lite";

type QualityContext = {
  quality: Quality;
  auto: boolean; // whether quality is auto-detected vs user-forced
  detected: Quality; // what detection suggested
  reason: string; // human-readable why
  setQuality: (q: Quality) => void;
  resetAuto: () => void;
};

const Ctx = createContext<QualityContext | null>(null);

type Conn = {
  effectiveType?: string;
  saveData?: boolean;
  downlink?: number;
  addEventListener?: (t: string, cb: () => void) => void;
  removeEventListener?: (t: string, cb: () => void) => void;
};

/**
 * Decide Full vs Lite from the Network Information API + device memory.
 * We default to FULL and only drop to LITE on clear signals, so the
 * majority of visitors get the rich experience.
 */
function detect(): { quality: Quality; reason: string } {
  if (typeof navigator === "undefined") return { quality: "full", reason: "ssr" };

  const nav = navigator as Navigator & {
    connection?: Conn;
    deviceMemory?: number;
  };
  const c = nav.connection;

  if (c?.saveData) return { quality: "lite", reason: "Data Saver is on" };

  const et = c?.effectiveType;
  if (et === "slow-2g" || et === "2g" || et === "3g") {
    return { quality: "lite", reason: `slow connection (${et})` };
  }
  if (typeof c?.downlink === "number" && c.downlink > 0 && c.downlink < 1.5) {
    return { quality: "lite", reason: `low bandwidth (${c.downlink} Mbps)` };
  }
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 2) {
    return { quality: "lite", reason: "limited device memory" };
  }
  return { quality: "full", reason: "good connection" };
}

export function QualityProvider({ children }: { children: ReactNode }) {
  const [detected, setDetected] = useState<Quality>("full");
  const [reason, setReason] = useState("good connection");
  const [forced, setForced] = useState<Quality | null>(null);

  useEffect(() => {
    // restore a previous manual choice
    try {
      const saved = localStorage.getItem("gb-quality") as Quality | null;
      if (saved === "full" || saved === "lite") setForced(saved);
    } catch {
      /* noop */
    }

    const run = () => {
      const d = detect();
      setDetected(d.quality);
      setReason(d.reason);
    };
    run();

    const nav = navigator as Navigator & { connection?: Conn };
    const c = nav.connection;
    c?.addEventListener?.("change", run);
    return () => c?.removeEventListener?.("change", run);
  }, []);

  const setQuality = (q: Quality) => {
    setForced(q);
    try {
      localStorage.setItem("gb-quality", q);
    } catch {
      /* noop */
    }
  };

  const resetAuto = () => {
    setForced(null);
    try {
      localStorage.removeItem("gb-quality");
    } catch {
      /* noop */
    }
  };

  const value = useMemo<QualityContext>(
    () => ({
      quality: forced ?? detected,
      auto: forced === null,
      detected,
      reason,
      setQuality,
      resetAuto,
    }),
    [forced, detected, reason]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useQuality() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useQuality must be used within QualityProvider");
  return ctx;
}
