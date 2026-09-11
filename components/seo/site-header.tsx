"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { SeoDocumentKey } from "@/lib/seo-page-config";

const site = "https://kupigolos.ru";

const utilityLinks = [
  ["Цены", `${site}/price`],
  ["Оплата", `${site}/oplata`],
  ["FAQ", `${site}/voprosy-i-otvety`],
  ["О студии", `${site}/studio`],
  ["Контакты", "#contacts"],
] as const;

const primaryLinks = [
  ["Услуги", site],
  ["Дикторы", "/diktory"],
  ["ИИ сервисы", `${site}/ai`],
  ["Инфопортал", "https://info.kupigolos.ru/"],
  ["Статьи", `${site}/articles`],
] as const;

function TelegramIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m20.6 4.2-3 14.2c-.2 1-1 1.2-1.8.7l-4.6-3.4-2.2 2.1c-.2.3-.5.5-.9.5l.3-4.7 8.7-7.9c.4-.3-.1-.5-.6-.2L5.7 12.3 1.1 10.9c-1-.3-1-1 .2-1.5l18-6.9c.8-.3 1.5.2 1.3 1.7Z" /></svg>;
}

function WhatsAppIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 11.8a8.3 8.3 0 0 1-12.3 7.3L3.5 20.5l1.4-4.6A8.3 8.3 0 1 1 20.5 11.8Z" /><path d="M8.2 7.5c.2-.4.4-.4.8-.4h.5c.2 0 .4 0 .5.4l.7 1.7c.1.3.1.5-.1.7l-.6.8c-.2.2-.2.4-.1.6.7 1.2 1.7 2.2 3 2.8.2.1.4.1.6-.1l.9-1.1c.2-.2.4-.3.7-.2l1.8.9c.3.1.5.3.5.5-.1.8-.5 1.5-1.1 2-.6.5-1.5.7-2.3.5-1.2-.3-2.4-.8-3.4-1.5a11 11 0 0 1-3.5-4.3c-.5-1.1-.5-2.2.1-3.3Z" /></svg>;
}

function HeartIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5 4.8 13.7C1.1 10.2 3 4.5 7.7 4.5c1.8 0 3.4.9 4.3 2.2.9-1.3 2.5-2.2 4.3-2.2 4.7 0 6.6 5.7 2.9 9.2L12 20.5Z" /></svg>;
}

function AccountIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5" /><path d="M5.5 20c.4-4.1 2.6-6.2 6.5-6.2s6.1 2.1 6.5 6.2Z" /></svg>;
}

function PhoneIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.3c1.2.4 2.4.6 3.6.6a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.6 21 3 13.4 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 .9c.1 1.2.3 2.4.7 3.5a1 1 0 0 1-.3 1l-2.2 2.2Z" /></svg>;
}

function MessengerIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11.5a7.4 7.4 0 0 1-8 7.4 8.5 8.5 0 0 1-3.3-.7L4 20l1.8-4.1A7.2 7.2 0 0 1 4.6 12 7.4 7.4 0 0 1 12 4.6a7.4 7.4 0 0 1 8 6.9Z" /></svg>;
}

export function SiteHeader({ documentKey: _documentKey }: { documentKey: SeoDocumentKey }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, []);

  return (
    <div className="header-stage">
      <header className="site-header" data-header>
        <div className="site-header-inner header-shell">
          <div className="header-topline">
            <nav className="header-utility-links" aria-label="Сервисная навигация">
              {utilityLinks.map(([label, href]) => <a href={href} key={label}>{label}</a>)}
            </nav>
            <div className="header-top-actions">
              <a className="header-email" href="mailto:info@kupigolos.ru">info@kupigolos.ru</a>
              <a className="header-social header-social--telegram" href="https://telegram.dog/studio_kupigolos" target="_blank" rel="noopener" aria-label="Telegram"><TelegramIcon /></a>
              <a className="header-social header-social--whatsapp" href="whatsapp://send?phone=79302125534" aria-label="WhatsApp"><WhatsAppIcon /></a>
              <a className="header-icon-link" href={`${site}/favourites`} aria-label="Избранное"><HeartIcon /><span>0</span></a>
              <a className="header-icon-link" href={`${site}/login`} aria-label="Личный кабинет"><AccountIcon /><span>0</span></a>
            </div>
          </div>

          <div className="header-primary">
            <Link className="brand" href="/" aria-label="КупиГолос, на главную"><img src="/assets/kupigolos-logo-white.svg" alt="" width="109" height="51" /></Link>
            <nav className="site-nav" aria-label="Основная навигация">
              {primaryLinks.map(([label, href]) => <a className={label === "ИИ сервисы" ? "header-ai-link" : undefined} href={href} key={label}>{label === "ИИ сервисы" ? <i aria-hidden="true" /> : null}{label}</a>)}
            </nav>
            <div className="header-main-actions" aria-label="Быстрые действия">
              <a className="header-round-action" href="tel:88002004551" aria-label="Позвонить"><PhoneIcon /></a>
              <a className="header-round-action" href="https://telegram.dog/studio_kupigolos" target="_blank" rel="noopener" aria-label="Мессенджеры и социальные сети"><MessengerIcon /></a>
              <a className="header-round-action" href={`${site}/favourites`} aria-label="Избранное в основном меню"><HeartIcon /></a>
            </div>
            <button className="nav-toggle" type="button" onClick={() => setMobileOpen((value) => !value)} aria-expanded={mobileOpen} aria-controls="mobile-site-menu">
              <span className="nav-toggle-icon" aria-hidden="true"><i /><i /><i /></span><span className="sr-only">Открыть меню</span>
            </button>
          </div>

          <a className="header-partner" href="https://www.kinopoisk.ru/" target="_blank" rel="noopener">
            <span className="header-partner-content">
              <img src="/assets/Kinopoisk.svg" alt="Кинопоиск" width="85" height="11" />
              <span className="header-partner-cross" aria-hidden="true">×</span>
              <img src="/assets/Kupigolos.svg" alt="КупиГолос" width="60" height="27" />
              <span className="header-partner-copy">Студия озвучивания с Кинопоиска</span>
            </span>
          </a>
        </div>
      </header>

      <aside className={`mobile-menu ${mobileOpen ? "is-open" : ""}`} id="mobile-site-menu" aria-hidden={!mobileOpen} aria-label="Меню сайта">
        <button className="drawer-close" type="button" onClick={() => setMobileOpen(false)} aria-label="Закрыть меню">Меню <span aria-hidden="true">×</span></button>
        <nav aria-label="Мобильная навигация">
          {primaryLinks.map(([label, href]) => <a href={href} key={label}>{label}</a>)}
          {utilityLinks.map(([label, href]) => <a href={href} key={label}>{label}</a>)}
        </nav>
        <div className="mobile-menu-contact"><a href="tel:88002004551">8 800 200-45-51</a><a href="#contacts">Быстрый заказ</a></div>
      </aside>
      {mobileOpen ? <button className="site-overlay is-open" type="button" onClick={() => setMobileOpen(false)} aria-label="Закрыть открытое меню" /> : null}
    </div>
  );
}
