import type { SeoDocumentKey } from "./seo-page-config";

export const seoPages: ReadonlyArray<{
  documentKey: SeoDocumentKey;
  title: string;
  navigationLabel: string;
  description: string;
  href: string;
  sourceFile: string;
}> = [
  {
    documentKey: "diktory",
    title: "Дикторы",
    navigationLabel: "Все дикторы",
    description: "Основной каталог голосов с поиском, фильтрами и примерами.",
    href: "/diktory",
    sourceFile: "kupigolos-diktory-seo.html",
  },
  {
    documentKey: "dubbing",
    title: "Актёры дубляжа",
    navigationLabel: "Актёры дубляжа",
    description: "Голоса кино, сериалов, мультфильмов и игр.",
    href: "/diktory/dubbing",
    sourceFile: "kupigolos-aktery-dublyazha.html",
  },
  {
    documentKey: "famous",
    title: "Известные дикторы",
    navigationLabel: "Известные дикторы",
    description: "Федеральные голоса телевидения, радио и крупных брендов.",
    href: "/diktory/izvestnye_golosa",
    sourceFile: "kupigolos-izvestnye-diktory-seo-prototype.html",
  },
  {
    documentKey: "women",
    title: "Женские голоса",
    navigationLabel: "Женские голоса",
    description: "Профессиональные женские голоса для текста, видео и рекламы.",
    href: "/diktory/zhenskie_golosa",
    sourceFile: "kupigolos-zhenskie-golosa-seo.html",
  },
  {
    documentKey: "localization",
    title: "Локализация",
    navigationLabel: "Локализация",
    description: "Перевод и адаптация контента для разных языков и рынков.",
    href: "/perevod",
    sourceFile: "kupigolos-lokalizaciya-kontenta-seo.html",
  },
];
