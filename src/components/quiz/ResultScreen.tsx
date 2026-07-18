"use client";

import { Trophy, Clock, Zap } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface ResultScreenProps {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  totalTime: number;
  maxStreak: number;
  timeBonus: number;
  achievements: Achievement[];
  onTryAgain: () => void;
  onViewLeaderboard: () => void;
}

export function ResultScreen({
  score,
  totalQuestions,
  correctAnswers,
  totalTime,
  maxStreak,
  timeBonus,
  achievements,
  onTryAgain,
  onViewLeaderboard,
}: ResultScreenProps) {
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  const minutes = Math.floor(totalTime / 60);
  const seconds = totalTime % 60;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cosmic-deep p-6">
      <div className="mx-auto w-full max-w-2xl text-center">
        {/* Trophy Icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 ring-4 ring-yellow-500/30">
            <Trophy className="h-12 w-12 text-yellow-500" />
          </div>
        </div>

        {/* Title */}
        <h1 className="mb-8 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-4xl font-bold text-transparent">
          Quiz Complete!
        </h1>

        {/* Score Card */}
        <div className="mb-8 rounded-2xl border-3 border-white/10 bg-gradient-to-br from-cosmic-accent/10 to-orange-500/10 p-8 backdrop-blur-md">
          <div className="mb-6 text-6xl font-bold text-white">
            {percentage}%
          </div>
          <div className="grid gap-4 text-left sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-xl bg-white/5 p-4">
              <span className="text-white/60">Score</span>
              <span className="text-xl font-bold text-white">
                {correctAnswers}/{totalQuestions}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/5 p-4">
              <span className="flex items-center gap-2 text-white/60">
                <Clock className="h-4 w-4" />
                Time
              </span>
              <span className="text-xl font-bold text-white">
                {minutes}:{seconds.toString().padStart(2, "0")}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/5 p-4">
              <span className="flex items-center gap-2 text-white/60">
                <Zap className="h-4 w-4" />
                Streak
              </span>
              <span className="text-xl font-bold text-white">{maxStreak}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/5 p-4">
              <span className="text-white/60">Bonus</span>
              <span className="text-xl font-bold text-green-400">
                +{timeBonus} pts
              </span>
            </div>
          </div>
        </div>

        {/* Achievements */}
        {achievements.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-bold text-white">
              Achievements Unlocked
            </h2>
            <div className="flex flex-col gap-3">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-center gap-4 rounded-2xl border-3 border-yellow-500/20 bg-gradient-to-r from-yellow-500/10 to-transparent p-4 backdrop-blur-md"
                >
                  <div className="text-3xl">{achievement.icon}</div>
                  <div className="text-left">
                    <div className="font-bold text-white">
                      {achievement.title}
                    </div>
                    <div className="text-sm text-white/60">
                      {achievement.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <button
            onClick={onTryAgain}
            className="rounded-2xl border-3 border-cosmic-accent/30 bg-gradient-to-r from-cosmic-accent/20 to-orange-500/20 px-8 py-4 font-bold text-white backdrop-blur-md transition-all hover:scale-105 hover:border-cosmic-accent/50 hover:shadow-[0_0_30px_rgba(96,165,250,0.4)]"
          >
            Try Again
          </button>
          <button
            onClick={onViewLeaderboard}
            className="rounded-2xl border-3 border-white/10 bg-white/5 px-8 py-4 font-bold text-white backdrop-blur-md transition-all hover:scale-105 hover:border-white/20 hover:bg-white/10"
          >
            View Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
}
