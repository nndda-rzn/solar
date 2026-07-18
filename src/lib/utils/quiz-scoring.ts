interface ScoreResult {
  baseScore: number;
  timeBonus: number;
  streakMultiplier: number;
  totalScore: number;
}

interface QuestionTiming {
  timeSpent: number;
  correct: boolean;
}

/**
 * Calculate base score (10 pts per correct answer)
 */
export function calculateBaseScore(correctAnswers: number): number {
  return correctAnswers * 10;
}

/**
 * Calculate time bonus based on answer speed
 * <5s: +5 pts
 * 5-10s: +3 pts
 * >10s: +0 pts
 */
export function calculateTimeBonus(timings: QuestionTiming[]): number {
  let bonus = 0;
  for (const timing of timings) {
    if (!timing.correct) continue;
    if (timing.timeSpent < 5) bonus += 5;
    else if (timing.timeSpent < 10) bonus += 3;
  }
  return bonus;
}

/**
 * Calculate streak multiplier
 * 3+ correct: ×1.5
 * 5+ correct: ×2.0
 */
export function calculateStreakMultiplier(maxStreak: number): number {
  if (maxStreak >= 5) return 2.0;
  if (maxStreak >= 3) return 1.5;
  return 1.0;
}

/**
 * Calculate total quiz score
 */
export function calculateQuizScore(
  correctAnswers: number,
  timings: QuestionTiming[],
  maxStreak: number,
): ScoreResult {
  const baseScore = calculateBaseScore(correctAnswers);
  const timeBonus = calculateTimeBonus(timings);
  const streakMultiplier = calculateStreakMultiplier(maxStreak);
  const totalScore = Math.floor((baseScore + timeBonus) * streakMultiplier);

  return {
    baseScore,
    timeBonus,
    streakMultiplier,
    totalScore,
  };
}

/**
 * Check achievement unlock conditions
 */
export function checkAchievements(
  correctAnswers: number,
  totalQuestions: number,
  avgTime: number,
  maxStreak: number,
): string[] {
  const unlocked: string[] = [];
  const percentage = (correctAnswers / totalQuestions) * 100;

  // Speed Demon - avg <4s
  if (avgTime < 4) unlocked.push("speed-demon");

  // Accuracy Pro - 80%+
  if (percentage >= 80) unlocked.push("accuracy-pro");

  // Perfect Score - 100%
  if (percentage === 100) unlocked.push("perfect-score");

  // Streak Master - 5+ streak
  if (maxStreak >= 5) unlocked.push("streak-master");

  return unlocked;
}
