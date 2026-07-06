export type CosmicEvent =
  | { type: "planet_visited"; payload: { id: string } }
  | { type: "star_visited"; payload: { id: string } }
  | { type: "constellation_visited"; payload: { id: string } }
  | { type: "search_used"; payload: { query: string } }
  | { type: "scale_reached"; payload: { scale: string } }
  | { type: "time_traveled"; payload: { dayOffset: number } }
  | { type: "bookmark_saved"; payload: { id: string } }
  | {
      type: "panel_opened";
      payload: {
        id: string;
        panelType: "planet" | "star" | "dwarf" | "constellation";
      };
    }
  | { type: "speed_reached"; payload: { speed: number } }
  | {
      type: "achievement_unlocked";
      payload: { achievementType: string; title: string; xp: number };
    }
  | { type: "level_up"; payload: { from: number; to: number } };

type Listener<E extends CosmicEvent> = (event: E) => void;
type AnyListener = (event: CosmicEvent) => void;

class EventBus {
  private listeners: Map<CosmicEvent["type"], Set<AnyListener>> = new Map();

  on<
    T extends CosmicEvent["type"],
    E extends Extract<CosmicEvent, { type: T }>,
  >(type: T, listener: Listener<E>): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    (this.listeners.get(type) as Set<AnyListener>).add(listener as AnyListener);
    return () => {
      (this.listeners.get(type) as Set<AnyListener>).delete(
        listener as AnyListener,
      );
    };
  }

  emit<E extends CosmicEvent>(event: E): void {
    const set = this.listeners.get(event.type);
    if (set) {
      set.forEach((fn) => fn(event));
    }
  }
}

export const cosmicEventBus = new EventBus();
