"use client";

import { motion } from "framer-motion";
import { experience } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

const ROLE_CHIPS: Record<string, { label: string; href: string }[]> = {
  CAMS: [
    { label: "email-bot", href: "#projects" },
    { label: "sebi", href: "#projects" },
    { label: "agentic-ci/cd", href: "#projects" },
  ],
};

function PresentNode() {
  return (
    <span className="relative grid h-5 w-5 place-items-center">
      <span className="absolute inset-0 rounded-full border-2 border-accent" />
      <motion.span
        className="absolute inset-0 rounded-full border-2 border-accent"
        animate={{ scale: [1, 1.9], opacity: [0.6, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
      />
      <span className="h-2 w-2 rounded-full bg-accent" />
    </span>
  );
}

function ExpCard({
  exp,
  align,
}: {
  exp: (typeof experience)[number];
  align: "left" | "right";
}) {
  const chips = ROLE_CHIPS[exp.company];
  return (
    <div className={align === "left" ? "md:text-right" : "md:text-left"}>
      <div className="font-mono text-xs font-semibold text-accent">{exp.period}</div>
      <h3 className="mt-1.5 text-2xl font-semibold tracking-tight">{exp.role}</h3>
      <div className="font-display text-base italic text-text-muted">{exp.company}</div>
      {exp.note && <div className="mt-0.5 text-xs text-text-dim">{exp.note}</div>}

      <div className="mt-4 rounded-xl border border-border bg-bg-elev p-4 text-left">
        <p className="text-sm leading-relaxed text-text-muted">{exp.description}</p>
        {exp.highlights.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {exp.highlights.map((h) => (
              <li key={h} className="flex gap-2 text-[13px] text-text-muted">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {chips && (
        <div
          className={`mt-3 flex flex-wrap gap-2 ${
            align === "left" ? "md:justify-end" : "md:justify-start"
          }`}
        >
          {chips.map((c) => (
            <a
              key={c.label}
              href={c.href}
              className="rounded-full border border-border bg-bg-elev px-2.5 py-1 font-mono text-[11px] text-text-muted transition-colors hover:border-accent hover:text-accent"
            >
              → {c.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export function Experience() {
  return (
    <Section id="experience" index="03" title="Experience">
      <div className="relative">
        {/* timeline line: left on mobile, centre on desktop */}
        <div className="absolute left-[9px] top-2 bottom-2 w-px bg-border md:left-1/2 md:-translate-x-1/2" />

        <div className="flex flex-col gap-10">
          {experience.map((exp, i) => {
            const right = i % 2 === 1; // alternate sides on desktop
            const isPresent = /present/i.test(exp.period);

            return (
              <Reveal key={exp.company} delay={i * 0.08}>
                <div className="relative md:grid md:grid-cols-2 md:gap-x-12">
                  {/* node */}
                  <div className="absolute left-0 top-1 md:left-1/2 md:-translate-x-1/2">
                    {isPresent ? (
                      <PresentNode />
                    ) : (
                      <span className="grid h-5 w-5 place-items-center">
                        <span className="h-2.5 w-2.5 rounded-full border-2 border-accent bg-bg" />
                      </span>
                    )}
                  </div>

                  {/* card on alternating side; mobile always full width with left pad */}
                  <div
                    className={
                      right
                        ? "pl-8 md:col-start-2 md:pl-12"
                        : "pl-8 md:col-start-1 md:pr-12 md:pl-0"
                    }
                  >
                    <ExpCard exp={exp} align={right ? "right" : "left"} />
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
