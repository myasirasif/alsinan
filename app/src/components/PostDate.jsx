import { postDates } from "../data/postDates";

const FORMAT = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/**
 * The publish date for a post, rendered from the same value jsonld.js reports
 * as datePublished. The blog index showed no dates at all, which hid how
 * recent the posts are from readers and from Google.
 *
 * timeZone is pinned to UTC so the server render and the browser agree; without
 * it a reader west of UTC would hydrate a different day and React would warn.
 */
export default function PostDate({ route, className = "post_date" }) {
  const iso = postDates[route];
  if (!iso) return null;
  return (
    <time className={className} dateTime={iso}>
      {FORMAT.format(new Date(iso))}
    </time>
  );
}
