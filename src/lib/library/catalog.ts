import type { CatalogItem } from "@/components/library/CatalogGrid";
import type { LibraryDetailItem } from "@/components/library/LibraryDetail";
import type { LibraryTab } from "@/components/library/LibraryTabs";
import planetsData from "@/data/solar-system/planets.json";
import dwarfPlanetsData from "@/data/solar-system/dwarf-planets.json";
import starsData from "@/data/stellar/star-catalog.json";
import constellationsData from "@/data/stellar/constellations.json";

interface LocaleContent<L> {
  en?: L | undefined;
  id?: L | undefined;
}

interface PlanetJson {
  id: string;
  name: string;
  radius: number;
  distance: number;
  orbitalPeriod: number;
  mass: string;
  temperature: string;
  moonCount: number;
  description: string;
  funFacts: string[];
  color: string;
}

interface StarJson {
  id: string;
  name: string;
  magnitude: number;
  spectralType: string;
  color: string;
  distance: number;
  content?: LocaleContent<{ description: string; facts: string[] }>;
}

interface ConstellationJson {
  id: string;
  name: string;
  abbreviation: string;
  stars: string[];
  content?: LocaleContent<{ description: string; mythology: string }>;
}

export interface LibraryDetailItemRaw extends LibraryDetailItem {
  rawDescriptionEn?: string;
  rawDescriptionId?: string;
  rawFactsEn?: string[];
  rawFactsId?: string[];
  rawMythologyEn?: string;
  rawMythologyId?: string;
}

const planets = (planetsData as { planets: PlanetJson[] }).planets ?? [];
const dwarfPlanets =
  (dwarfPlanetsData as { dwarfPlanets: PlanetJson[] }).dwarfPlanets ?? [];
const stars = (starsData as { stars: StarJson[] }).stars ?? [];
const constellations =
  (constellationsData as { constellations: ConstellationJson[] })
    .constellations ?? [];

function stat(label: string, value: string) {
  return { label, value };
}

function buildPlanetStats(p: PlanetJson) {
  return [
    stat("Mass", p.mass),
    stat("Temperature", p.temperature),
    stat("Distance", `${p.distance} AU`),
    stat("Radius", String(p.radius)),
    stat("Orbital Period", `${p.orbitalPeriod} d`),
    stat("Moons", `${p.moonCount} moon(s)`),
  ];
}

function planetBrowseItem(p: PlanetJson): CatalogItem {
  return {
    id: p.id,
    title: p.name,
    type: "planet",
    accentColor: p.color,
    stats: [
      stat("moons", `${p.moonCount} moon(s)`),
      stat("mass", p.mass),
      stat("temp", p.temperature),
    ],
  };
}

function planetDetailItem(p: PlanetJson): LibraryDetailItemRaw {
  return {
    id: p.id,
    title: p.name,
    type: "planet",
    accentColor: p.color,
    description: p.description,
    facts: p.funFacts,
    stats: buildPlanetStats(p),
  };
}

function dwarfPlanetBrowseItem(p: PlanetJson): CatalogItem {
  return {
    id: p.id,
    title: p.name,
    type: "dwarfPlanet",
    accentColor: p.color,
    stats: [
      stat("moons", `${p.moonCount} moon(s)`),
      stat("mass", p.mass),
      stat("temp", p.temperature),
    ],
  };
}

function dwarfPlanetDetailItem(p: PlanetJson): LibraryDetailItemRaw {
  return {
    id: p.id,
    title: p.name,
    type: "dwarfPlanet",
    accentColor: p.color,
    description: p.description,
    facts: p.funFacts,
    stats: buildPlanetStats(p),
  };
}

function buildStarStats(s: StarJson) {
  return [
    stat("Magnitude", String(s.magnitude)),
    stat("Spectral Type", s.spectralType),
    stat("Distance", `${s.distance} ly`),
  ];
}

function starBrowseItem(s: StarJson): CatalogItem {
  return {
    id: s.id,
    title: s.name,
    type: "star",
    accentColor: s.color,
    stats: [
      stat("mag", String(s.magnitude)),
      stat("type", s.spectralType),
      stat("dist", `${s.distance} ly`),
    ],
  };
}

function starDetailItem(s: StarJson): LibraryDetailItemRaw {
  const en = s.content?.en;
  const id = s.content?.id;
  const item: LibraryDetailItemRaw = {
    id: s.id,
    title: s.name,
    type: "star",
    accentColor: s.color,
    stats: buildStarStats(s),
  };
  if (en?.description) {
    item.description = en.description;
    item.rawDescriptionEn = en.description;
  }
  if (id?.description) item.rawDescriptionId = id.description;
  if (en?.facts) {
    item.facts = en.facts;
    item.rawFactsEn = en.facts;
  }
  if (id?.facts) item.rawFactsId = id.facts;
  return item;
}

function constellationBrowseItem(c: ConstellationJson): CatalogItem {
  return {
    id: c.id,
    title: c.name,
    type: "constellation",
    stats: [
      stat("abbr", c.abbreviation),
      stat("stars", String(c.stars.length)),
    ],
  };
}

function constellationDetailItem(c: ConstellationJson): LibraryDetailItemRaw {
  const en = c.content?.en;
  const id = c.content?.id;
  const item: LibraryDetailItemRaw = {
    id: c.id,
    title: c.name,
    type: "constellation",
    stats: [
      stat("Abbreviation", c.abbreviation),
      stat("Star Count", String(c.stars.length)),
    ],
  };
  if (en?.description) {
    item.description = en.description;
    item.rawDescriptionEn = en.description;
  }
  if (id?.description) item.rawDescriptionId = id.description;
  if (en?.mythology) {
    item.mythology = en.mythology;
    item.rawMythologyEn = en.mythology;
  }
  if (id?.mythology) item.rawMythologyId = id.mythology;
  return item;
}

const indexById = <T extends { id: string }>(arr: T[]): Record<string, T> => {
  const out: Record<string, T> = {};
  for (const item of arr) out[item.id] = item;
  return out;
};

export const catalog: Record<LibraryTab, CatalogItem[]> = {
  planets: planets.map(planetBrowseItem),
  dwarfPlanets: dwarfPlanets.map(dwarfPlanetBrowseItem),
  stars: stars.map(starBrowseItem),
  constellations: constellations.map(constellationBrowseItem),
  bookmarks: [],
};

export const detail: Record<
  LibraryTab,
  Record<string, LibraryDetailItemRaw>
> = {
  planets: indexById(planets.map(planetDetailItem)),
  dwarfPlanets: indexById(dwarfPlanets.map(dwarfPlanetDetailItem)),
  stars: indexById(stars.map(starDetailItem)),
  constellations: indexById(constellations.map(constellationDetailItem)),
  bookmarks: {},
};
