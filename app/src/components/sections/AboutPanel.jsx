/**
 * The homepage About section as a full-bleed panel: copy on one side, the fleet
 * photograph running the full height on the other, with the red badge landing on
 * the seam between them.
 *
 * `tone` picks the ground. "day" is a warm sand band; "night" is near-black.
 * The page's own rhythm is the reason this is a choice rather than a constant —
 * the banner directly above is a dark photograph, and the fleet section further
 * down is already the page's dark moment.
 *
 * Copy is passed through as children so every paragraph survives verbatim, and
 * the photograph arrives as a prop because each page uses a different one.
 */
export default function AboutPanel({
  image,
  alt = "",
  tone = "day",
  mirrored = false,
  children,
}) {
  const media = (
    <div
      className="about_panel__media"
      style={{ backgroundImage: `url("${image}")` }}
      role="img"
      aria-label={alt}
    >
      <span className="about_panel__badge" aria-hidden="true" />
    </div>
  );

  return (
    <section className={`about_section about_panel about_panel--${tone}${mirrored ? " about_panel--mirrored" : ""}`}>
      <div className="about_panel__grid">
        {mirrored ? media : null}
        <div className="about_panel__copy">
          {children}
          <dl className="about_panel__facts">
            <div>
              <dt>Cars to coaches</dt>
              <dd>One contract, the whole fleet</dd>
            </div>
            <div>
              <dt>RTA-licensed</dt>
              <dd>Every driver, background-checked</dd>
            </div>
            <div>
              <dt>Round the clock</dt>
              <dd>Flight-tracked airport runs</dd>
            </div>
          </dl>
        </div>
        {mirrored ? null : media}
      </div>
    </section>
  );
}
