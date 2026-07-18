# Quiz Feature - Implementation Plan

**Status:** Design Complete, Ready for Implementation  
**Estimate:** 3-4 days  
**Date:** 2026-07-18

---

## Overview

Educational quiz system with gamification. Dark Claymorphism design. Bilingual EN/ID. 100 questions, 3 difficulty levels, sound FX, achievements, leaderboard.

---

## Design System

### Style: Dark Claymorphism

- Base: cosmic-deep (#0a0e1a), cosmic-black (#0D1117)
- Accent: cosmic-accent (cyan) + quiz-orange (#F97316)
- Shadows: inner glow + outer shadow (dark-adapted)
- Border: 3px cosmic-accent/20, rounded-2xl (16px)
- Glass overlay: backdrop-blur-md + bg-white/5
- Typography: existing app font (consistency over playful)

### Components Style

- Cards: rounded-2xl, border-3, inner+outer shadow
- Hover: scale(1.02), glow pulse, 150ms ease-out
- Selected: border-2 cosmic-accent, bg-cosmic-accent/10
- Focus: 2px cosmic-accent ring (keyboard nav)

---

## User Flow

### 1. Landing `/quiz`

```
Hero + Difficulty Cards (3 horizontal)
- Easy 🟢 (40 questions pool)
- Medium 🟡 (40 questions pool)
- Hard 🔴 (20 questions pool)

[Start Quiz] button
Stats: "12 completed, 87% avg"
```

### 2. Question Screen

```
Top bar: [X] Question 3/10  ⏱ 00:08
Progress: ━━━━━━━━━━━━━━━━━━━━━━━━━ 30%

Question card: "Which planet is largest?"

4 Option cards (vertical stack):
- A. Jupiter [select]
- B. Saturn [select]
- C. Earth [select]
- D. Neptune [select]

Timer: SVG circle countdown (clockwise fill)
- 0-15s: green
- 5-10s: orange
- <5s: red
```

### 3. Result Screen

```
🏆 Quiz Complete!

Score card:
- Score: 8/10 (80%)
- Time: 01:23
- Streak: 5 correct
- Bonus: +20 pts (speed)

Achievements Unlocked:
🌟 Speed Demon (avg <4s)
🎯 Accuracy Pro (80%+)

[Try Again] [View Leaderboard]
```

---

## Question Schema

```json
{
  "id": "q001",
  "type": "multiple-choice",
  "difficulty": "easy",
  "category": "planets",
  "question": {
    "en": "Which planet is the largest in our solar system?",
    "id": "Planet mana yang terbesar di tata surya kita?"
  },
  "options": [
    {
      "text": { "en": "Jupiter", "id": "Jupiter" },
      "correct": true
    },
    {
      "text": { "en": "Saturn", "id": "Saturnus" },
      "correct": false
    },
    {
      "text": { "en": "Earth", "id": "Bumi" },
      "correct": false
    },
    {
      "text": { "en": "Neptune", "id": "Neptunus" },
      "correct": false
    }
  ],
  "explanation": {
    "en": "Jupiter's mass is more than twice that of all other planets combined.",
    "id": "Massa Jupiter lebih dari dua kali lipat massa semua planet lain digabungkan."
  },
  "timeLimit": 15
}
```

### Question Types (100 total)

1. **Multiple Choice** (80 questions)
   - 4 options, 1 correct
   - Categories: planets, dwarf planets, stars, constellations, mythology

2. **True/False** (10 questions)
   - 2 options
   - Quick facts verification

3. **Image Identification** (10 questions)
   - Planet texture → name
   - Uses `/textures/planets/` assets

### Difficulty Distribution

- Easy: 40 questions (planets, basic facts)
- Medium: 40 questions (dwarf planets, stars, distances)
- Hard: 20 questions (mythology, precise data, constellations)

---

## Scoring System

### Base Score

- Correct: +10 pts
- Incorrect: 0 pts (no penalty)
- Show explanation after wrong answer

### Time Bonus

- Answer <5s: +5 pts
- Answer 5-10s: +3 pts
- Answer >10s: +0 pts

### Streak Multiplier

- 3+ correct consecutive: ×1.5 all points
- 5+ correct consecutive: ×2.0 all points
- Reset on wrong answer

### Example Calculation

```
Question 1: Correct in 4s = 10 + 5 = 15 pts
Question 2: Correct in 3s = 10 + 5 = 15 pts
Question 3: Correct in 6s = 10 + 3 = 13 pts
Question 4: Correct in 4s = (10 + 5) × 1.5 = 22.5 pts (streak ×1.5)
Question 5: Wrong = 0 pts (streak reset)

Total: 15 + 15 + 13 + 22.5 + 0 = 65.5 pts
```

---

## Gamification

### Sound Effects (Web Audio API)

- Correct: soft ding (200ms)
- Wrong: low buzz (150ms)
- Achievement unlock: fanfare (500ms)
- Muted default, toggle in settings

### Animations

- Confetti: achievement unlock (1s burst, canvas-confetti)
- Option hover: scale(1.02) + glow pulse
- Timer: stroke-dashoffset animated
- Progress bar: smooth width transition

### Achievements

1. **Speed Demon** — avg answer time <4s
2. **Accuracy Pro** — score 80%+
3. **Perfect Score** — 10/10 correct
4. **5 Perfect Scores** — 5 quizzes 100%
5. **Quiz Master** — complete 50 quizzes
6. **Cosmic Scholar** — complete all difficulties

### Leaderboard

- Top 10 weekly scores
- Supabase table: `quiz_scores`
- Columns: user_id, score, time, difficulty, created_at
- Order by: score DESC, time ASC

---

## Data Structure

### Quiz Store (Zustand)

```typescript
interface QuizStore {
  // Session state
  currentQuestion: number;
  answers: Record<number, string>; // questionIndex -> optionId
  correctAnswers: number;
  streak: number;
  startTime: number;
  questionStartTime: number;

  // Timer
  timeRemaining: number;
  timerActive: boolean;

  // Results
  score: number;
  totalTime: number;

  // Actions
  startQuiz: (difficulty: "easy" | "medium" | "hard") => void;
  answerQuestion: (optionId: string) => void;
  nextQuestion: () => void;
  endQuiz: () => void;
  resetQuiz: () => void;
}
```

### Supabase Tables

#### `quiz_scores`

```sql
CREATE TABLE quiz_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL DEFAULT 10,
  correct_answers INTEGER NOT NULL,
  total_time INTEGER NOT NULL, -- seconds
  streak_max INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_quiz_scores_user ON quiz_scores(user_id);
CREATE INDEX idx_quiz_scores_leaderboard ON quiz_scores(difficulty, score DESC, total_time ASC);
```

#### `user_achievements`

```sql
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

CREATE INDEX idx_user_achievements_user ON user_achievements(user_id);
```

---

## Implementation Roadmap

### Day 1: Data + Routes

**Files:**

1. `src/data/quiz/questions.json` — 100 questions bilingual
2. `src/app/[locale]/quiz/page.tsx` — landing difficulty select
3. `src/messages/en/common.json` — i18n keys
4. `src/messages/id/common.json` — i18n keys
5. `src/components/layout/Sidebar.tsx:36` — add quiz nav item

**Tasks:**

- [ ] Write 40 easy questions (planets, basic facts)
- [ ] Write 40 medium questions (dwarf planets, stars, distances)
- [ ] Write 20 hard questions (mythology, precise data, constellations)
- [ ] Add i18n keys: `nav.quiz`, `quiz.landing.*`, `quiz.question.*`, `quiz.result.*`
- [ ] Add sidebar nav item (Brain icon, position 5)
- [ ] Create `/quiz` route landing page

### Day 2: Core Components

**Files:** 6. `src/components/quiz/QuestionCard.tsx` — timer, options, progress 7. `src/components/quiz/ResultScreen.tsx` — score, achievements 8. `src/components/quiz/DifficultyCard.tsx` — landing cards 9. `src/lib/store/quiz-store.ts` — Zustand state 10. `src/lib/utils/quiz-scoring.ts` — calculate score, time bonus, streak

**Tasks:**

- [ ] Build QuestionCard (timer SVG, 4 options vertical, progress bar)
- [ ] Build ResultScreen (score card, achievements list, actions)
- [ ] Build DifficultyCard (3 cards horizontal, hover glow)
- [ ] Implement quiz-store (session state, actions, timer logic)
- [ ] Implement quiz-scoring (base + time bonus + streak multiplier)

### Day 3: Integration + Database

**Files:** 11. `src/hooks/useQuizTimer.ts` — countdown logic 12. `src/hooks/useQuizSound.ts` — Web Audio FX 13. `docs/sql/quiz-tables.sql` — Supabase schema 14. `src/lib/supabase/quiz-api.ts` — save score, fetch leaderboard

**Tasks:**

- [ ] Implement useQuizTimer (countdown, color shift, auto-submit)
- [ ] Implement useQuizSound (ding/buzz/fanfare, muted toggle)
- [ ] Create Supabase tables: quiz_scores, user_achievements
- [ ] API functions: saveQuizScore(), getLeaderboard(), unlockAchievement()
- [ ] Test quiz flow: start → answer 10 → submit → save score

### Day 4: Polish + Leaderboard

**Files:** 15. `src/components/quiz/LeaderboardPanel.tsx` — top 10 weekly 16. `src/components/quiz/AchievementUnlock.tsx` — confetti animation 17. `src/app/[locale]/profile/page.tsx` — quiz stats integration 18. `src/lib/utils/achievements.ts` — check unlock conditions

**Tasks:**

- [ ] Build LeaderboardPanel (top 10 table, filter by difficulty)
- [ ] Build AchievementUnlock (canvas-confetti, badge reveal)
- [ ] Add quiz stats to profile (total quizzes, avg score, best streak)
- [ ] Implement achievement check logic (6 achievements)
- [ ] Accessibility audit (keyboard nav, ARIA, focus trap)
- [ ] Test sound FX, confetti, timer animations

---

## Keyboard Navigation

**Landing:**

- Tab: focus difficulty cards
- Enter/Space: select difficulty, start quiz

**Question Screen:**

- Arrow Up/Down: select option
- Enter/Space: submit answer
- Esc: exit quiz (confirm modal)

**Result Screen:**

- Tab: focus action buttons
- Enter: trigger action

**Focus Indicators:**

- 2px cosmic-accent ring
- Visible on all interactive elements

---

## Accessibility

### WCAG 2.1 AA Compliance

- [ ] Color contrast 4.5:1 minimum (text/background)
- [ ] Focus indicators visible (2px cosmic-accent ring)
- [ ] Keyboard navigation (Tab, Arrow, Enter, Esc)
- [ ] ARIA labels (role="radiogroup" options, aria-live timer)
- [ ] prefers-reduced-motion (disable confetti, scale animations)
- [ ] Screen reader announcements (question number, time remaining, score)

### Timer Accessibility

- Visual: SVG circle + color shift
- Auditory: optional tick sound last 5s (off default)
- Screen reader: aria-live="polite" time remaining announcements

---

## Performance

### Optimizations

- Questions JSON: lazy load per difficulty (3 chunks vs 1 large file)
- Timer: RAF (requestAnimationFrame) vs setInterval
- Confetti: canvas-confetti library (GPU-accelerated)
- Sound: preload audio buffers on mount

### Bundle Impact

- Questions JSON: ~50KB total (gzipped ~15KB)
- canvas-confetti: 5KB gzipped
- Total route JS: +20KB est

---

## Testing Checklist

### Functional

- [ ] Start quiz (all 3 difficulties)
- [ ] Answer 10 questions (correct, incorrect, timeout)
- [ ] Timer countdown (visual + auto-submit)
- [ ] Score calculation (base + time bonus + streak)
- [ ] Achievement unlock (all 6 conditions)
- [ ] Leaderboard fetch (top 10 weekly)
- [ ] Profile stats update
- [ ] Sound FX (correct/wrong/achievement)
- [ ] Confetti animation

### Edge Cases

- [ ] Exit quiz mid-session (confirm modal)
- [ ] Network failure (retry save score)
- [ ] Timer at 0s (auto-submit)
- [ ] Duplicate achievement unlock (idempotent)
- [ ] Leaderboard empty state

### Browser/Device

- [ ] Chrome, Firefox, Safari, Edge
- [ ] Mobile 375px, tablet 768px, desktop 1440px
- [ ] Keyboard-only navigation
- [ ] Screen reader (NVDA/JAWS/VoiceOver)

---

## File Structure

```
src/
├── app/
│   └── [locale]/
│       └── quiz/
│           ├── page.tsx              # Landing (difficulty select)
│           └── [id]/
│               └── page.tsx          # Question screen (future: shareable quiz sessions)
├── components/
│   └── quiz/
│       ├── QuestionCard.tsx          # Timer, options, progress
│       ├── ResultScreen.tsx          # Score, achievements, actions
│       ├── DifficultyCard.tsx        # Landing difficulty cards
│       ├── LeaderboardPanel.tsx      # Top 10 weekly
│       └── AchievementUnlock.tsx     # Confetti + badge reveal
├── data/
│   └── quiz/
│       ├── questions-easy.json       # 40 questions
│       ├── questions-medium.json     # 40 questions
│       └── questions-hard.json       # 20 questions
├── hooks/
│   ├── useQuizTimer.ts               # Countdown logic
│   └── useQuizSound.ts               # Web Audio FX
├── lib/
│   ├── store/
│   │   └── quiz-store.ts             # Zustand session state
│   ├── supabase/
│   │   └── quiz-api.ts               # Save score, fetch leaderboard
│   └── utils/
│       ├── quiz-scoring.ts           # Calculate score + bonus + streak
│       └── achievements.ts           # Check unlock conditions
└── messages/
    ├── en/
    │   └── common.json               # quiz.* keys
    └── id/
        └── common.json               # quiz.* keys

docs/
└── sql/
    └── quiz-tables.sql               # Supabase schema
```

---

## i18n Keys

### Navigation

```json
{
  "nav": {
    "quiz": "Quiz"
  }
}
```

### Landing

```json
{
  "quiz": {
    "landing": {
      "title": "Cosmic Quiz",
      "subtitle": "Test your space knowledge",
      "easy": "Easy",
      "medium": "Medium",
      "hard": "Hard",
      "start": "Start Quiz",
      "stats": "{count} completed, {avg}% avg"
    }
  }
}
```

### Question Screen

```json
{
  "quiz": {
    "question": {
      "progress": "Question {current}/{total}",
      "timeRemaining": "{seconds}s remaining",
      "submit": "Submit Answer",
      "explanation": "Explanation"
    }
  }
}
```

### Result Screen

```json
{
  "quiz": {
    "result": {
      "title": "Quiz Complete!",
      "score": "Score",
      "time": "Time",
      "streak": "Streak",
      "bonus": "Bonus",
      "achievementsUnlocked": "Achievements Unlocked",
      "tryAgain": "Try Again",
      "viewLeaderboard": "View Leaderboard"
    }
  }
}
```

---

## Assets

### Icons (lucide-react)

- Brain (sidebar nav)
- Clock (timer)
- CheckCircle (correct answer)
- XCircle (wrong answer)
- Trophy (achievements)
- Star (leaderboard)

### Sounds (Web Audio API)

- Correct: 440Hz sine wave 200ms (soft ding)
- Wrong: 200Hz sine wave 150ms (low buzz)
- Achievement: 523Hz → 659Hz → 783Hz arpeggio 500ms (fanfare)

### Images

- Planet textures: existing `/public/textures/planets/*.jpg`
- No additional assets required

---

## Success Metrics

### Engagement

- Target: 60% users complete 1+ quiz per session
- Target: 30% users complete 5+ quizzes per week

### Retention

- Target: 40% quiz completers return within 7 days
- Target: 20% unlock 3+ achievements

### Performance

- Quiz load time: <1s
- Question transition: <100ms
- Timer animation: 60fps

---

## Future Enhancements (Post-MVP)

### Phase 2

- Daily quiz challenge (1 shared quiz, global leaderboard)
- Quiz categories filter (planets-only, stars-only)
- Multiplayer quiz (2-4 players, live racing)

### Phase 3

- Custom quiz builder (user-generated questions)
- Quiz replay/review (incorrect answers breakdown)
- Adaptive difficulty (AI-adjust based on performance)

---

## Dependencies

### New Libraries

```json
{
  "canvas-confetti": "^1.9.3"
}
```

### Existing Stack

- Next.js 14 (App Router)
- React 18
- TypeScript 5
- Tailwind 4
- Zustand (state)
- Supabase (DB + Auth)
- next-intl (i18n)
- lucide-react (icons)

---

## Notes

- Questions content written by AI or sourced from existing library data
- Timer logic uses RAF (requestAnimationFrame) for smooth 60fps
- Confetti library GPU-accelerated, performance impact minimal
- Sound FX Web Audio API, no external audio files
- Leaderboard weekly reset (cron job or client-side filter)
- Achievement unlock idempotent (UNIQUE constraint user_id + achievement_id)

---

**Plan complete. Ready for Day 1 implementation.**
