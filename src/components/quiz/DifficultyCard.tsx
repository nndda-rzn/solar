"use client";

interface DifficultyCardProps {
  difficulty: "easy" | "medium" | "hard";
  emoji: string;
  title: string;
  description: string;
  onSelect: () => void;
}

export function DifficultyCard({
  difficulty,
  emoji,
  title,
  description,
  onSelect,
}: DifficultyCardProps) {
  const colors = {
    easy: {
      border: "border-green-500/20 hover:border-green-500/40",
      bg: "from-green-500/10",
      shadow: "hover:shadow-[0_0_30px_rgba(34,197,94,0.3)]",
    },
    medium: {
      border: "border-orange-500/20 hover:border-orange-500/40",
      bg: "from-orange-500/10",
      shadow: "hover:shadow-[0_0_30px_rgba(249,115,22,0.3)]",
    },
    hard: {
      border: "border-red-500/20 hover:border-red-500/40",
      bg: "from-red-500/10",
      shadow: "hover:shadow-[0_0_30px_rgba(239,68,68,0.3)]",
    },
  };

  const { border, bg, shadow } = colors[difficulty];

  return (
    <button
      onClick={onSelect}
      className={`group relative overflow-hidden rounded-2xl border-3 ${border} bg-gradient-to-br ${bg} to-transparent p-6 backdrop-blur-md transition-all hover:scale-105 ${shadow}`}
    >
      <div className="mb-4 text-6xl">{emoji}</div>
      <h3 className="mb-2 text-2xl font-bold text-white">{title}</h3>
      <p className="text-sm text-white/50">{description}</p>
    </button>
  );
}
