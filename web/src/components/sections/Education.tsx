"use client";

import { education, extracurriculars, type ExtraCat } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { GraduationCap } from "lucide-react";

function CategoryBlock({ cat }: { cat: ExtraCat }) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <span className="text-base">{cat.icon}</span>
        <span className="font-mono text-[11px] font-semibold uppercase tracking-wide text-accent">
          {cat.category}
        </span>
      </div>
      <ul className="space-y-2">
        {cat.items.map((item) => (
          <li key={item} className="flex gap-2.5 text-sm text-text-muted">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-border-strong" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Education() {
  return (
    <Section id="education" index="08" title="Education">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_1fr]">
        {/* Degree card */}
        <Reveal>
          <div className="h-full rounded-2xl border border-border bg-bg-elev p-7">
            <div className="flex items-start gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
                <GraduationCap size={22} />
              </span>
              <div>
                <h3 className="font-display text-2xl font-medium tracking-tight">
                  IIT Bombay
                </h3>
                <div className="mt-1 text-[15px] text-text">{education.degree}</div>
                <div className="mt-2 font-mono text-xs text-accent">{education.period}</div>
              </div>
            </div>

            {/* Coursework */}
            <div className="mt-7 border-t border-border pt-6">
              <div className="mb-3 font-mono text-[11px] uppercase tracking-wide text-text-dim">
                Relevant Coursework
              </div>
              <div className="flex flex-wrap gap-2">
                {education.coursework.map((c) => (
                  <span
                    key={c}
                    className="rounded-md border border-border bg-bg px-2.5 py-1 font-mono text-[12px] text-text-muted"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Beyond Code — categorised */}
        <Reveal delay={0.1}>
          <div className="rounded-2xl border border-border bg-bg-elev p-7">
            <div className="mb-6 font-display text-lg font-medium">Beyond Code</div>
            <div className="space-y-6">
              {extracurriculars.map((cat) => (
                <CategoryBlock key={cat.category} cat={cat} />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
