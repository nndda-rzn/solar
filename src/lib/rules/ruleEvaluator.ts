import { Rule } from "@/types/achievement";
import { Progress } from "@/types/progress";

export function evaluateRule(
  rule: Rule,
  progress: Progress[],
  context?: { now?: number },
): boolean {
  const now = context?.now ?? Date.now();

  switch (rule.type) {
    case "count_unique": {
      const matching = progress.filter((p) => p.category === rule.category);
      const uniqueTargets = new Set(matching.map((p) => p.targetId));
      return uniqueTargets.size >= (rule.threshold ?? 1);
    }

    case "has_target": {
      return progress.some(
        (p) => p.category === rule.category && p.targetId === rule.targetId,
      );
    }

    case "count_total": {
      const total = progress.filter((p) => p.category === rule.category).length;
      return total >= (rule.threshold ?? 1);
    }

    case "time_window": {
      const matching = progress.filter(
        (p) =>
          p.category === rule.category &&
          new Date(p.completedAt).getTime() >= now - (rule.windowMs ?? 0),
      );
      const uniqueTargets = new Set(matching.map((p) => p.targetId));
      return uniqueTargets.size >= (rule.threshold ?? 1);
    }

    case "combination": {
      if (!rule.rules || rule.rules.length === 0) return false;
      if (rule.operator === "or") {
        return rule.rules.some((r) => evaluateRule(r, progress, context));
      }
      return rule.rules.every((r) => evaluateRule(r, progress, context));
    }

    default:
      return false;
  }
}
