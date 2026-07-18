import { create } from "zustand";

interface QuizQuestion {
  id: string;
  type: "multiple-choice" | "true-false" | "image-id";
  difficulty: "easy" | "medium" | "hard";
  category: string;
  question: { en: string; id: string };
  options: Array<{
    text: { en: string; id: string };
    correct: boolean;
  }>;
  explanation: { en: string; id: string };
  timeLimit: number;
}

interface QuizStore {
  // Session
  difficulty: "easy" | "medium" | "hard" | null;
  questions: QuizQuestion[];
  currentQuestion: number;
  answers: Record<number, string>;
  correctAnswers: number;
  streak: number;
  maxStreak: number;
  startTime: number;
  questionStartTime: number;

  // Timer
  timeRemaining: number;
  timerActive: boolean;

  // Results
  score: number;
  totalTime: number;
  timeBonus: number;

  // Actions
  startQuiz: (
    difficulty: "easy" | "medium" | "hard",
    questions: QuizQuestion[],
  ) => void;
  answerQuestion: (optionId: string, isCorrect: boolean) => void;
  nextQuestion: () => void;
  endQuiz: () => void;
  resetQuiz: () => void;
  setTimeRemaining: (time: number) => void;
  setTimerActive: (active: boolean) => void;
}

export const useQuizStore = create<QuizStore>((set, get) => ({
  // Initial state
  difficulty: null,
  questions: [],
  currentQuestion: 0,
  answers: {},
  correctAnswers: 0,
  streak: 0,
  maxStreak: 0,
  startTime: 0,
  questionStartTime: 0,
  timeRemaining: 15,
  timerActive: false,
  score: 0,
  totalTime: 0,
  timeBonus: 0,

  startQuiz: (difficulty, questions) => {
    const now = Date.now();
    set({
      difficulty,
      questions,
      currentQuestion: 1,
      answers: {},
      correctAnswers: 0,
      streak: 0,
      maxStreak: 0,
      startTime: now,
      questionStartTime: now,
      timeRemaining: 15,
      timerActive: true,
      score: 0,
      totalTime: 0,
      timeBonus: 0,
    });
  },

  answerQuestion: (optionId, isCorrect) => {
    const state = get();
    const questionTime = Math.floor(
      (Date.now() - state.questionStartTime) / 1000,
    );
    const newCorrectAnswers = isCorrect
      ? state.correctAnswers + 1
      : state.correctAnswers;
    const newStreak = isCorrect ? state.streak + 1 : 0;
    const newMaxStreak = Math.max(state.maxStreak, newStreak);

    set({
      answers: { ...state.answers, [state.currentQuestion - 1]: optionId },
      correctAnswers: newCorrectAnswers,
      streak: newStreak,
      maxStreak: newMaxStreak,
      timerActive: false,
    });
  },

  nextQuestion: () => {
    const state = get();
    const now = Date.now();
    set({
      currentQuestion: state.currentQuestion + 1,
      questionStartTime: now,
      timeRemaining: 15,
      timerActive: true,
    });
  },

  endQuiz: () => {
    const state = get();
    const totalTime = Math.floor((Date.now() - state.startTime) / 1000);
    set({
      totalTime,
      timerActive: false,
    });
  },

  resetQuiz: () => {
    set({
      difficulty: null,
      questions: [],
      currentQuestion: 0,
      answers: {},
      correctAnswers: 0,
      streak: 0,
      maxStreak: 0,
      startTime: 0,
      questionStartTime: 0,
      timeRemaining: 15,
      timerActive: false,
      score: 0,
      totalTime: 0,
      timeBonus: 0,
    });
  },

  setTimeRemaining: (time) => set({ timeRemaining: time }),
  setTimerActive: (active) => set({ timerActive: active }),
}));
