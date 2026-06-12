import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute h-80 w-80 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--accent), transparent 70%)" }}
      />
      <p className="font-mono text-sm uppercase tracking-[0.2em] text-accent">
        Error 404
      </p>
      <h1 className="mt-4 font-display text-7xl font-medium tracking-tight sm:text-8xl">
        Lost in latent space
      </h1>
      <p className="mt-4 max-w-md text-text-muted">
        This route returned no grounded result. Like a good RAG pipeline, I&apos;d
        rather abstain than hallucinate a page.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white transition-all hover:brightness-110"
      >
        <ArrowLeft size={16} /> Back home
      </Link>
    </main>
  );
}
