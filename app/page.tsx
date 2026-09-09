import Link from "next/link";
import "./index.css";

const pages = [
  {
    title: "Дикторы",
    description: "Основной каталог голосов с поиском, фильтрами и примерами.",
    href: "/diktory",
  },
  {
    title: "Актёры дубляжа",
    description: "Голоса кино, сериалов, мультфильмов и игр.",
    href: "/diktory/dubbing",
  },
  {
    title: "Известные дикторы",
    description: "Федеральные голоса телевидения, радио и крупных брендов.",
    href: "/diktory/izvestnye_golosa",
  },
  {
    title: "Женские голоса",
    description: "Профессиональные женские голоса для текста, видео и рекламы.",
    href: "/diktory/zhenskie_golosa",
  },
  {
    title: "Локализация",
    description: "Перевод и адаптация контента для разных языков и рынков.",
    href: "/perevod",
  },
] as const;

export default function PageIndex() {
  return (
    <main className="page-index">
      <header className="page-index__header">
        <h1>5 страниц</h1>
        <p>Выберите страницу для просмотра.</p>
      </header>
      <section className="page-index__grid" aria-label="Список страниц">
        {pages.map((page) => (
          <Link
            className="page-card"
            href={page.href}
            key={page.href}
            aria-label={`Открыть страницу ${page.title}`}
          >
            <div>
              <h2>{page.title}</h2>
              <p>{page.description}</p>
            </div>
            <span className="page-card__action" aria-hidden="true">Открыть <b>→</b></span>
          </Link>
        ))}
      </section>
    </main>
  );
}
