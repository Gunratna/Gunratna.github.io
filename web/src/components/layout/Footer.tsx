import { meta } from "@/lib/content";

export function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 text-sm text-text-dim sm:flex-row sm:px-8">
        <p>
          {meta.name} © {new Date().getFullYear()}
        </p>
        <p className="font-mono text-xs">
          Built with Next.js · React · Framer Motion · IIT Bombay
        </p>
      </div>
    </footer>
  );
}
