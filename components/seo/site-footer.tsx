import Link from "next/link";

export function ContactSection() {
  return (
    <section id="contacts" className="seo-contact">
      <div className="seo-contact__inner">
        <form className="seo-contact__form" action="mailto:info@kupigolos.ru" method="post" encType="text/plain">
          <header className="seo-contact__copy">
            <p className="seo-contact__kicker">Начнем с голоса</p>
            <h2>Расскажите о проекте</h2>
            <p>Подберем диктора, оценим сроки и предложим оптимальный формат производства.</p>
          </header>
          <label>Ваше имя<input name="name" autoComplete="name" required /></label>
          <label>Телефон или почта<input name="contact" autoComplete="email" required /></label>
          <label className="seo-contact__wide">Коротко о задаче<textarea name="message" required /></label>
          <div className="seo-contact__actions">
            <p>Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности.</p>
            <button type="submit"><span aria-hidden="true">→</span>Отправить заявку</button>
          </div>
        </form>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="seo-footer">
      <div className="seo-footer__grid">
        <div><Link className="seo-footer__brand" href="/">купи<span>голос</span></Link><p>Онлайн-сервис для выбора лучших дикторов и производства озвучки.</p></div>
        <div><h2>Москва</h2><p>Большой Саввинский переулок, 9 стр. 3<br />Пн - Пт с 10:00 до 19:00</p></div>
        <div><h2>Нижний Новгород</h2><p>Московское шоссе, 52 корп. 4</p><a href="mailto:info@kupigolos.ru">info@kupigolos.ru</a></div>
        <div className="seo-footer__phones"><a href="tel:88002004551">8 800 200-45-51</a><a href="tel:+79302125534">+7 (930) 212-55-34</a></div>
      </div>
      <div className="seo-footer__bottom"><span>© 2013 - 2026 КупиГолос</span><a href="https://kupigolos.ru/privacy">Политика конфиденциальности</a><a href="#start">Наверх ↑</a></div>
    </footer>
  );
}
