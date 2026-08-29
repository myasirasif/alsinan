/**
 * The "our fleet / what we offer" section. Its wrapper markup is identical on
 * all ten pages that use it; only the heading and the number of cards change,
 * so the wrappers live here and each page passes its own cards as children.
 *
 * `heading` and `intro` are passed through as JSX rather than as text, so
 * whatever a page puts there - a sub-heading span, an h2, an extra paragraph -
 * survives untouched. The markup reproduces the theme's output exactly,
 * including its own `servcies_content` spelling, because styles.css targets it.
 */
export function ServicesSection({
  className = "services_section",
  rowClass = "row justify-content-center",
  heading,
  intro,
  children,
}) {
  return (
    <section className={className}>
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <div className="servcies_content">
              {heading}
              <div className="whatsapp_num">
                <div className="whatsapp_box">
                  <div className="icon_wp">
                    <img
                      src="/wp-content/uploads/2025/09/icon_wp.svg"
                      alt="Chat with Alsinan Transport on WhatsApp"
                      width="37"
                      height="36"
                    />
                  </div>
                  <div className="num_wp">
                    <span>Whasapp</span>
                    <a
                      href="https://wa.me/971555252397?text=I%20want%20to%20know%20more%20about%20Alsinan"
                      target="_blank"
                    >
                      +971 55 525 2397
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            {intro}
            <div className="servies_fields">
              <div className={rowClass}>{children}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** One card. `col` is the Bootstrap width the page used for it. */
export function ServiceBox({ col = "6", children }) {
  return (
    <div className={`col-lg-${col}`}>
      <div className="services_box">{children}</div>
    </div>
  );
}
