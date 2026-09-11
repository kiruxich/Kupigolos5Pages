import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { CatalogRuntime } from "@/components/seo/catalog-runtime";
import { SiteHeader } from "@/components/seo/site-header";
import { seoDocuments } from "@/lib/seo-documents";
import { seoPageConfig } from "@/lib/seo-page-config";
import { preprodVoiceCatalogIdsByPage } from "@/lib/voice-catalog.generated";

const expectations = {
  diktory: { h1: "Дикторы для озвучки", sections: 12, faq: 7 },
  dubbing: { h1: "Актеры дубляжа и озвучки", sections: 12, faq: 7 },
  famous: { h1: "Известные дикторы", sections: 8, faq: 5 },
  women: { h1: "Озвучка женским голосом", sections: 9, faq: 8 },
  localization: { h1: "Локализация контента и перевод под ключ", sections: 15, faq: 6 },
} as const;

afterEach(cleanup);

describe("SEO page content contracts", () => {
  it("defines five unique canonical pages with complete metadata", () => {
    const configs = Object.values(seoPageConfig);
    expect(configs).toHaveLength(5);
    expect(new Set(configs.map((config) => config.canonical))).toHaveLength(5);
    configs.forEach((config) => {
      expect(config.title.length).toBeGreaterThan(40);
      expect(config.description.length).toBeGreaterThan(100);
      expect(config.canonical).toMatch(/^https:\/\/kupigolos\.ru\//);
    });
  });

  Object.entries(expectations).forEach(([key, expected]) => {
    it(`preserves the approved structure for ${key}`, () => {
      const document = seoDocuments[key as keyof typeof seoDocuments];
      const dom = new DOMParser().parseFromString(`<main>${document.html}</main>`, "text/html");
      const main = dom.querySelector("main")!;
      expect(main.querySelector("h1")?.textContent).toBe(expected.h1);
      expect(main.querySelectorAll("section").length).toBeGreaterThanOrEqual(expected.sections);
      expect(main.querySelectorAll(".kg-faq details").length).toBe(expected.faq);
      expect(document.jsonLd.length).toBeGreaterThan(0);
      expect(main.textContent).not.toMatch(/берем из исходника|берём из исходника|прототип|production/i);
    });
  });

  it("removes the hero action buttons from every SEO page", () => {
    Object.entries(seoDocuments).forEach(([documentKey, document]) => {
      const { container, unmount } = render(<CatalogRuntime html={document.html} documentKey={documentKey} />);

      expect(container.querySelector(".kg-hero .kg-actions")).not.toBeInTheDocument();
      unmount();
    });
  });

  it("renders the centered Figma breadcrumb trail for every SEO page", () => {
    const trails = {
      diktory: ["Главная", "База дикторов"],
      dubbing: ["Главная", "База дикторов", "Актёры дубляжа и озвучки"],
      famous: ["Главная", "База дикторов", "Известные дикторы"],
      women: ["Главная", "База дикторов", "Женские голоса"],
      localization: ["Главная", "Услуги", "Локализация и перевод"],
    } as const;

    Object.entries(trails).forEach(([documentKey, labels]) => {
      const document = seoDocuments[documentKey as keyof typeof seoDocuments];
      const { container, unmount } = render(<CatalogRuntime html={document.html} documentKey={documentKey} />);
      const breadcrumbs = container.querySelector(".seo-document > .kg-breadcrumbs")!;

      expect([...breadcrumbs.querySelectorAll("a, .kg-breadcrumb-current")].map((item) => item.textContent)).toEqual(labels);
      expect(breadcrumbs.querySelectorAll(".kg-breadcrumb-arrow")).toHaveLength(labels.length - 1);
      expect(breadcrumbs.querySelector("[aria-current='page']")).toHaveTextContent(labels.at(-1)!);
      unmount();
    });
  });

  it("keeps all catalog controls on the main voice page", () => {
    const dom = new DOMParser().parseFromString(`<main>${seoDocuments.diktory.html}</main>`, "text/html");
    const main = dom.querySelector("main")!;
    expect(main.querySelector('input[aria-label="Поиск диктора"]')).toBeTruthy();
    expect(main.querySelectorAll(".kg-filter-group").length).toBe(5);
    expect(main.textContent).toContain("Скрыть договорные цены");
    expect(main.textContent).toContain("Показать без демо");
  });

  it("enhances reviews and clients without replacing SEO copy", async () => {
    const { container } = render(<CatalogRuntime html={seoDocuments.localization.html} documentKey="localization" />);

    await waitFor(() => expect(container.querySelector(".kg-client-film-track")).toBeInTheDocument());
    expect(screen.getByText("Здесь грамотные специалисты, большой выбор дикторов, всё сделали в срок и как надо. В процессе совместной творческой работы прислушивались к пожеланиям и всегда шли навстречу!")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Оставить отзыв" })).toHaveAttribute("href", "https://yandex.ru/maps/org/studiya_kupigolos/118434769430/reviews/");
    expect(container.querySelectorAll(".kg-client-film-group")).toHaveLength(2);
    expect(container.querySelector('[data-client-name="Л’Этуаль"]')).toHaveTextContent("Л’Этуаль");
    expect(container.querySelector(".kg-faq-layout .kg-faq-heading")).toHaveTextContent("Часто задаваемые вопросы");
    expect(container.querySelectorAll(".kg-faq-list details")).toHaveLength(6);
    expect(screen.getByText("Чем локализация контента отличается от перевода?")).toBeInTheDocument();
  });

  it("uses full-size portraits for the famous voices page", () => {
    const { container } = render(<CatalogRuntime html={seoDocuments.famous.html} documentKey="famous" />);
    const portraits = [...container.querySelectorAll<HTMLImageElement>("#who .kg-photo-strip img")];

    expect(portraits).toHaveLength(3);
    portraits.forEach((portrait) => {
      expect(portrait.src).toContain("p=bv");
      expect(portrait.src).not.toContain("p=v&");
    });
  });
});

describe("shared SEO header", () => {
  it("reuses the complete orange main-site header on every SEO page", () => {
    const { container } = render(<SiteHeader documentKey="dubbing" />);
    const navigation = within(screen.getByRole("navigation", { name: "Основная навигация" }));

    expect(container.querySelector("header > div")).toHaveClass("site-header-inner");
    expect(navigation.getByRole("button", { name: "Услуги" })).toBeInTheDocument();
    expect(navigation.getByRole("button", { name: "Дикторы" })).toBeInTheDocument();
    expect(navigation.getByRole("button", { name: "ИИ сервисы" })).toBeInTheDocument();
    expect(navigation.getByRole("button", { name: "Инфопортал" })).toBeInTheDocument();
    expect(navigation.getByRole("link", { name: "Статьи" })).toHaveAttribute("href", "https://kupigolos.ru/articles");
    expect(screen.getByRole("link", { name: "КупиГолос, на главную" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("button", { name: "Телефон" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Мессенджеры и социальные сети" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Избранное" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Дополнительное меню" })).toBeInTheDocument();
    expect(container.querySelector('.brand img')).toHaveAttribute("src", "/assets/logo.svg");
    expect(container.querySelector('img[src="/assets/header_phone.svg"]')).toBeInTheDocument();
    expect(container.querySelector('img[src="/assets/header_networks.svg"]')).toBeInTheDocument();
    expect(container.querySelector('img[src="/assets/header_like.svg"]')).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Мессенджеры и социальные сети" }));
    expect(screen.getByRole("link", { name: "Telegram" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "WhatsApp" })).toBeInTheDocument();
    fireEvent.click(navigation.getByRole("button", { name: "Услуги" }));
    expect(screen.getByRole("region", { name: "Услуги" })).toHaveClass("is-open");
  });
});

describe("catalog interactions", () => {
  it("filters cards by name and resets the result", async () => {
    render(<CatalogRuntime html={seoDocuments.diktory.html} documentKey="diktory" />);
    const searchInput = screen.getByLabelText("Поиск диктора");
    fireEvent.input(searchInput, { target: { value: "Татьяна Шитова" } });
    await waitFor(() => expect(screen.getByText("Найдено: 1")).toBeInTheDocument());
    expect(screen.getByRole("heading", { name: "Татьяна Шитова" }).closest("article")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Сбросить" }));
    await waitFor(() => expect(screen.getByText(`Найдено: ${preprodVoiceCatalogIdsByPage.diktory.length}`)).toBeInTheDocument());
  });

  it("filters the provided cards by gender", async () => {
    const { container } = render(<CatalogRuntime html={seoDocuments.diktory.html} documentKey="diktory" />);
    const womenIds = new Set<string>(preprodVoiceCatalogIdsByPage.women);
    const womenInMainCatalog = preprodVoiceCatalogIdsByPage.diktory.filter((id) => womenIds.has(id)).length;
    fireEvent.change(screen.getByLabelText("Пол"), { target: { value: "Женский" } });
    await waitFor(() => expect(screen.getByText(`Найдено: ${womenInMainCatalog}`)).toBeInTheDocument());
    expect(container.querySelectorAll(".kg-voice:not([hidden])")).toHaveLength(15);
  });
});
