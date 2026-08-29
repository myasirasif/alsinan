/**
 * The "why choose us" section: an intro, four selling points, and a pair of
 * photographs. Eight pages share it.
 *
 * Two layouts. The original packs everything into half the page width, which
 * gives each 40-word point a 250px column to live in. The "ledger" runs the
 * heading and photographs across the top and then lists the points full width,
 * so the copy gets a readable measure.
 *
 * `heading`, `footer` and `media` are passed through as JSX so whatever a page
 * puts in those slots survives exactly. Three other pages use a different inner
 * layout (`about_content`) and keep their own markup instead.
 */
export function WhyChoose({
  className = "why_choose",
  rowClass = "row",
  colClass = "col-lg-6",
  itemsRowClass = "row",
  variant = "grid",
  tone = "sand",
  heading,
  footer,
  media,
  children,
}) {
  if (variant === "ledger") {
    return (
      <section className={`${className} why_ledger why_ledger--${tone}`}>
        <div className="container">
          <div className="why_ledger__top">
            <div className="why_ledger__intro">{heading}</div>
            <div className="why_ledger__media">{media}</div>
          </div>
          <div className="why_ledger__list">{children}</div>
          {footer ? <div className="why_ledger__foot">{footer}</div> : null}
        </div>
      </section>
    );
  }

  return (
    <section className={className}>
      <div className="container">
        <div className={rowClass}>
          <div className={colClass}>
            <div className="content_why_choose">
              {heading}
              <div className={itemsRowClass}>{children}</div>
              {footer}
            </div>
          </div>
          {media}
        </div>
      </div>
    </section>
  );
}

/** One selling point: icon, title, copy. `col` is the width the page used. */
export function ChoosePoint({ col = "6", children }) {
  return (
    <div className={`col-lg-${col}`}>
      <div className="choose_list">{children}</div>
    </div>
  );
}
