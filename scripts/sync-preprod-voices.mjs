import { mkdirSync, writeFileSync } from "node:fs";
import { JSDOM } from "jsdom";

const catalogUrl = "https://kupigolos.ru/diktory";
const catalogPages = {
  diktory: catalogUrl,
  dubbing: `${catalogUrl}/dubbing`,
  famous: `${catalogUrl}/izvestnye_golosa`,
  women: `${catalogUrl}/zhenskie_golosa`,
};
const outputPath = "lib/voice-catalog.generated.ts";

const normalizeText = (value = "") => value.replace(/\s+/gu, " ").trim();
const absoluteUrl = (value) => value ? new URL(value, catalogUrl).href : "";

async function loadDocument(url) {
  const response = await fetch(url, {
    headers: { "user-agent": "Kupigolos five-pages catalogue sync" },
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return new JSDOM(await response.text(), { url }).window.document;
}

function getPageCount(document) {
  return Math.max(1, ...Array.from(document.querySelectorAll('a[href*="page="]'), (link) => {
    const page = Number(new URL(link.href, catalogUrl).searchParams.get("page"));
    return Number.isFinite(page) ? page : 1;
  }));
}

function readSpeakers(document) {
  return Array.from(document.querySelectorAll('.card[data-card-kind="speaker"]'), (card) => {
    const profile = card.querySelector(".card__name a");
    const portrait = card.querySelector(".player__img");
    const demo = card.querySelector("audio source");
    const order = card.querySelector(".goal-order-voice");
    return {
      id: card.getAttribute("data-key") ?? "",
      name: normalizeText(profile?.textContent),
      href: absoluteUrl(profile?.getAttribute("href")),
      image: absoluteUrl(portrait?.getAttribute("src")),
      audio: absoluteUrl(demo?.getAttribute("src")),
      price: normalizeText(card.querySelector(".card__price")?.textContent),
      description: normalizeText(card.querySelector(".card__descr")?.textContent),
      orderHref: absoluteUrl(order?.getAttribute("href") ?? profile?.getAttribute("href")),
      featured: Boolean(card.querySelector(".card__vip")),
    };
  }).filter((speaker) => speaker.name && speaker.href && speaker.image && speaker.audio);
}

async function readCatalog(url) {
  const firstDocument = await loadDocument(url);
  const pageCount = getPageCount(firstDocument);
  const documents = await Promise.all([
    Promise.resolve(firstDocument),
    ...Array.from({ length: pageCount - 1 }, (_, index) => {
      const pageUrl = new URL(url);
      pageUrl.searchParams.set("page", String(index + 2));
      return loadDocument(pageUrl.href);
    }),
  ]);
  const speakers = Array.from(new Map(documents.flatMap(readSpeakers).map((speaker) => [speaker.id || speaker.href, speaker])).values());
  return { pageCount, speakers };
}

const entries = await Promise.all(Object.entries(catalogPages).map(async ([key, url]) => [key, await readCatalog(url)]));
const speakers = Array.from(new Map(entries.flatMap(([, value]) => value.speakers).map((speaker) => [speaker.id || speaker.href, speaker])).values());
const catalogIds = Object.fromEntries(entries.map(([key, value]) => [key, value.speakers.map((speaker) => speaker.id)]));
const source = `// Generated from ${catalogUrl}. Run: node scripts/sync-preprod-voices.mjs\n\n` +
  `export type VoiceCatalogEntry = {\n  id: string;\n  name: string;\n  href: string;\n  image: string;\n  audio: string;\n  price: string;\n  description: string;\n  orderHref: string;\n  featured: boolean;\n};\n\n` +
  `export const preprodVoiceCatalog = ${JSON.stringify(speakers, null, 2)} as const satisfies readonly VoiceCatalogEntry[];\n\n` +
  `export const preprodVoiceCatalogIdsByPage = ${JSON.stringify(catalogIds, null, 2)} as const satisfies Record<string, readonly string[]>;\n`;

mkdirSync("lib", { recursive: true });
writeFileSync(outputPath, source);
console.log(entries.map(([key, value]) => `${key}: ${value.speakers.length} speakers / ${value.pageCount} pages`).join("\n"));
console.log(`Saved to ${outputPath}`);
