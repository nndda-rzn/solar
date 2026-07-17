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
  textures?: { diffuse?: string };
  content?: LocaleContent<{
    description: string;
    facts: string[];
    mythology: string;
  }>;
}

interface StarJson {
  id: string;
  name: string;
  magnitude: number;
  spectralType: string;
  color: string;
  distance: number;
  content?: LocaleContent<{
    description: string;
    facts: string[];
    mythology?: string;
  }>;
}

interface ConstellationJson {
  id: string;
  name: string;
  abbreviation: string;
  stars: string[];
  canvasStars?: Array<{
    id: string;
    name: string;
    magnitude: number;
    type: string;
    color: string;
    x: number;
    y: number;
  }>;
  lines?: Array<{ from: string; to: string }>;
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

type LocaleFields = {
  description?: string;
  facts?: string[];
  mythology?: string;
};

function extractLocaleContent<T extends LocaleFields>(
  content: LocaleContent<T> | undefined,
  fallbackDesc: string,
  fallbackFacts: string[],
): {
  description: string;
  facts: string[];
  rawDescriptionEn?: string | undefined;
  rawDescriptionId?: string | undefined;
  rawFactsEn?: string[] | undefined;
  rawFactsId?: string[] | undefined;
  rawMythologyEn?: string | undefined;
  rawMythologyId?: string | undefined;
} {
  const en = content?.en;
  const id = content?.id;

  const result: ReturnType<typeof extractLocaleContent> = {
    description: en?.description ?? fallbackDesc,
    facts: en?.facts ?? fallbackFacts,
  };

  if (en?.description) result.rawDescriptionEn = en.description;
  if (id?.description) {
    result.rawDescriptionId = id.description;
    if (!en?.description) result.description = id.description;
  }
  if (en?.facts) result.rawFactsEn = en.facts;
  if (id?.facts) {
    result.rawFactsId = id.facts;
    if (!en?.facts) result.facts = id.facts;
  }
  if (en?.mythology) result.rawMythologyEn = en.mythology;
  if (id?.mythology) result.rawMythologyId = id.mythology;

  return result;
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
    ...(p.textures?.diffuse ? { textureUrl: p.textures.diffuse } : {}),
    stats: [
      stat("moons", `${p.moonCount} moon(s)`),
      stat("mass", p.mass),
      stat("temp", p.temperature),
    ],
  };
}

function planetDetailItem(p: PlanetJson): LibraryDetailItemRaw {
  const localeContent = extractLocaleContent(
    p.content,
    p.description,
    p.funFacts,
  );

  return {
    id: p.id,
    title: p.name,
    type: "planet",
    accentColor: p.color,
    ...(p.textures?.diffuse ? { textureUrl: p.textures.diffuse } : {}),
    description: localeContent.description,
    facts: localeContent.facts,
    stats: buildPlanetStats(p),
    ...(localeContent.rawDescriptionEn
      ? { rawDescriptionEn: localeContent.rawDescriptionEn }
      : {}),
    ...(localeContent.rawDescriptionId
      ? { rawDescriptionId: localeContent.rawDescriptionId }
      : {}),
    ...(localeContent.rawFactsEn
      ? { rawFactsEn: localeContent.rawFactsEn }
      : {}),
    ...(localeContent.rawFactsId
      ? { rawFactsId: localeContent.rawFactsId }
      : {}),
    ...(localeContent.rawMythologyEn
      ? { rawMythologyEn: localeContent.rawMythologyEn }
      : {}),
    ...(localeContent.rawMythologyId
      ? { rawMythologyId: localeContent.rawMythologyId }
      : {}),
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
  const localeContent = extractLocaleContent(
    p.content,
    p.description,
    p.funFacts,
  );

  return {
    id: p.id,
    title: p.name,
    type: "dwarfPlanet",
    accentColor: p.color,
    description: localeContent.description,
    facts: localeContent.facts,
    stats: buildPlanetStats(p),
    ...(localeContent.rawDescriptionEn
      ? { rawDescriptionEn: localeContent.rawDescriptionEn }
      : {}),
    ...(localeContent.rawDescriptionId
      ? { rawDescriptionId: localeContent.rawDescriptionId }
      : {}),
    ...(localeContent.rawFactsEn
      ? { rawFactsEn: localeContent.rawFactsEn }
      : {}),
    ...(localeContent.rawFactsId
      ? { rawFactsId: localeContent.rawFactsId }
      : {}),
    ...(localeContent.rawMythologyEn
      ? { rawMythologyEn: localeContent.rawMythologyEn }
      : {}),
    ...(localeContent.rawMythologyId
      ? { rawMythologyId: localeContent.rawMythologyId }
      : {}),
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
  const localeContent = extractLocaleContent(s.content, "", []);

  return {
    id: s.id,
    title: s.name,
    type: "star",
    accentColor: s.color,
    magnitude: s.magnitude,
    spectralType: s.spectralType,
    stats: buildStarStats(s),
    ...(localeContent.description
      ? { description: localeContent.description }
      : {}),
    ...(localeContent.facts.length > 0 ? { facts: localeContent.facts } : {}),
    ...(localeContent.rawDescriptionEn
      ? { rawDescriptionEn: localeContent.rawDescriptionEn }
      : {}),
    ...(localeContent.rawDescriptionId
      ? { rawDescriptionId: localeContent.rawDescriptionId }
      : {}),
    ...(localeContent.rawFactsEn
      ? { rawFactsEn: localeContent.rawFactsEn }
      : {}),
    ...(localeContent.rawFactsId
      ? { rawFactsId: localeContent.rawFactsId }
      : {}),
    ...(localeContent.rawMythologyEn
      ? { rawMythologyEn: localeContent.rawMythologyEn }
      : {}),
    ...(localeContent.rawMythologyId
      ? { rawMythologyId: localeContent.rawMythologyId }
      : {}),
  };
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

  return {
    id: c.id,
    title: c.name,
    type: "constellation",
    stats: [
      stat("Abbreviation", c.abbreviation),
      stat("Star Count", String(c.stars.length)),
    ],
    ...(c.canvasStars ? { canvasStars: c.canvasStars } : {}),
    ...(c.lines ? { lines: c.lines } : {}),
    ...(en?.description
      ? { description: en.description, rawDescriptionEn: en.description }
      : {}),
    ...(id?.description ? { rawDescriptionId: id.description } : {}),
    ...(en?.mythology
      ? { mythology: en.mythology, rawMythologyEn: en.mythology }
      : {}),
    ...(id?.mythology ? { rawMythologyId: id.mythology } : {}),
  };
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
