import { Helmet } from "react-helmet-async";

/**
 * Renders the exact head markup Rank Math produced for each WordPress page:
 * title, description, robots, canonical, Open Graph, Twitter cards and JSON-LD.
 */
export default function Seo({ title, meta = [], canonical, jsonld = [] }) {
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
      {jsonld.map((block, i) => (
        <script key={i} type="application/ld+json">
          {block}
        </script>
      ))}
    </Helmet>
  );
}
