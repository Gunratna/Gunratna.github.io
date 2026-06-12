"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Mail, Send, Check, Loader2, AlertCircle } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { meta } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Enter a valid email"),
  _gotcha: z.string().max(0).optional(), // honeypot
  message: z.string().min(10, "Message should be at least 10 characters"),
});

type FormData = z.infer<typeof schema>;
type Status = "idle" | "sending" | "sent" | "error";

const links = [
  { kind: "email", label: meta.email, href: `mailto:${meta.email}`, Icon: Mail },
  {
    kind: "linkedin",
    label: "linkedin.com/in/gunratna-borkar",
    href: meta.linkedin,
    Icon: LinkedinIcon,
  },
  { kind: "github", label: "github.com/Gunratna", href: meta.github, Icon: GithubIcon },
];

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    if (data._gotcha) return; // honeypot tripped

    setStatus("sending");

    /*
     * Formspree API — free tier, 50 submissions/month.
     * Emails land directly in borkargunratna400@gmail.com.
     *
     * To activate:
     *   1. Sign up at https://formspree.io with your Gmail.
     *   2. Create a form → copy the ID.
     *   3. Replace `formspreeId` in web/src/lib/content.ts.
     */
    const endpoint = `https://formspree.io/f/${meta.formspreeId}`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          message: data.message,
        }),
      });

      if (res.ok) {
        setStatus("sent");
        reset();
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        // Fallback to mailto so the message is never lost
        const body = encodeURIComponent(
          `${data.message}\n\n— ${data.name} (${data.email})`
        );
        const subject = encodeURIComponent(`Portfolio contact from ${data.name}`);
        window.open(`mailto:${meta.email}?subject=${subject}&body=${body}`);
        setStatus("error");
        setTimeout(() => setStatus("idle"), 4000);
      }
    } catch {
      // Network error — fallback to mailto
      const body = encodeURIComponent(
        `${data.message}\n\n— ${data.name} (${data.email})`
      );
      const subject = encodeURIComponent(`Portfolio contact from ${data.name}`);
      window.open(`mailto:${meta.email}?subject=${subject}&body=${body}`);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  const field =
    "w-full rounded-lg border border-border bg-bg-elev px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent";

  return (
    <Section id="contact" label="Contact">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <Reveal>
          <h2 className="font-display text-3xl font-medium tracking-tight">
            Let&apos;s connect.
          </h2>
          <p className="mt-4 max-w-md text-text-muted">
            Always glad to talk about production ML, agentic systems, retrieval that
            behaves, or the unglamorous engineering that keeps AI honest.
          </p>

          <div className="mt-8 flex flex-col">
            {links.map(({ kind, label, href, Icon }) => (
              <a
                key={kind}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-4 border-t border-border py-4 transition-all last:border-b hover:pl-2"
              >
                <span className="grid h-10 w-10 place-items-center rounded-lg border border-border text-text-muted transition-colors group-hover:border-accent group-hover:text-accent">
                  <Icon size={17} />
                </span>
                <span className="flex flex-col">
                  <span className="text-xs uppercase tracking-wide text-text-dim">
                    {kind}
                  </span>
                  <span className="font-mono text-sm">{label}</span>
                </span>
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-xl border border-border bg-bg-elev p-6"
            noValidate
          >
            {/* honeypot — hidden from humans, bots fill it */}
            <div className="hidden" aria-hidden>
              <input tabIndex={-1} autoComplete="off" {...register("_gotcha")} />
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm text-text-muted">Name</label>
                <input
                  className={field}
                  placeholder="Your name"
                  suppressHydrationWarning
                  {...register("name")}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-text-muted">Email</label>
                <input
                  className={field}
                  placeholder="you@example.com"
                  suppressHydrationWarning
                  {...register("email")}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-text-muted">Message</label>
                <textarea
                  rows={4}
                  className={`${field} resize-none`}
                  placeholder="What's on your mind?"
                  suppressHydrationWarning
                  {...register("message")}
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-red-400">{errors.message.message}</p>
                )}
              </div>

              <motion.button
                type="submit"
                disabled={status === "sending" || status === "sent"}
                whileTap={{ scale: 0.97 }}
                suppressHydrationWarning
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-medium text-white transition-all hover:brightness-110 disabled:opacity-70"
              >
                {status === "sent" ? (
                  <>
                    <Check size={16} /> Message sent — I&apos;ll be in touch!
                  </>
                ) : status === "sending" ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Sending…
                  </>
                ) : status === "error" ? (
                  <>
                    <AlertCircle size={16} /> Opened mail client as fallback
                  </>
                ) : (
                  <>
                    <Send size={16} /> Send Message
                  </>
                )}
              </motion.button>

              {status === "sent" && (
                <p className="text-center text-xs text-text-muted">
                  Your message has been delivered to my inbox directly.
                </p>
              )}
            </div>
          </form>
        </Reveal>
      </div>
    </Section>
  );
}
