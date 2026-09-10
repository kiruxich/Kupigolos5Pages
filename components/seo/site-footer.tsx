import Link from "next/link";

export function ContactSection() {
  return (
    <section id="contacts" className="bg-[#eef1f6] px-4 py-20 sm:px-6 lg:py-28">
      <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[.82fr_1.18fr] lg:gap-20">
        <div>
          <p className="relative mb-9 w-fit text-[11px] font-extrabold uppercase tracking-[.14em] text-[#c1492e] after:absolute after:left-0 after:top-[calc(100%+12px)] after:h-0.5 after:w-[42px] after:bg-current">Начнем с голоса</p>
          <h2 className="max-w-[10ch] text-4xl font-bold leading-[1.03] tracking-[-.048em] text-[#243044] sm:text-6xl">Расскажите о проекте</h2>
          <p className="mt-6 max-w-md leading-7 text-[#69727d]">Подберем диктора, оценим сроки и предложим оптимальный формат производства.</p>
        </div>
        <form className="grid gap-5 rounded-[24px] border border-white/80 bg-white/60 p-5 shadow-[0_17px_44px_rgba(39,55,120,.07)] sm:grid-cols-2 sm:p-7" action="mailto:info@kupigolos.ru" method="post" encType="text/plain">
          <label className="grid gap-2 text-xs font-bold text-[#27323f]">Ваше имя<input className="h-13 rounded-[10px] border border-[#273778]/12 bg-white/85 px-4 font-normal outline-none transition focus:border-[#c1492e] focus:ring-3 focus:ring-[#c1492e]/10" name="name" autoComplete="name" required /></label>
          <label className="grid gap-2 text-xs font-bold text-[#27323f]">Телефон или почта<input className="h-13 rounded-[10px] border border-[#273778]/12 bg-white/85 px-4 font-normal outline-none transition focus:border-[#c1492e] focus:ring-3 focus:ring-[#c1492e]/10" name="contact" autoComplete="email" required /></label>
          <label className="grid gap-2 text-xs font-bold text-[#27323f] sm:col-span-2">Коротко о задаче<textarea className="min-h-32 rounded-[10px] border border-[#273778]/12 bg-white/85 p-4 font-normal outline-none transition focus:border-[#c1492e] focus:ring-3 focus:ring-[#c1492e]/10" name="message" required /></label>
          <button className="min-h-14 rounded-[14px_14px_14px_5px] bg-[#c1492e] px-6 text-sm font-bold text-white shadow-[0_8px_18px_rgba(112,45,33,.17)] transition hover:-translate-y-0.5 hover:bg-[#a93d28] hover:shadow-[0_12px_24px_rgba(112,45,33,.22)] sm:col-span-2" type="submit">Отправить заявку</button>
          <p className="text-[11px] leading-5 text-[#78808a] sm:col-span-2">Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности.</p>
        </form>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-[#27323f] px-4 py-14 text-white sm:px-6">
      <div className="mx-auto grid max-w-[1280px] gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div><Link className="text-xl font-extrabold" href="/">купи<span className="text-[#e48670]">голос</span></Link><p className="mt-5 max-w-xs text-sm leading-6 text-white/55">Онлайн-сервис для выбора лучших дикторов и производства озвучки.</p></div>
        <div><h2 className="mb-3 text-sm font-bold">Москва</h2><p className="text-sm leading-6 text-white/60">Большой Саввинский переулок, 9 стр. 3<br />Пн - Пт с 10:00 до 19:00</p></div>
        <div><h2 className="mb-3 text-sm font-bold">Нижний Новгород</h2><p className="text-sm leading-6 text-white/60">Московское шоссе, 52 корп. 4</p><a className="mt-2 inline-block text-sm" href="mailto:info@kupigolos.ru">info@kupigolos.ru</a></div>
        <div className="flex flex-col gap-2 text-lg font-bold"><a href="tel:88002004551">8 800 200-45-51</a><a href="tel:+79302125534">+7 (930) 212-55-34</a></div>
      </div>
      <div className="mx-auto mt-12 flex max-w-[1280px] flex-wrap justify-between gap-4 border-t border-white/15 pt-6 text-xs text-white/50"><span>© 2013 - 2026 КупиГолос</span><a className="transition hover:text-white" href="https://kupigolos.ru/privacy">Политика конфиденциальности</a><a className="transition hover:text-white" href="#start">Наверх ↑</a></div>
    </footer>
  );
}
