import Link from "next/link";
import { ArrowRight, Bot, Play } from "lucide-react";

export const metadata = {
  title: "Watch Demo — Realty AI",
  description: "A 90-second look at Realty AI — live chat, live calls, live booking.",
};

export default function WatchDemoPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#08090c] px-6 py-20 text-white">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-blue-600/[0.12] blur-[150px]" />

      <div className="relative mx-auto flex max-w-2xl flex-col items-center text-center">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.05] border border-white/10">
          <Bot className="h-6 w-6 text-blue-400" />
        </div>

        <h1 className="text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
          Watch Realty AI <span className="text-white/40">in action.</span>
        </h1>
        <p className="mt-5 max-w-lg text-base leading-7 text-white/50 sm:text-lg">
          A 90-second walkthrough — live WhatsApp chat, a live voice call, instant
          calendar booking, and the dashboard that ties it together. Pick a language.
        </p>

        <div className="mt-11 grid w-full gap-4 sm:grid-cols-2">
          <Link
            href="/demo/index.html"
            className="group flex flex-col items-center gap-3 rounded-3xl border border-white/10 bg-white/[0.03] px-8 py-10 transition hover:border-blue-400/40 hover:bg-white/[0.06]"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-400 transition group-hover:scale-105">
              <Play className="h-5 w-5" fill="currentColor" />
            </span>
            <span className="text-lg font-semibold">Watch in English</span>
            <span className="flex items-center gap-1.5 text-sm text-white/40 transition group-hover:text-white/70">
              Start demo <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>

          <Link
            href="/demo/hindi/index.html"
            className="group flex flex-col items-center gap-3 rounded-3xl border border-white/10 bg-white/[0.03] px-8 py-10 transition hover:border-amber-400/40 hover:bg-white/[0.06]"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-400/10 text-amber-300 transition group-hover:scale-105">
              <Play className="h-5 w-5" fill="currentColor" />
            </span>
            <span className="text-lg font-semibold">हिंदी में देखें</span>
            <span className="flex items-center gap-1.5 text-sm text-white/40 transition group-hover:text-white/70">
              डेमो शुरू करें <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        </div>

        <p className="mt-10 text-xs text-white/30">
          Each version has its own link, so you can send either one directly — no
          need to send this picker page.
        </p>
      </div>
    </main>
  );
}
