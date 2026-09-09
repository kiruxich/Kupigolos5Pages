import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PageIndex from "../../app/page";

describe("five page index", () => {
  it("renders five cards with their local destinations", () => {
    render(<PageIndex />);

    expect(screen.getByRole("heading", { level: 1, name: "5 страниц" })).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 2 }).map(({ textContent }) => textContent)).toEqual([
      "Дикторы",
      "Актёры дубляжа",
      "Известные дикторы",
      "Женские голоса",
      "Локализация",
    ]);
    expect(screen.getByRole("link", { name: "Открыть страницу Дикторы" })).toHaveAttribute("href", "/diktory");
    expect(screen.getByRole("link", { name: "Открыть страницу Актёры дубляжа" })).toHaveAttribute("href", "/diktory/dubbing");
    expect(screen.getByRole("link", { name: "Открыть страницу Известные дикторы" })).toHaveAttribute("href", "/diktory/izvestnye_golosa");
    expect(screen.getByRole("link", { name: "Открыть страницу Женские голоса" })).toHaveAttribute("href", "/diktory/zhenskie_golosa");
    expect(screen.getByRole("link", { name: "Открыть страницу Локализация" })).toHaveAttribute("href", "/perevod");
    expect(screen.getByText("kupigolos-diktory-seo.html")).toBeInTheDocument();
    expect(screen.getByText("kupigolos-aktery-dublyazha.html")).toBeInTheDocument();
    expect(screen.getByText("kupigolos-izvestnye-diktory-seo-prototype.html")).toBeInTheDocument();
    expect(screen.getByText("kupigolos-zhenskie-golosa-seo.html")).toBeInTheDocument();
    expect(screen.getByText("kupigolos-lokalizaciya-kontenta-seo.html")).toBeInTheDocument();
  });
});
