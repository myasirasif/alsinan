import { Link } from "react-router-dom";
import { waLink } from "../../lib/whatsapp";

// The theme's inner banner carried a label and a heading and nothing else, so
// someone arriving from a search spent the whole first screen on the words
// "Services / For X": no H1, no proof, nothing to act on. On most of these
// pages the same two words then appeared again immediately below it, with the
// real H1 underneath those.
//
// This hero does the work instead: one H1, a subline, a few proof points and
// both contact actions, with the page's photograph beside them. It stays dark
// because #masthead is absolutely positioned over whatever renders first and
// its links are white, so a light hero would hide the navigation.
//
// On fetchPriority, which is opt in per page via image.priority: prerender.mjs
// already preloads each page's hero background at high priority, and on seven
// of the eight service pages that background, not the photo, is the largest
// paint. Marking the photo high priority there only competes with it. Staff
// measured 4328ms with the flag and 3860ms without, on a throttled 390x844
// profile, median of three. The bus rental page is the exception: its photo is
// 4:3, so it is tall enough to be the LCP element itself, and there the flag
// is worth 4712ms down to 3180ms. Measure before setting it; the wrong answer
// costs several hundred milliseconds in either direction.
//
// `points` may be two or three entries. Some pages do not state three facts of
// their own, and a point is only ever allowed to repeat something that page's
// own copy already says.
export default function ServiceHero({ route, crumb, heading, subline, points, image }) {
  return (
    <section
      className={"svc_hero" + (image ? "" : " svc_hero--no-media")}
      style={{ backgroundImage: "url('/wp-content/uploads/2025/10/banner_bg.webp')" }}
    >
    <div className="container">
    <div className="svc_hero__grid">

    <div className="svc_hero__copy">
    <nav className="svc_hero__crumb" aria-label="Breadcrumb">
    <Link to="/services/">Services</Link>
    <span aria-hidden="true">/</span>
    <span>{crumb}</span>
    </nav>
    <h1>{heading}</h1>
    <p className="svc_hero__sub">{subline}</p>
    <ul className="svc_hero__points">
    {points.map((point) => <li key={point}>{point}</li>)}
    </ul>
    <div className="svc_hero__actions">
    <a href={waLink(route)} className="btn btn-primary" target="_blank" rel="noopener">Get a Quote on WhatsApp</a>
    <a href="tel:+971555252397" className="btn btn-secondary">Call +971 55 525 2397</a>
    </div>
    </div>

    {image && (
      <div className="svc_hero__media">
      <img
        src={image.src}
        width={image.width}
        height={image.height}
        alt={image.alt}
        srcSet={image.srcSet}
        sizes={image.sizes || "(max-width: 991px) 100vw, 44vw"}
        decoding="async"
        fetchPriority={image.priority ? "high" : undefined}
      />
      </div>
    )}

    </div>
    </div>
    </section>
  );
}
