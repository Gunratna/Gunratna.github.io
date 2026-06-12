"use client";

import { motion } from "framer-motion";
import { skills } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export function Skills() {
  return (
    <Section id="skills" label="Skills & Toolbox">
      <div className="space-y-px">
        {skills.map((row, ri) => (
          <Reveal key={row.group} delay={ri * 0.06}>
            <div className="grid grid-cols-1 gap-4 border-t border-border py-6 last:border-b sm:grid-cols-[200px_1fr]">
              <h3 className="text-base font-semibold">{row.group}</h3>
              <div className="flex flex-wrap gap-2.5">
                {row.items.map((item) => (
                  <motion.span
                    key={item}
                    whileHover={{ y: -2 }}
                    className="rounded-lg border border-border bg-bg-elev px-3 py-1.5 font-mono text-[13px] text-text-muted transition-colors hover:border-accent hover:text-text"
                  >
                    {item}
                  </motion.span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
