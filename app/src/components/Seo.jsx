import { Helmet } from "react-helmet-async";

/**
 * Renders the head markup Rank Math produced for each WordPress page: title,
 * description, robots, canonical, Open Graph and Twitter cards.
 *
 * JSON-LD is deliberately absent. prerender.mjs writes it straight into the
 * static HTML, so crawlers still see it on every URL while the ~155 KB of
 * structured data stays out of the browser bundle.
 */
export default function Seo({ title, meta = [], canonical }) {
  return (
    <Helmet>
      {title ? <title>{title}</title> : null}
      {meta.map((m, i) =>
        m.name ? (
          <meta key={i} name={m.name} content={m.content} />
        ) : (
          <meta key={i} property={m.property} content={m.content} />
        )
      )}
      {canonical ? <link rel="canonical" href={canonical} /> : null}
    </Helmet>
  );
}
