"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { SeoDocumentKey } from "@/lib/seo-page-config";

const site = "https://kupigolos.ru";
const asset = (name: string) => `/assets/${name}`;

type PanelName = "services" | "voices" | "ai" | "info";
type HeaderLink = readonly [label: string, path: string];
type HeaderGroup = { title: string; titlePath?: string; description?: string; links?: readonly HeaderLink[] };

const panels: Record<PanelName, { title: string; groups: readonly HeaderGroup[]; compact?: boolean }> = {
  services: {
    title: "Услуги",
    groups: [
      { title: "Озвучка видео", titlePath: "/ozvuchka-video", links: [["Фильмов и сериалов", "/ozvuchka-filmov"], ["Мультфильмов", "/ozvuchka-multfilmov"], ["YouTube каналов", "/ozvuchka-video-youtube"], ["Видеорекламы", "/ozvuchka-videoreklamy"]] },
      { title: "Работа с аудио", links: [["Озвучка игр", "/ozvuchka-igr"], ["Озвучка рекламы", "/ozvuchka-reklamy"], ["Запись аудиогидов", "/audiogidy"], ["Запись аудиокниг", "/audioknigi"], ["Рекламные аудиоролики", "/reklamnyie-audioroliki"], ["Голосовые приветствия", "/zapis-avtootvetchik-ivr"]] },
      { title: "Работа с текстом", links: [["Перевод и укладка", "/perevod"], ["Сценарии аудиороликов", "/scenarii-audiorolikov"]] },
      { title: "Локализация и перевод", titlePath: "/perevod", links: [["Перевод видео", "/perevod-i-ozvuchka-video"], ["Перевод игр", "/lokalizaciya-igr"], ["Перевод фильмов и сериалов", "/perevod-filmov-i-serialov"]] },
      { title: "Другие услуги", links: [["Озвучка презентаций / слайдов", "/ozvuchka-prezentacij"], ["Озвучка обучающих материалов", "/ozvuchka-obuchayushchih-materialov"]] },
    ],
  },
  voices: {
    title: "Дикторы",
    groups: [
      { title: "Иностранные дикторы", titlePath: "/diktory/inostrannye_golosa" },
      { title: "Русские дикторы", links: [["Федеральные", "/diktory/izvestnye_golosa"], ["Региональные", "/diktory/reginalnye_golosa"]] },
      { title: "Актеры озвучки", titlePath: "/diktory/dubbing" },
      { title: "Контакты дикторов", titlePath: "/diktory/napryamuiu" },
      { title: "ИИ голоса", titlePath: "/diktory/ai" },
    ],
  },
  ai: {
    title: "ИИ сервисы",
    groups: [
      { title: "Голос и озвучка", links: [["Аудио", "/ai"], ["Генератор голоса", "/ai/voice/ai-voice-generator"], ["Озвучка текста", "/ai/voice/text-to-speech"], ["ИИ-озвучка", "/ai/voice/ai-voice-over"], ["Каталог голосов", "/ai/voice/library"], ["Изменение голоса", "/ai/voice/changer"]] },
      { title: "Музыка и песни", links: [["Генератор музыки", "/ai/music/ai-music-generator"], ["Генератор песен", "/ai/music/song-generator"], ["Генератор текстов песен", "/ai/music/lyrics-generator"], ["Создание музыки в Suno", "/ai/models/suno/music"]] },
      { title: "Видео и расшифровка", links: [["Озвучка видео", "/ai/dubbing-video"], ["Извлечение звука из видео", "/ai/audio-tools/extract-audio"], ["Видео в MP3", "/ai/audio-tools/video-to-mp3"], ["Транскрибация", "/ai/transcription"], ["Аудио в текст", "/ai/transcription/audio-to-text"], ["Видео в текст", "/ai/transcription/video-to-text"]] },
      { title: "Обработка аудио", links: [["Удаление вокала", "/ai/audio-tools/vocal-remover"], ["Обрезка аудио", "/ai/audio-tools/trim"], ["Конвертеры", "/ai/audio-tools/converter"], ["Конвертер в MP3", "/ai/audio-tools/converter/to-mp3"], ["WAV в MP3", "/ai/audio-tools/converter/wav-to-mp3"], ["MP3 в WAV", "/ai/audio-tools/converter/mp3-to-wav"]] },
      { title: "ИИ модели", links: [["Suno AI", "/ai/models/suno"], ["ElevenLabs", "/ai/models/elevenlabs"], ["Fish Audio", "/ai/models/fish-audio"], ["HeyGen", "/ai/models/heygen"], ["Yandex SpeechKit", "/ai/models/yandex-speechkit"]] },
    ],
  },
  info: {
    title: "Инфопортал",
    compact: true,
    groups: [
      { title: "Кто озвучивает", titlePath: "/kto-ozvuchivaet", description: "Актёры озвучки, персонажи и известные роли" },
      { title: "Что посмотреть", titlePath: "https://info.kupigolos.ru/", description: "Фильмы, сериалы и идеи для просмотра" },
    ],
  },
};

const utilityLinks = [
  ["Личный кабинет", "/login"], ["Цены", "/price"], ["Оплата", "/oplata"],
  ["FAQ", "/voprosy-i-otvety"], ["О студии", "/studio"], ["Контакты", "/contacts"],
] as const;

const externalUrl = (path: string) => path.startsWith("http") ? path : `${site}${path}`;

function AiWave() {
  return <svg className="header-ai-wave" viewBox="0 0 20 16" aria-hidden="true"><path d="M0 8h2l1.2-5 2 10 2-8 2 6 2-9 2 12 2-7 1.3 3H20" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>;
}

function HeaderPanel({ name, open }: { name: PanelName; open: boolean }) {
  const panel = panels[name];
  return (
    <section className={`header-panel${panel.compact ? " header-panel--compact" : ""}${open ? " is-open" : ""}`} id={`header-panel-${name}`} aria-hidden={!open} aria-label={panel.title}>
      <div className="header-panel-content">
        <div className="header-panel-main">
          <nav className="header-panel-links" aria-label={`Разделы ${panel.title.toLowerCase()}`}>
            {panel.groups.map((group, index) => (
              <div className={`header-panel-row${index === 0 ? " is-active" : ""}`} key={group.title}>
                {group.titlePath ? <a className="header-panel-title" href={externalUrl(group.titlePath)}><span>{group.title}</span>{group.description ? <small>{group.description}</small> : null}</a> : <span className="header-panel-title" tabIndex={0}>{group.title}</span>}
                {group.links?.length ? <div className="header-panel-submenu">{group.links.map(([label, path]) => <a href={externalUrl(path)} key={label}>{label}</a>)}</div> : null}
              </div>
            ))}
          </nav>
          {!panel.compact ? <div className="header-panel-footer"><div className="header-panel-callback"><a href="tel:88002004551">8 800 200-45-51</a><a href="#contacts">Заказать звонок</a></div><nav className="header-panel-socials" aria-label="Мессенджеры"><a href="https://telegram.dog/kupigolos_channel" target="_blank" rel="noopener" aria-label="Telegram"><img src={asset("telegram_red.svg")} alt="" /></a><a href="https://max.ru/u/f9LHodD0cOK-G2obtd_M0YIQMT0QPDbV7eVLequXg2kyv2Ns6b_L2NhBBwM" target="_blank" rel="noopener" aria-label="MAX"><img src={asset("max_red.svg")} alt="" /></a></nav></div> : null}
        </div>
        {!panel.compact ? <aside className="header-panel-promo"><p>Озвучьте свой проект с помощью нейросети</p><a href="https://ai.kupigolos.ru/" target="_blank" rel="noopener">Сгенерировать озвучку</a><img className="header-panel-mic" src={asset("header-mic.png")} alt="" aria-hidden="true" /><img className="header-panel-art" src={asset("logo_info.svg")} alt="" aria-hidden="true" /></aside> : null}
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
    const closeOutside = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) { setPanel(null); setPopover(null); }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setPanel(null); setPopover(null); setMobileOpen(false); }
    };
    document.addEventListener("mousedown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => { document.removeEventListener("mousedown", closeOutside); document.removeEventListener("keydown", closeOnEscape); };
  }, []);

  const togglePanel = (name: PanelName) => { setPanel((value) => value === name ? null : name); setPopover(null); };
  const togglePopover = (name: "phone" | "networks" | "utility") => { setPopover((value) => value === name ? null : name); setPanel(null); };

  return (
    <div className="header-root" ref={rootRef}>
      <header className="site-header" data-header>
        <div className="site-header-inner">
          <Link className="brand" href="/" aria-label="КупиГолос, на главную"><img src={asset("logo.svg")} alt="КупиГолос" /></Link>
          <nav className="site-nav" aria-label="Основная навигация">
            <button type="button" onClick={() => togglePanel("services")} aria-expanded={panel === "services"} aria-controls="header-panel-services">Услуги</button>
            <button type="button" onClick={() => togglePanel("voices")} aria-expanded={panel === "voices"} aria-controls="header-panel-voices">Дикторы</button>
            <button className="header-ai-trigger" type="button" onClick={() => togglePanel("ai")} aria-expanded={panel === "ai"} aria-controls="header-panel-ai"><AiWave />ИИ сервисы</button>
            <button type="button" onClick={() => togglePanel("info")} aria-expanded={panel === "info"} aria-controls="header-panel-info">Инфопортал</button>
            <a href={`${site}/articles`}>Статьи</a>
          </nav>
          <div className="header-actions">
            <div className="header-popover"><button className="header-action-button" type="button" onClick={() => togglePopover("phone")} aria-expanded={popover === "phone"} aria-controls="header-phone-popover" aria-label="Телефон"><img src={asset("header_phone.svg")} alt="" /><img className="is-hover" src={asset("header_phone_hover.svg")} alt="" /></button><div className={`header-action-popover header-phone-popover${popover === "phone" ? " is-open" : ""}`} id="header-phone-popover" aria-hidden={popover !== "phone"}><a href="tel:88002004551">8 800 200-45-51</a><a href="#contacts">Заказать звонок</a></div></div>
            <div className="header-popover"><button className="header-action-button" type="button" onClick={() => togglePopover("networks")} aria-expanded={popover === "networks"} aria-controls="header-networks-popover" aria-label="Мессенджеры и социальные сети"><img src={asset("header_networks.svg")} alt="" /><img className="is-hover" src={asset("header_networks_hover.svg")} alt="" /></button><nav className={`header-action-popover header-networks-popover${popover === "networks" ? " is-open" : ""}`} id="header-networks-popover" aria-hidden={popover !== "networks"} aria-label="Связаться в мессенджере"><a href="https://telegram.dog/studio_kupigolos" target="_blank" rel="noopener" aria-label="Telegram"><img src={asset("telegram.svg")} alt="" /><img className="is-hover" src={asset("telegram_hover.svg")} alt="" /></a><a href="https://max.ru/u/f9LHodD0cOK-G2obtd_M0YIQMT0QPDbV7eVLequXg2kyv2Ns6b_L2NhBBwM" target="_blank" rel="noopener" aria-label="MAX"><img src={asset("max.svg")} alt="" /></a><a href="whatsapp://send?phone=79302125534" aria-label="WhatsApp"><img src={asset("whatsapp.svg")} alt="" /><img className="is-hover" src={asset("whatsapp_hover.svg")} alt="" /></a></nav></div>
            <a className="header-action-button" href={`${site}/favourites`} aria-label="Избранное"><img src={asset("header_like.svg")} alt="" /><img className="is-hover" src={asset("header_like_hover.svg")} alt="" /></a>
            <div className="header-utility"><button className="header-burger" type="button" onClick={() => togglePopover("utility")} aria-expanded={popover === "utility"} aria-controls="header-utility-menu" aria-label="Дополнительное меню"><i /><i /><i /></button><nav className={`header-utility-menu${popover === "utility" ? " is-open" : ""}`} id="header-utility-menu" aria-hidden={popover !== "utility"} aria-label="Дополнительное меню">{utilityLinks.map(([label, path], index) => <a className={index === 1 ? "with-divider" : undefined} href={externalUrl(path)} key={label}>{label}</a>)}</nav></div>
          </div>
          <button className="header-mobile-toggle" type="button" onClick={() => setMobileOpen((value) => !value)} aria-expanded={mobileOpen} aria-controls="mobile-site-menu" aria-label="Открыть меню"><i /><i /><i /></button>
        </div>
      </header>
      <div className="header-panel-layer">{(Object.keys(panels) as PanelName[]).map((name) => <HeaderPanel key={name} name={name} open={panel === name} />)}</div>
      <aside className={`mobile-menu${mobileOpen ? " is-open" : ""}`} id="mobile-site-menu" aria-hidden={!mobileOpen} aria-label="Меню сайта"><button className="drawer-close" type="button" onClick={() => setMobileOpen(false)} aria-label="Закрыть меню">Меню <span aria-hidden="true">×</span></button><nav aria-label="Мобильная навигация"><a href={site}>Услуги</a><a href="/diktory">Дикторы</a><a href={`${site}/ai`}>ИИ сервисы</a><a href="https://info.kupigolos.ru/">Инфопортал</a><a href={`${site}/articles`}>Статьи</a>{utilityLinks.map(([label, path]) => <a href={externalUrl(path)} key={label}>{label}</a>)}</nav><div className="mobile-menu-contact"><a href="tel:88002004551">8 800 200-45-51</a><a href="#contacts">Заказать звонок</a></div></aside>
      {mobileOpen ? <button className="site-overlay" type="button" onClick={() => setMobileOpen(false)} aria-label="Закрыть открытое меню" /> : null}
    </div>
  );
}
