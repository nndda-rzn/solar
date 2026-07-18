import { evaluateRule } from "../../rules/ruleEvaluator";
import { Progress, ProgressCategory } from "@/types/progress";

function makeProgress(
  category: ProgressCategory,
  targetId: string,
  hoursAgo = 0,
): Progress {
  return {
    id: `${category}-${targetId}`,
    userId: "test-user",
    category,
    targetId,
    metadata: {},
    completedAt: new Date(Date.now() - hoursAgo * 3600000).toISOString(),
  };
}

describe("evaluateRule", () => {
  describe("count_unique", () => {
    it("returns true when threshold met", () => {
      const progress = [
        makeProgress("visited_planet", "earth"),
        makeProgress("visited_planet", "mars"),
        makeProgress("visited_planet", "venus"),
        makeProgress("visited_planet", "jupiter"),
      ];
      expect(
        evaluateRule(
          { type: "count_unique", category: "visited_planet", threshold: 4 },
          progress,
        ),
      ).toBe(true);
    });

    it("returns false when under threshold", () => {
      const progress = [makeProgress("visited_planet", "earth")];
      expect(
        evaluateRule(
          { type: "count_unique", category: "visited_planet", threshold: 4 },
          progress,
        ),
      ).toBe(false);
    });

    it("deduplicates target ids", () => {
      const progress = [
        makeProgress("visited_planet", "earth"),
        makeProgress("visited_planet", "earth"),
        makeProgress("visited_planet", "earth"),
      ];
      expect(
        evaluateRule(
          { type: "count_unique", category: "visited_planet", threshold: 2 },
          progress,
        ),
      ).toBe(false);
    });
  });

  describe("has_target", () => {
    it("returns true when target exists", () => {
      const progress = [makeProgress("time_traveled", "day_365")];
      expect(
        evaluateRule(
          {
            type: "has_target",
            category: "time_traveled",
            targetId: "day_365",
          },
          progress,
        ),
      ).toBe(true);
    });

    it("returns false when target missing", () => {
      const progress = [makeProgress("time_traveled", "day_100")];
      expect(
        evaluateRule(
          {
            type: "has_target",
            category: "time_traveled",
            targetId: "day_365",
          },
          progress,
        ),
      ).toBe(false);
    });
  });

  describe("count_total", () => {
    it("counts duplicates", () => {
      const progress = [
        makeProgress("panel_opened", "earth"),
        makeProgress("panel_opened", "earth"),
        makeProgress("panel_opened", "mars"),
      ];
      expect(
        evaluateRule(
          { type: "count_total", category: "panel_opened", threshold: 3 },
          progress,
        ),
      ).toBe(true);
    });
  });

  describe("combination", () => {
    it("AND: all rules must pass", () => {
      const progress = [
        makeProgress("visited_planet", "earth"),
        makeProgress("visited_star", "sirius"),
      ];
      expect(
        evaluateRule(
          {
            type: "combination",
            category: "visited_planet",
            operator: "and",
            rules: [
              {
                type: "count_unique",
                category: "visited_planet",
                threshold: 1,
              },
              { type: "count_unique", category: "visited_star", threshold: 1 },
            ],
          },
          progress,
        ),
      ).toBe(true);
    });

    it("OR: any rule can pass", () => {
      const progress = [makeProgress("visited_planet", "earth")];
      expect(
        evaluateRule(
          {
            type: "combination",
            category: "visited_planet",
            operator: "or",
            rules: [
              { type: "count_unique", category: "visited_star", threshold: 1 },
              {
                type: "count_unique",
                category: "visited_planet",
                threshold: 1,
              },
            ],
          },
          progress,
        ),
      ).toBe(true);
    });
  });
});
