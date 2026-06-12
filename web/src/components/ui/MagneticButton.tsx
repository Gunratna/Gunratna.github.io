"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "fill" | "outline";
  className?: string;
  external?: boolean;
};

/** Button/link that subtly follows the cursor within its bounds. */
export function MagneticButton({
  children,
  href,
  onClick,
  variant = "fill",
  className,
  external,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 18 });
  const sy = useSpring(y, { stiffness: 250, damping: 18 });

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const mx = e.clientX - (rect.left + rect.width / 2);
    const my = e.clientY - (rect.top + rect.height / 2);
    x.set(mx * 0.35);
    y.set(my * 0.35);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const styles = cn(
    "inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium transition-colors",
    variant === "fill"
      ? "bg-accent text-white hover:brightness-110"
      : "border border-border-strong text-text hover:border-accent hover:text-accent",
    className
  );

  const inner = (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className="inline-block"
    >
      {href ? (
        <a
          href={href}
          className={styles}
          suppressHydrationWarning
          {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
        >
          {children}
        </a>
      ) : (
        <button onClick={onClick} className={styles} suppressHydrationWarning>
          {children}
        </button>
      )}
    </motion.div>
  );

  return inner;
}
