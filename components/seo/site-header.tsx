"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { SeoDocumentKey } from "@/lib/seo-page-config";

const site = "https://kupigolos.ru";
type PanelName = "services" | "voices" | "ai" | "info";
type HeaderLink = readonly [label: string, path: string];
type HeaderGroup = { title: string; titlePath?: string; description?: string; links?: readonly HeaderLink[] };

const panels: Record<PanelName, { title: string; groups: readonly HeaderGroup[]; activeFirst?: boolean; compact?: boolean }> = {
  services: {
    title: "Услуги", activeFirst: true,
    groups: [
      { title: "Озвучка видео", titlePath: "/ozvuchka-video", links: [["Фильмов и сериалов", "/ozvuchka-filmov"], ["Мультфильмов", "/ozvuchka-multfilmov"], ["YouTube каналов", "/ozvuchka-video-youtube"], ["Видеорекламы", "/ozvuchka-videoreklamy"]] },
      { title: "Работа с аудио", links: [["Озвучка игр", "/ozvuchka-igr"], ["Озвучка рекламы", "/ozvuchka-reklamy"], ["Запись аудиогидов", "/audiogidy"], ["Запись аудиокниг", "/audioknigi"], ["Рекламные аудиоролики", "/reklamnyie-audioroliki"], ["Голосовые приветствия", "/zapis-avtootvetchik-ivr"]] },
      { title: "Работа с текстом", links: [["Перевод и укладка", "/perevod"], ["Сценарии аудиороликов", "/scenarii-audiorolikov"]] },
      { title: "Локализация и перевод", titlePath: "/perevod", links: [["Перевод видео", "/perevod-i-ozvuchka-video"], ["Перевод игр", "/lokalizaciya-igr"], ["Перевод фильмов и сериалов", "/perevod-filmov-i-serialov"]] },
      { title: "Другие услуги", links: [["Озвучка презентаций / слайдов", "/ozvuchka-prezentacij"], ["Озвучка обучающих материалов", "/ozvuchka-obuchayushhih-materialov"]] },
    ],
  },
  voices: {
    title: "Дикторы",
    groups: [
      { title: "Иностранные дикторы", titlePath: "/diktory/inostrannye_golosa" },
      { title: "Русские дикторы", titlePath: "/diktory/russkie", links: [["Федеральные", "/diktory/izvestnye_golosa"], ["Региональные", "/diktory/reginalnye_golosa"]] },
      { title: "Актеры озвучки", titlePath: "/diktory/dubbing" },
      { title: "Контакты дикторов", titlePath: "/diktory/napryamuiu" },
      { title: "ИИ голоса", titlePath: "/diktory/ai" },
    ],
  },
  ai: {
    title: "ИИ сервисы", activeFirst: true,
    groups: [
      { title: "Голос и озвучка", links: [["Аудио", "/ai"], ["Генератор голоса", "/ai/voice/ai-voice-generator"], ["Озвучка текста", "/ai/voice/text-to-speech"], ["ИИ-озвучка", "/ai/voice/ai-voice-over"], ["Каталог голосов", "/ai/voice/library"], ["Изменение голоса", "/ai/voice/changer"]] },
      { title: "Музыка и песни", links: [["Генератор музыки", "/ai/music/ai-music-generator"], ["Генератор песен", "/ai/music/song-generator"], ["Генератор текстов песен", "/ai/music/lyrics-generator"], ["Создание музыки в Suno", "/ai/models/suno/music"]] },
      { title: "Видео и расшифровка", links: [["Озвучка видео", "/ai/dubbing-video"], ["Извлечение звука из видео", "/ai/audio-tools/extract-audio"], ["Видео в MP3", "/ai/audio-tools/video-to-mp3"], ["MP4 в MP3", "/ai/audio-tools/converter/mp4-to-mp3"], ["Транскрибация", "/ai/transcription"], ["Аудио в текст", "/ai/transcription/audio-to-text"], ["Видео в текст", "/ai/transcription/video-to-text"]] },
      { title: "Обработка аудио", links: [["Удаление вокала", "/ai/audio-tools/vocal-remover"], ["Обрезка аудио", "/ai/audio-tools/trim"], ["Конвертеры", "/ai/audio-tools/converter"], ["Конвертер в MP3", "/ai/audio-tools/converter/to-mp3"], ["WAV в MP3", "/ai/audio-tools/converter/wav-to-mp3"], ["MP3 в WAV", "/ai/audio-tools/converter/mp3-to-wav"], ["M4A в MP3", "/ai/audio-tools/converter/m4a-to-mp3"], ["OGG в MP3", "/ai/audio-tools/converter/ogg-to-mp3"], ["MP3 в OGG", "/ai/audio-tools/converter/mp3-to-ogg"]] },
      { title: "ИИ модели", links: [["Suno AI", "/ai/models/suno"], ["ElevenLabs", "/ai/models/elevenlabs"], ["Fish Audio", "/ai/models/fish-audio"], ["HeyGen", "/ai/models/heygen"], ["Yandex SpeechKit", "/ai/models/yandex-speechkit"]] },
    ],
  },
  info: {
    title: "Инфопортал", activeFirst: true, compact: true,
    groups: [
      { title: "Кто озвучивает", titlePath: "/kto-ozvuchivaet", description: "Актёры озвучки, персонажи и известные роли" },
      { title: "Что посмотреть", titlePath: "https://info.kupigolos.ru/", description: "Фильмы, сериалы и идеи для просмотра" },
    ],
  },
};

const url = (path: string) => path.startsWith("http") ? path : `${site}${path}`;

function HeaderPanel({ name, open }: { name: PanelName; open: boolean }) {
  const panel = panels[name];
  return (
    <section className={`header-mega header-mega-preprod${panel.compact ? " header-mega-preprod-compact" : ""}${open ? " is-open" : ""}`} id={`header-panel-${name}`} aria-hidden={!open} aria-label={panel.title}>
      <div className="preprod-header-menu">
        <div className="preprod-header-content">
          <nav className="preprod-header-links" aria-label={`Разделы ${panel.title.toLowerCase()}`}>
            {panel.groups.map((group, index) => (
              <div className={`preprod-header-row${panel.activeFirst && index === 0 ? " is-active" : ""}`} key={group.title}>
                {group.titlePath ? <a className="preprod-header-title" href={url(group.titlePath)}><span>{group.title}</span>{group.description ? <small>{group.description}</small> : null}</a> : <span className="preprod-header-title" tabIndex={0}><span>{group.title}</span></span>}
                {group.links?.length ? <div className="preprod-header-submenu">{group.links.map(([label, path]) => <a href={url(path)} key={label}>{label}</a>)}</div> : null}
              </div>
            ))}
          </nav>
          {!panel.compact ? <div className="preprod-header-footer"><div className="preprod-header-callback"><a href="tel:88002004551">8 800 200-45-51</a><a href="#contacts">Заказать звонок</a></div><nav className="preprod-header-networks" aria-label="Мессенджеры"><a href="https://telegram.dog/kupigolos_channel" target="_blank" rel="noopener" aria-label="Telegram"><img src={`${site}/img/telegram_red.svg`} alt="" /></a><a href="https://max.ru/u/f9LHodD0cOK-G2obtd_M0YIQMT0QPDbV7eVLequXg2kyv2Ns6b_L2NhBBwM" target="_blank" rel="noopener" aria-label="MAX"><img src={`${site}/img/max_red.svg`} alt="" /></a></nav></div> : null}
        </div>
        {!panel.compact ? <aside className="preprod-header-promo"><p>Озвучьте свой проект с помощью нейросети</p><a href="https://ai.kupigolos.ru/" target="_blank" rel="noopener">Сгенерировать озвучку</a><div className="preprod-header-promo-mic" aria-hidden="true"><img src={`${site}/img/teacher/mic.png`} alt="" /></div><img className="preprod-header-promo-art" src={`${site}/img/logo_info.svg`} alt="" aria-hidden="true" /></aside> : null}
      </div>
    </section>
  );
}

export function SiteHeader({ documentKey: _documentKey }: { documentKey: SeoDocumentKey }) {
  const [panel, setPanel] = useState<PanelName | null>(null);
  const [popover, setPopover] = useState<"phone" | "networks" | "utility" | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (event: MouseEvent) => { if (!rootRef.current?.contains(event.target as Node)) { setPanel(null); setPopover(null); } };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") { setPanel(null); setPopover(null); setMobileOpen(false); } };
    document.addEventListener("mousedown", close); document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", escape); };
  }, []);

  const togglePanel = (name: PanelName) => { setPanel((value) => value === name ? null : name); setPopover(null); };
  const togglePopover = (name: "phone" | "networks" | "utility") => { setPopover((value) => value === name ? null : name); setPanel(null); };

  return <div ref={rootRef}>
    <header className="site-header" data-header><div className="site-header-inner header-shell">
      <Link className="brand" href="/" aria-label="КупиГолос, на главную"><img src="/assets/kupigolos-logo-white.svg" alt="" width="109" height="51" /></Link>
      <nav className="site-nav" id="site-nav" aria-label="Основная навигация">
        {(["services", "voices"] as PanelName[]).map((name) => <button type="button" key={name} onClick={() => togglePanel(name)} aria-expanded={panel === name} aria-controls={`header-panel-${name}`}>{panels[name].title}</button>)}
        <button className="header-ai-trigger" type="button" onClick={() => togglePanel("ai")} aria-expanded={panel === "ai"} aria-controls="header-panel-ai"><i aria-hidden="true" />ИИ сервисы</button>
        <button type="button" onClick={() => togglePanel("info")} aria-expanded={panel === "info"} aria-controls="header-panel-info">Инфопортал</button><a href={`${site}/articles`}>Статьи</a>
      </nav>
      <div className="header-actions">
        <div className="header-popover"><button className="header-phone" type="button" onClick={() => togglePopover("phone")} aria-expanded={popover === "phone"} aria-controls="header-phone-popover" aria-label="Телефон"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.1 3.8 4.7 5.1c-.8.5-1.1 1.5-.7 2.4 2.7 6.7 8 12 14.7 14.7.9.4 1.9.1 2.4-.7l1.3-2.4-4.2-2.2-1.4 1.5a14.7 14.7 0 0 1-5.2-5.2l1.5-1.4-2.2-4.2Z" /></svg></button><div className={`header-action-popover header-phone-popover ${popover === "phone" ? "is-open" : ""}`} id="header-phone-popover" aria-hidden={popover !== "phone"}><a href="tel:88002004551">8 800 200-45-51</a><a className="header-callback-button" href="#contacts">Заказать звонок</a></div></div>
        <div className="header-popover"><button className="header-networks" type="button" onClick={() => togglePopover("networks")} aria-expanded={popover === "networks"} aria-controls="header-networks-popover" aria-label="Мессенджеры и социальные сети"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11.5a7.4 7.4 0 0 1-8 7.4 8.5 8.5 0 0 1-3.3-.7L4 20l1.8-4.1A7.2 7.2 0 0 1 4.6 12 7.4 7.4 0 0 1 12 4.6a7.4 7.4 0 0 1 8 6.9Z" /></svg></button><nav className={`header-action-popover header-networks-popover ${popover === "networks" ? "is-open" : ""}`} id="header-networks-popover" aria-hidden={popover !== "networks"} aria-label="Связаться в мессенджере"><a href="https://telegram.dog/studio_kupigolos">TG</a><a href="https://max.ru/u/f9LHodD0cOK-G2obtd_M0YIQMT0QPDbV7eVLequXg2kyv2Ns6b_L2NhBBwM">MAX</a><a href="https://wa.me/79302125534">WA</a></nav></div>
        <a className="header-favorites" href={`${site}/favourites`} aria-label="Избранное"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5 4.8 13.7C1.1 10.2 3 4.5 7.7 4.5c1.8 0 3.4.9 4.3 2.2.9-1.3 2.5-2.2 4.3-2.2 4.7 0 6.6 5.7 2.9 9.2L12 20.5Z" /></svg></a>
        <button className="nav-toggle" type="button" onClick={() => window.innerWidth <= 900 ? setMobileOpen((value) => !value) : togglePopover("utility")} aria-expanded={mobileOpen || popover === "utility"} aria-controls="header-utility-menu"><span className="nav-toggle-icon" aria-hidden="true"><i /><i /><i /></span><span className="sr-only">Открыть меню</span></button>
        <nav className={`header-utility-menu ${popover === "utility" ? "is-open" : ""}`} id="header-utility-menu" aria-hidden={popover !== "utility"} aria-label="Дополнительное меню"><a href={`${site}/login`}>Личный кабинет</a><span aria-hidden="true" /><a href={`${site}/price`}>Цены</a><a href={`${site}/oplata`}>Оплата</a><a href={`${site}/voprosy-i-otvety`}>FAQ</a><a href={`${site}/studio`}>О студии</a><a href="#contacts">Контакты</a></nav>
      </div>
    </div></header>
    <div className="header-mega-layer">{(Object.keys(panels) as PanelName[]).map((name) => <HeaderPanel key={name} name={name} open={panel === name} />)}</div>
    <aside className={`mobile-menu ${mobileOpen ? "is-open" : ""}`} aria-hidden={!mobileOpen} aria-label="Меню сайта"><button className="drawer-close" type="button" onClick={() => setMobileOpen(false)} aria-label="Закрыть меню">Закрыть <span aria-hidden="true">×</span></button><nav aria-label="Мобильная навигация">{(Object.keys(panels) as PanelName[]).map((name) => <details key={name}><summary>{panels[name].title} <span aria-hidden="true">+</span></summary><div>{panels[name].groups.flatMap((group) => group.links ?? (group.titlePath ? [[group.title, group.titlePath] as const] : [])).map(([label, path]) => <a href={url(path)} key={`${name}-${label}`}>{label}</a>)}</div></details>)}<a href={`${site}/articles`}>Статьи</a></nav><div className="mobile-menu-contact"><a href="tel:88002004551">8 800 200-45-51</a><a href="#contacts">Заказать звонок</a></div></aside>
    {mobileOpen ? <button className="site-overlay is-open" type="button" onClick={() => setMobileOpen(false)} aria-label="Закрыть открытое меню" /> : null}
  </div>;
}
