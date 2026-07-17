export const MS_PER_DAY = 86_400_000;
export const SECONDS_PER_DAY = 86_400;
export const DAYS_PER_YEAR = 365;

export const MAX_DAY_OFFSET = 36_500;
export const TIME_TRAVEL_THRESHOLD_DAYS = 365;
export const SPEED_ACHIEVEMENT_THRESHOLD = 86_400;
export const LEVEL_STEP_XP = 100;

export const PLANET_ROTATION_UNIT = 0.01;
export const CLOUD_ROTATION_UNIT = 0.012;
export const REDUCED_MOTION_TIME_FACTOR = 0.3;

export const SPEED_PRESETS = [
  { key: "realtime", value: 1 },
  { key: "minPerSec", value: 60 },
  { key: "hourPerSec", value: 3600 },
  { key: "dayPerSec", value: 86_400 },
  { key: "weekPerSec", value: 604_800 },
  { key: "monthPerSec", value: 2_592_000 },
  { key: "yearPerSec", value: 31_536_000 },
] as const;

export const JUMP_AMOUNTS = [
  { key: "back1Year", delta: -365 },
  { key: "back1Month", delta: -30 },
  { key: "today", delta: 0 },
  { key: "forward1Month", delta: 30 },
  { key: "forward1Year", delta: 365 },
] as const;

export function clampDayOffset(value: number): number {
  return Math.max(0, Math.min(MAX_DAY_OFFSET, value));
}
