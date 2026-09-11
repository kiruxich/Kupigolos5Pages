"use client";

import { useEffect, useRef } from "react";

type VoiceMeta = {
  gender: "мужской" | "женский";
  age: string;
  timbre: string;
  category: string;
  popularity: number;
};

const women = new Set(["Татьяна Шитова", "Елена Соловьёва", "Юлия Рутберг", "Евдокия Лаврухина", "Ещё 200+ голосов"]);
const voiceMeta: Record<string, Partial<VoiceMeta>> = {
  "Илья Исаев": { age: "взрослый", timbre: "средний", category: "известные", popularity: 96 },
  "Владимир Зайцев": { age: "возрастной", timbre: "низкий", category: "известные", popularity: 100 },
  "Владимир Антоник": { age: "возрастной", timbre: "низкий", category: "известные", popularity: 98 },
  "Станислав Концевич": { age: "взрослый", timbre: "средний", category: "известные", popularity: 90 },
  "Сергей Бурунов": { age: "взрослый", timbre: "средний", category: "известные", popularity: 99 },
  "Сергей Чонишвили": { age: "взрослый", timbre: "низкий", category: "актеры дубляжа", popularity: 97 },
  "Никита Прозоровский": { age: "взрослый", timbre: "средний", category: "актеры дубляжа", popularity: 92 },
  "Татьяна Шитова": { age: "взрослый", timbre: "средний", category: "известные", popularity: 96 },
  "Елена Соловьёва": { age: "взрослый", timbre: "средний", category: "известные", popularity: 95 },
  "Юлия Рутберг": { age: "взрослый", timbre: "низкий", category: "известные", popularity: 94 },
  "Евдокия Лаврухина": { age: "молодёжный", timbre: "высокий", category: "актеры дубляжа", popularity: 89 },
  "Ещё 200+ голосов": { age: "взрослый", timbre: "средний", category: "все", popularity: 0 },
};

const clientLogos: Record<string, string> = {
  tefal: "https://kupigolos.ru/img/clients/tefal.jpg",
  toyota: "https://kupigolos.ru/img/clients/toyota.jpg",
  ikea: "https://kupigolos.ru/img/clients/ikea.jpg",
  makita: "https://kupigolos.ru/img/clients/makita.png",
  "авито": "https://kupigolos.ru/img/clients/avito.png",
  "битрикс24": "https://kupigolos.ru/img/clients/bitrix-24.png",
  fifa: "https://kupigolos.ru/img/clients/fifa.png",
  unesco: "https://kupigolos.ru/img/clients/unesco.jpg",
  "первый канал": "https://kupigolos.ru/img/clients/perviy-kanal.jpg",
  "россия 24": "https://kupigolos.ru/img/clients/rossiya-24.png",
  "mcdonald's": "https://kupigolos.ru/img/clients/mcdonalds.jpg",
  "fix price": "https://kupigolos.ru/img/clients/fix-price.png",
};

const famousPortraits = new Map([
  [
    "https://img.kupigolos.ru/voice/5ab7eec080324.jpg?p=v&amp;s=c57bca7a82ee501a56531885a74025a9",
    "https://img.kupigolos.ru/voice/5ab7eec080324.jpg?p=bv&amp;s=18bde4da83a9799e8daef792b48b6231",
  ],
  [
    "https://img.kupigolos.ru/voice/5ab8f51c5a644.jpg?p=v&amp;s=dc2dec602a793299380b01373ae079b3",
    "https://img.kupigolos.ru/voice/5ab8f51c5a644.jpg?p=bv&amp;s=cc770882db3d1a80a3c291bcd9b5582e",
  ],
  [
    "https://img.kupigolos.ru/voice/5aba34090931d.jpg?p=v&amp;s=63d4d22e2593d73e7612e0fb186b5a36",
    "https://img.kupigolos.ru/voice/5aba34090931d.jpg?p=bv&amp;s=b678a96f559b0bc6eddf6089f508f1b3",
  ],
]);

const breadcrumbTrails: Record<string, ReadonlyArray<{ label: string; href?: string }>> = {
  diktory: [
    { label: "Главная", href: "/" },
    { label: "База дикторов" },
  ],
  dubbing: [
    { label: "Главная", href: "/" },
    { label: "База дикторов", href: "/diktory" },
    { label: "Актёры дубляжа и озвучки" },
  ],
  famous: [
    { label: "Главная", href: "/" },
    { label: "База дикторов", href: "/diktory" },
    { label: "Известные дикторы" },
  ],
  women: [
    { label: "Главная", href: "/" },
    { label: "База дикторов", href: "/diktory" },
    { label: "Женские голоса" },
  ],
  localization: [
    { label: "Главная", href: "/" },
    { label: "Услуги", href: "https://kupigolos.ru/" },
    { label: "Локализация и перевод" },
  ],
};

function withFigmaBreadcrumbs(html: string, documentKey: string) {
  const trail = breadcrumbTrails[documentKey] ?? breadcrumbTrails.diktory!;
  const withoutWrappedBreadcrumb = html.replace(
    /<div class="kg-wrap">\s*<(?:nav|div)[^>]*class="kg-breadcrumbs"[^>]*>[\s\S]*?<\/(?:nav|div)>\s*<\/div>/,
    "",
  );
  const withoutBreadcrumb = withoutWrappedBreadcrumb.replace(
    /<(?:nav|div)[^>]*class="kg-breadcrumbs"[^>]*>[\s\S]*?<\/(?:nav|div)>/,
    "",
  );
  const items = trail.map((item, index) => {
    const crumb = item.href
      ? `<a href="${item.href}">${item.label}</a>`
      : `<span class="kg-breadcrumb-current" aria-current="page">${item.label}</span>`;
    return index === 0 ? crumb : `<span class="kg-breadcrumb-arrow" aria-hidden="true">→</span>${crumb}`;
  }).join("");

  return `<nav class="kg-breadcrumbs kg-wrap" aria-label="Хлебные крошки">${items}</nav>${withoutBreadcrumb}`;
}

function useLargeFamousPortraits(html: string) {
  return [...famousPortraits].reduce((result, [thumbnail, portrait]) => result.replaceAll(thumbnail, portrait), html);
}

function removeHeroActions(html: string) {
  return html.replace(/(<section class="kg-hero">[\s\S]*?)<div class="kg-actions">[\s\S]*?<\/div>/, "$1");
}

function normalized(value: string | null | undefined) {
  return (value ?? "").trim().toLocaleLowerCase("ru-RU");
}

function priceFrom(card: Element) {
  const text = card.querySelector(".kg-price")?.textContent ?? "";
  const amount = Number(text.replace(/\D/g, ""));
  return Number.isFinite(amount) && amount > 0 ? amount : Number.POSITIVE_INFINITY;
}

export function CatalogRuntime({ html, documentKey }: { html: string; documentKey: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const contentWithoutHeroActions = removeHeroActions(html);
  const contentWithBreadcrumbs = withFigmaBreadcrumbs(contentWithoutHeroActions, documentKey);
  const renderedHtml = documentKey === "famous" ? useLargeFamousPortraits(contentWithBreadcrumbs) : contentWithBreadcrumbs;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const listeners: Array<() => void> = [];

    root.querySelectorAll<HTMLElement>(".kg-faq").forEach((section) => {
      const layout = section.querySelector<HTMLElement>(":scope > .kg-wrap") ?? section;
      const title = layout.querySelector<HTMLElement>(":scope > h2");
      const kicker = layout.querySelector<HTMLElement>(":scope > .kg-kicker");
      const details = [...layout.querySelectorAll<HTMLDetailsElement>(":scope > details")];
      if (!title || !details.length) return;

      const originalChildren = [...layout.children];
      const heading = document.createElement("header");
      heading.className = "kg-faq-heading";
      const list = document.createElement("div");
      list.className = "kg-faq-list";
      if (kicker) heading.append(kicker);
      heading.append(title);
      details.forEach((item) => list.append(item));
      layout.append(heading, list);
      section.classList.add("kg-faq-stage");
      layout.classList.add("kg-faq-layout");

      listeners.push(() => {
        layout.replaceChildren(...originalChildren);
        layout.classList.remove("kg-faq-layout");
        section.classList.remove("kg-faq-stage");
      });
    });

    root.querySelectorAll<HTMLElement>(".kg-review-grid").forEach((grid) => {
      const section = grid.closest<HTMLElement>(".kg-source-block") ?? grid.closest<HTMLElement>(".kg-section");
      const container = grid.parentElement;
      if (!section || !container) return;

      section.classList.add("kg-reviews-stage");
      if (grid.children.length === 1) grid.classList.add("is-single");

      const footer = document.createElement("div");
      footer.className = "kg-review-footer";
      footer.innerHTML = `
        <span class="kg-review-sources">
          <span>Яндекс Карты <strong>4,7</strong></span><i aria-hidden="true">·</i>
          <span>Google <strong>4,9</strong></span><i aria-hidden="true">·</i>
          <span>Zoon <strong>4,5</strong></span>
        </span>
        <a class="kg-review-action" href="https://yandex.ru/maps/org/studiya_kupigolos/118434769430/reviews/" target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h12a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H9l-6 3V7a3 3 0 0 1 3-3Z"/><path d="M8 9h8M8 13h5"/></svg>
          <span>Оставить отзыв</span>
        </a>`;
      container.append(footer);
      listeners.push(() => {
        footer.remove();
        grid.classList.remove("is-single");
        section.classList.remove("kg-reviews-stage");
      });
    });

    root.querySelectorAll<HTMLElement>(".kg-client-names, .kg-logos").forEach((strip) => {
      if (strip.classList.contains("is-film-enhanced")) return;
      const section = strip.closest<HTMLElement>(".kg-source-block") ?? strip.closest<HTMLElement>(".kg-section");
      const originalItems = [...strip.children] as HTMLElement[];
      if (!section || !originalItems.length) return;

      section.classList.add("kg-clients-stage");
      const layout = section.matches(".kg-section") ? section.firstElementChild as HTMLElement | null : section;
      layout?.classList.add("kg-clients-layout");
      strip.classList.add("is-film-enhanced");
      const track = document.createElement("div");
      track.className = "kg-client-film-track";
      const group = document.createElement("div");
      group.className = "kg-client-film-group";

      originalItems.forEach((item) => {
        const name = item.textContent?.trim() ?? item.querySelector("img")?.getAttribute("alt") ?? "";
        const logo = clientLogos[normalized(name)];
        item.classList.add("kg-client-frame");
        item.dataset.clientName = name;
        if (logo && !item.querySelector("img")) {
          const image = document.createElement("img");
          image.src = logo;
          image.alt = "";
          image.loading = "lazy";
          image.decoding = "async";
          item.prepend(image);
          item.classList.add("has-logo");
        }
        group.append(item);
      });

      const duplicate = group.cloneNode(true) as HTMLElement;
      duplicate.setAttribute("aria-hidden", "true");
      track.append(group, duplicate);
      strip.append(track);

      listeners.push(() => {
        originalItems.forEach((item) => {
          if (item.classList.contains("has-logo")) item.querySelector("img[alt='']")?.remove();
          item.classList.remove("kg-client-frame", "has-logo");
          delete item.dataset.clientName;
        });
        strip.replaceChildren(...originalItems);
        strip.classList.remove("is-film-enhanced");
        layout?.classList.remove("kg-clients-layout");
        section.classList.remove("kg-clients-stage");
      });
    });

    const cards = [...root.querySelectorAll<HTMLElement>(".kg-voice")];
    if (!cards.length) return () => listeners.forEach((remove) => remove());

    let expanded = false;
    const on = <K extends keyof HTMLElementEventMap>(element: HTMLElement, event: K, handler: (event: HTMLElementEventMap[K]) => void) => {
      element.addEventListener(event, handler as EventListener);
      listeners.push(() => element.removeEventListener(event, handler as EventListener));
    };

    cards.forEach((card, index) => {
      const name = card.querySelector("h3")?.textContent?.trim() ?? "";
      const preset = voiceMeta[name] ?? {};
      card.dataset.gender = preset.gender ?? (women.has(name) ? "женский" : "мужской");
      card.dataset.age = preset.age ?? "взрослый";
      card.dataset.timbre = preset.timbre ?? "средний";
      card.dataset.category = documentKey === "dubbing" ? "актеры дубляжа" : documentKey === "famous" ? "известные" : (preset.category ?? "известные");
      card.dataset.popularity = String(preset.popularity ?? 80 - index);
      card.dataset.hasDemo = String(Boolean(card.querySelector(".kg-source-player") || normalized(card.textContent).includes("демо")));
      card.dataset.price = String(priceFrom(card));
    });

    const live = document.createElement("p");
    live.className = "kg-live-results";
    live.setAttribute("aria-live", "polite");
    root.querySelector(".kg-catalog-head, .kg-catalog-note")?.append(live);
    listeners.push(() => live.remove());

    const search = root.querySelector<HTMLInputElement>('.kg-search input[aria-label*="Поиск"], .kg-search input');
    const selects = [...root.querySelectorAll<HTMLSelectElement>(".kg-search select")];
    const groupValues = (heading: string) => [...root.querySelectorAll<HTMLElement>(".kg-filter-group")]
      .filter((group) => normalized(group.querySelector("b")?.textContent).includes(normalized(heading)))
      .flatMap((group) => [...group.querySelectorAll<HTMLInputElement>('input[type="checkbox"]:checked, input[type="radio"]:checked')])
      .map((input) => normalized(input.parentElement?.textContent));

    const selectedTop = (kind: string) => {
      const select = selects.find((item) => normalized(item.getAttribute("aria-label")).includes(kind) || normalized(item.options[0]?.text).includes(kind));
      const value = normalized(select?.value);
      return value && !["пол", "возраст", "тембр", "по цене", "сортировка"].includes(value) ? value : "";
    };

    const apply = () => {
      const query = normalized(search?.value);
      const gender = selectedTop("пол") ? [selectedTop("пол")] : groupValues("пол");
      const age = selectedTop("возраст") ? [selectedTop("возраст")] : groupValues("возраст");
      const timbre = selectedTop("тембр") ? [selectedTop("тембр")] : groupValues("тембр");
      const category = normalized(groupValues("категория")[0]);
      const priceInputs = [...root.querySelectorAll<HTMLInputElement>(".kg-range input")];
      const min = Number(priceInputs[0]?.value || 0);
      const max = Number(priceInputs[1]?.value || Number.POSITIVE_INFINITY);
      const checkedLabels = [...root.querySelectorAll<HTMLInputElement>('.kg-sidebar input[type="checkbox"]:checked')].map((input) => normalized(input.parentElement?.textContent));
      const hideNegotiated = checkedLabels.some((value) => value.includes("договорн"));
      const requireNoDemo = checkedLabels.some((value) => value.includes("без демо"));
      const matchesAny = (actual: string | undefined, values: string[]) => values.length === 0 || values.some((value) => normalized(actual).includes(value.replace(/ие$/, "ой").replace(/ая$/, "ий")));

      const matched = cards.filter((card) => {
        const cardPrice = Number(card.dataset.price);
        return (!query || normalized(card.textContent).includes(query))
          && matchesAny(card.dataset.gender, gender)
          && matchesAny(card.dataset.age, age)
          && matchesAny(card.dataset.timbre, timbre)
          && (!category || category === "все" || normalized(card.dataset.category).includes(category.replace("актёры", "актеры")))
          && (!hideNegotiated || Number.isFinite(cardPrice))
          && (!requireNoDemo || card.dataset.hasDemo === "false")
          && (cardPrice === Number.POSITIVE_INFINITY || (cardPrice >= min && cardPrice <= max));
      });

      const sortValue = normalized(selects.find((select) => normalized(select.value).includes("популяр"))?.value || selects.at(-1)?.value);
      const sorted = [...matched].sort((a, b) => sortValue.includes("популяр")
        ? Number(b.dataset.popularity) - Number(a.dataset.popularity)
        : Number(a.dataset.price) - Number(b.dataset.price));
      const parent = cards[0]?.parentElement;
      sorted.forEach((card) => parent?.append(card));
      cards.forEach((card) => { card.hidden = true; });
      sorted.slice(0, expanded ? undefined : 15).forEach((card) => { card.hidden = false; });
      live.textContent = `Найдено: ${matched.length}`;
      root.querySelectorAll<HTMLElement>(".kg-more").forEach((more) => {
        more.hidden = matched.length <= 15 || expanded;
      });
    };

    const sidebar = root.querySelector<HTMLElement>(".kg-sidebar");
    if (sidebar) {
      const toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "kg-filter-toggle";
      toggle.setAttribute("aria-expanded", "false");
      toggle.innerHTML = '<span aria-hidden="true">☷</span><span>Фильтры</span>';
      sidebar.before(toggle);
      on(toggle, "click", () => {
        const open = sidebar.classList.toggle("is-mobile-open");
        toggle.setAttribute("aria-expanded", String(open));
      });
      listeners.push(() => toggle.remove());
    }

    root.querySelectorAll<HTMLElement>("input, select").forEach((element) => on(element, "change", apply));
    if (search) on(search, "input", apply);
    root.querySelectorAll<HTMLElement>(".kg-search button, .kg-filter-actions .primary").forEach((button) => on(button, "click", apply));
    root.querySelectorAll<HTMLElement>(".kg-filter-actions .reset").forEach((button) => on(button, "click", () => {
      root.querySelectorAll<HTMLInputElement>('input[type="checkbox"]').forEach((input) => { input.checked = false; });
      root.querySelectorAll<HTMLInputElement>('input[type="radio"]').forEach((input, index) => { input.checked = index === 0; });
      root.querySelectorAll<HTMLInputElement>('.kg-range input, .kg-search input').forEach((input) => { input.value = ""; });
      selects.forEach((select) => { select.selectedIndex = 0; });
      expanded = false;
      apply();
    }));
    root.querySelectorAll<HTMLElement>(".kg-more a").forEach((button) => on(button, "click", (event) => {
      event.preventDefault();
      expanded = true;
      apply();
    }));
    root.querySelectorAll<HTMLElement>(".kg-source-player, .kg-voice-actions a:first-child").forEach((player) => on(player, "click", (event) => {
      if (normalized(player.textContent).includes("заказать")) return;
      event.preventDefault();
      const active = player.classList.toggle("is-playing");
      player.setAttribute("aria-pressed", String(active));
    }));
    apply();
    return () => listeners.forEach((remove) => remove());
  }, [documentKey, html]);

  return <div id="start" ref={rootRef} className={`seo-document seo-document--${documentKey}`} dangerouslySetInnerHTML={{ __html: renderedHtml }} />;
}
