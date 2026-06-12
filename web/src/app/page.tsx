"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { SectionProgress } from "@/components/ui/SectionProgress";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { BackgroundParticles } from "@/components/ui/BackgroundParticles";
import { ConnectionNotice } from "@/components/ui/ConnectionNotice";
import { TerminalToasts } from "@/components/ui/TerminalToasts";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Education } from "@/components/sections/Education";
import { Contact } from "@/components/sections/Contact";
import { useQuality } from "@/components/providers/QualityProvider";

export default function Home() {
  const { quality } = useQuality();
  return (
    <>
      <ScrollProgress />
      <SectionProgress />
      {quality === "full" && <CustomCursor />}
      <BackgroundParticles />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Contact />
      </main>
      <Footer />
      <ConnectionNotice />
      <TerminalToasts />
      <CommandPalette />
    </>
  );
}
