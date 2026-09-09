import Link from "next/link";
import type { SeoDocumentKey } from "@/lib/seo-page-config";
import { seoPages } from "@/lib/seo-pages";

const pageLinks: ReadonlyArray<{
  href: string;
  label: string;
  documentKey?: SeoDocumentKey;
  sourceFile?: string;
}> = [
  ...seoPages.map((page) => ({
    href: page.href,
    label: page.navigationLabel,
    documentKey: page.documentKey,
    sourceFile: page.sourceFile,
  })),
  { href: "/", label: "← В дашборд" },
];

function Logo() {
  return (
    <span className="inline-flex items-center gap-2.5 text-[17px] font-extrabold tracking-[-0.04em] text-white">
      <svg
        className="h-8 w-8 text-white"
        viewBox="0 0 44 44"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        aria-hidden="true"
      >
        <path d="M4 22h4m4-7v14m5-20v26m6-20v14m6-9v4m6-9v14m5-7h4" />
      </svg>
      <span>
        купи<span className="text-white">голос</span>
      </span>
    </span>
  );
}

function HeaderLink({
  href,
  label,
  active,
  sourceFile,
  mobile = false,
}: {
  href: string;
  label: string;
  active: boolean;
  sourceFile?: string;
  mobile?: boolean;
}) {
  return (
    <Link
      className={
        mobile
          ? `flex min-h-[54px] flex-col items-start justify-center rounded-xl px-4 py-2.5 transition-colors ${active ? "bg-white text-[#a63c28]" : "text-white hover:bg-white/15"}`
          : `flex min-h-[48px] flex-col items-start justify-center whitespace-nowrap rounded-xl px-2.5 py-1.5 transition-colors ${active ? "bg-white/20 text-white" : "text-white/85 hover:bg-white/12 hover:text-white"}`
      }
      href={href}
      aria-label={label}
      aria-current={active ? "page" : undefined}
    >
      <span>{label}</span>
      {sourceFile ? (
        <span
          className={
            mobile
              ? `mt-0.5 break-all font-mono text-[10px] font-medium leading-4 ${active ? "text-[#a63c28]/65" : "text-white/55"}`
              : "mt-0.5 block max-w-[180px] truncate font-mono text-[9px] font-medium leading-3 text-white/55"
          }
          title={sourceFile}
        >
          {sourceFile}
        </span>
      ) : null}
    </Link>
  );
}

export function SiteHeader({ documentKey }: { documentKey: SeoDocumentKey }) {
  return (
    <header className="fixed inset-x-0 top-2.5 z-50 px-3">
      <div className="mx-auto flex min-h-[72px] max-w-[1540px] items-center gap-3 rounded-[17px] border border-white/15 bg-[#c1492e] px-4 text-white shadow-[0_8px_24px_rgba(72,35,30,.18)] sm:px-6 lg:px-8">
        <Link href="/" aria-label="КупиГолос, в дашборд">
          <Logo />
        </Link>

        <nav
          className="ml-auto hidden items-center gap-1 text-[13px] font-semibold min-[1400px]:flex 2xl:gap-2 2xl:text-sm"
          aria-label="Основная навигация"
        >
          {pageLinks.map((link) => (
            <HeaderLink
              key={link.href}
              href={link.href}
              label={link.label}
              active={link.documentKey === documentKey}
              sourceFile={link.sourceFile}
            />
          ))}
        </nav>

        <details className="group relative ml-auto min-[1400px]:hidden">
          <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-xl bg-white/12 transition hover:bg-white/20 [&::-webkit-details-marker]:hidden">
            <span className="sr-only">Открыть навигацию</span>
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </summary>
          <nav
            className="absolute right-0 top-[calc(100%+12px)] grid w-[min(88vw,330px)] gap-1 rounded-2xl border border-white/15 bg-[#a63c28] p-2 text-sm font-semibold shadow-[0_18px_42px_rgba(72,35,30,.28)]"
            aria-label="Мобильная навигация"
          >
            {pageLinks.map((link) => (
              <HeaderLink
                key={link.href}
                href={link.href}
                label={link.label}
                active={link.documentKey === documentKey}
                sourceFile={link.sourceFile}
                mobile
              />
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}
