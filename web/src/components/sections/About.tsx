"use client";

import { about } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";

function Terminal() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-bg-elev font-mono text-[13px] shadow-xl">
      <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-xs text-text-dim">bash — gunratna@cams</span>
      </div>
      <div className="space-y-1 p-5 leading-relaxed">
        {about.terminalLines.map((line, i) => (
          <div
            key={i}
            className={line.startsWith("$") ? "text-accent-3" : "text-text-muted"}
          >
            {line}
          </div>
        ))}
        <div className="text-accent-3">
          $ <span className="cursor-blink" />
        </div>
      </div>
    </div>
  );
}

export function About() {
  return (
    <Section id="about" label="About">
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <Reveal>
            <div className="space-y-5 text-lg leading-relaxed">
              {about.bio.map((p, i) => (
                <p key={i} className={i === about.bio.length - 1 ? "text-text-muted" : ""}>
                  {p}
                </p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {about.stats.map((s) => (
                <div key={s.label}>
                  <div className="font-display text-4xl font-semibold tracking-tight text-gradient">
                    <Counter to={s.value} suffix={s.suffix} />
                  </div>
                  <div className="mt-1 text-sm text-text-muted">{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <Terminal />
        </Reveal>
      </div>
    </Section>
  );
}
