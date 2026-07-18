"use client";

import { useTranslations } from "next-intl";
import { Brain } from "lucide-react";

export default function QuizPage() {
  const t = useTranslations("common");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cosmic-deep p-6">
      <div className="mx-auto max-w-4xl text-center">
        {/* Header */}
        <div className="mb-8 flex flex-col items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-cosmic-accent/20 to-orange-500/20 ring-2 ring-cosmic-accent/30">
            <Brain className="h-10 w-10 text-cosmic-accent" />
          </div>
          <h1 className="bg-gradient-to-r from-cosmic-accent via-purple-400 to-orange-400 bg-clip-text text-4xl font-bold text-transparent">
            Cosmic Quiz
          </h1>
          <p className="text-lg text-white/60">Test your space knowledge</p>
        </div>

        {/* Difficulty Cards */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          {/* Easy */}
          <button className="group relative overflow-hidden rounded-2xl border-3 border-green-500/20 bg-gradient-to-br from-green-500/10 to-transparent p-6 backdrop-blur-md transition-all hover:scale-105 hover:border-green-500/40 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)]">
            <div className="mb-4 text-6xl">🟢</div>
            <h3 className="mb-2 text-2xl font-bold text-white">Easy</h3>
            <p className="text-sm text-white/50">Basic planet facts</p>
          </button>

          {/* Medium */}
          <button className="group relative overflow-hidden rounded-2xl border-3 border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-transparent p-6 backdrop-blur-md transition-all hover:scale-105 hover:border-orange-500/40 hover:shadow-[0_0_30px_rgba(249,115,22,0.3)]">
            <div className="mb-4 text-6xl">🟡</div>
            <h3 className="mb-2 text-2xl font-bold text-white">Medium</h3>
            <p className="text-sm text-white/50">Stars & distances</p>
          </button>

          {/* Hard */}
          <button className="group relative overflow-hidden rounded-2xl border-3 border-red-500/20 bg-gradient-to-br from-red-500/10 to-transparent p-6 backdrop-blur-md transition-all hover:scale-105 hover:border-red-500/40 hover:shadow-[0_0_30px_rgba(239,68,68,0.3)]">
            <div className="mb-4 text-6xl">🔴</div>
            <h3 className="mb-2 text-2xl font-bold text-white">Hard</h3>
            <p className="text-sm text-white/50">Mythology & data</p>
          </button>
        </div>

        {/* Start Button */}
        <button className="group relative overflow-hidden rounded-2xl border-3 border-cosmic-accent/30 bg-gradient-to-r from-cosmic-accent/20 to-orange-500/20 px-8 py-4 font-bold text-white backdrop-blur-md transition-all hover:scale-105 hover:border-cosmic-accent/50 hover:shadow-[0_0_30px_rgba(96,165,250,0.4)]">
          <span className="relative z-10">Start Quiz →</span>
          <div className="absolute inset-0 bg-gradient-to-r from-cosmic-accent/0 via-cosmic-accent/10 to-cosmic-accent/0 opacity-0 transition-opacity group-hover:opacity-100" />
        </button>

        {/* Stats */}
        <p className="mt-8 text-sm text-white/40">
          Coming soon: Track your progress
        </p>
      </div>
    </div>
  );
}
