import Link from "next/link";
import { seoPages } from "@/lib/seo-pages";
import "./index.css";

export default function PageIndex() {
  return (
    <main className="page-index">
      <header className="page-index__header">
        <h1>5 страниц</h1>
        <p>Выберите страницу для просмотра.</p>
      </header>
      <section className="page-index__grid" aria-label="Список страниц">
        {seoPages.map((page) => (
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
            <div className="page-card__footer">
              <span className="page-card__action" aria-hidden="true">Открыть <b>→</b></span>
              <code className="page-card__source">{page.sourceFile}</code>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
