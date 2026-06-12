import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  id: string;
  label?: string;
  index?: string; // e.g. "08"
  title?: string; // large serif heading
  children: ReactNode;
  className?: string;
};

export function Section({ id, label, index, title, children, className }: Props) {
  return (
    <section id={id} className={cn("section-pad", className)}>
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        {title ? (
          <div className="mb-12 flex items-center gap-5">
            {index && (
              <span className="font-mono text-sm font-semibold text-accent">
                {index}.
              </span>
            )}
            <h2 className="font-display text-4xl font-medium tracking-tight sm:text-5xl">
              {title}
            </h2>
            <span className="hidden h-px flex-1 bg-border sm:block" />
          </div>
        ) : label ? (
          <div className="mb-10 flex items-center gap-4">
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              {label}
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>
        ) : null}
        {children}
      </div>
    </section>
  );
}
