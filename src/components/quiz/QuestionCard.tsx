"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface QuestionCardProps {
  question: string;
  options: Array<{ id: string; text: string }>;
  currentQuestion: number;
  totalQuestions: number;
  timeRemaining: number;
  onAnswer: (optionId: string) => void;
  selectedOption?: string;
}

export function QuestionCard({
  question,
  options,
  currentQuestion,
  totalQuestions,
  timeRemaining,
  onAnswer,
  selectedOption,
}: QuestionCardProps) {
  const progress = (currentQuestion / totalQuestions) * 100;
  const timePercent = (timeRemaining / 15) * 100;

  // Timer color shift
  const timerColor =
    timeRemaining > 10
      ? "stroke-green-500"
      : timeRemaining > 5
        ? "stroke-orange-500"
        : "stroke-red-500";

  const circumference = 2 * Math.PI * 20;
  const strokeDashoffset = circumference - (timePercent / 100) * circumference;

  return (
    <div className="mx-auto w-full max-w-3xl p-6">
      {/* Top bar */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-white/60">
          Question {currentQuestion}/{totalQuestions}
        </span>

        {/* Timer SVG circle */}
        <div className="relative flex items-center gap-2">
          <svg className="h-12 w-12 -rotate-90 transform">
            <circle
              cx="24"
              cy="24"
              r="20"
              className="fill-none stroke-white/10"
              strokeWidth="3"
            />
            <circle
              cx="24"
              cy="24"
              r="20"
              className={`fill-none transition-all duration-1000 ${timerColor}`}
              strokeWidth="3"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <span
            className={`absolute inset-0 flex items-center justify-center text-sm font-bold ${timeRemaining <= 5 ? "text-red-400" : "text-white"}`}
          >
            {timeRemaining}
          </span>
          <Clock className="h-4 w-4 text-white/40" />
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6 h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full bg-gradient-to-r from-cosmic-accent to-orange-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question */}
      <div className="mb-8 rounded-2xl border-3 border-white/10 bg-gradient-to-br from-cosmic-accent/10 to-transparent p-6 backdrop-blur-md">
        <h2 className="text-xl font-bold text-white">{question}</h2>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-4">
        {options.map((option, index) => {
          const isSelected = selectedOption === option.id;
          const labels = ["A", "B", "C", "D"];

          return (
            <button
              key={option.id}
              onClick={() => onAnswer(option.id)}
              disabled={!!selectedOption}
              className={`group relative overflow-hidden rounded-2xl border-3 p-6 text-left transition-all ${
                isSelected
                  ? "scale-105 border-cosmic-accent bg-cosmic-accent/20 shadow-[0_0_30px_rgba(96,165,250,0.4)]"
                  : "border-white/10 bg-white/5 hover:scale-102 hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold ${
                    isSelected
                      ? "bg-cosmic-accent text-white"
                      : "bg-white/10 text-white/60 group-hover:bg-white/20 group-hover:text-white"
                  }`}
                >
                  {labels[index]}
                </div>
                <span className="text-white">{option.text}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
