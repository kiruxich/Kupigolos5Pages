import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { CatalogRuntime } from "@/components/seo/catalog-runtime";
import { SiteHeader } from "@/components/seo/site-header";
import { seoDocuments } from "@/lib/seo-documents";
import { seoPageConfig } from "@/lib/seo-page-config";

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

  it("keeps all catalog controls on the main voice page", () => {
    const dom = new DOMParser().parseFromString(`<main>${seoDocuments.diktory.html}</main>`, "text/html");
    const main = dom.querySelector("main")!;
    expect(main.querySelector('input[aria-label="Поиск диктора"]')).toBeTruthy();
    expect(main.querySelectorAll(".kg-filter-group").length).toBe(5);
    expect(main.textContent).toContain("Скрыть договорные цены");
    expect(main.textContent).toContain("Показать без демо");
  });
});

describe("shared SEO header", () => {
  it("uses the main page color and links all five pages plus the dashboard", () => {
    const { container } = render(<SiteHeader documentKey="dubbing" />);
    const navigation = within(screen.getByRole("navigation", { name: "Основная навигация" }));

    expect(container.querySelector("header > div")).toHaveClass("bg-[#c1492e]");
    expect(navigation.getAllByRole("link")).toHaveLength(6);
    expect(navigation.getByRole("link", { name: "Все дикторы" })).toHaveAttribute("href", "/diktory");
    expect(navigation.getByRole("link", { name: "Актёры дубляжа" })).toHaveAttribute("aria-current", "page");
    expect(navigation.getByRole("link", { name: "Известные дикторы" })).toHaveAttribute(
      "href",
      "/diktory/izvestnye_golosa",
    );
    expect(navigation.getByRole("link", { name: "Женские голоса" })).toHaveAttribute(
      "href",
      "/diktory/zhenskie_golosa",
    );
    expect(navigation.getByRole("link", { name: "Локализация" })).toHaveAttribute("href", "/perevod");
    expect(navigation.getByRole("link", { name: "← В дашборд" })).toHaveAttribute("href", "/");
    expect(screen.queryByRole("link", { name: "Обсудить проект" })).not.toBeInTheDocument();
    expect(container.querySelector('a[href^="tel:"]')).not.toBeInTheDocument();
  });
});

describe("catalog interactions", () => {
  it("filters cards by name and resets the result", async () => {
    render(<CatalogRuntime html={seoDocuments.diktory.html} documentKey="diktory" />);
    const searchInput = screen.getByLabelText("Поиск диктора");
    fireEvent.input(searchInput, { target: { value: "Татьяна" } });
    await waitFor(() => expect(screen.getByText("Найдено: 1")).toBeInTheDocument());
    expect(screen.getByRole("heading", { name: "Татьяна Шитова" }).closest("article")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Сбросить" }));
    await waitFor(() => expect(screen.getByText("Найдено: 6")).toBeInTheDocument());
  });

  it("filters the provided cards by gender", async () => {
    render(<CatalogRuntime html={seoDocuments.diktory.html} documentKey="diktory" />);
    fireEvent.change(screen.getByLabelText("Пол"), { target: { value: "Женский" } });
    await waitFor(() => expect(screen.getByText("Найдено: 1")).toBeInTheDocument());
    expect(screen.getByRole("heading", { name: "Татьяна Шитова" }).closest("article")).toBeVisible();
  });
});
