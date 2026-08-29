# Content audit

Measured with `content_audit.py` against the built pages, not read off impressions.
`/category/cars/` is excluded throughout — it is noindexed and duplicates `/blogs/`.

## Where the site is strong

**Every page has its own vocabulary.** Ranking the words each page uses far more
than the others shows no two pages speaking the same language:

| Page | Its own words |
| --- | --- |
| `/services/school-transport-in-dubai/` | students (13), schools (10), parents (8) |
| `/services/staff-transport-in-dubai/` | employees (8), teams (9), offices (3) |
| `/services/airport-transport-in-dubai/` | terminal, flight, bags, journey |
| `/services/dubai-tours-transport-services/` | itinerary, desert, multi, group |

**The writing is readable.** 1,316 sentences, averaging **15.1 words**, with only
9% over 25 words. Most business sites sit at 22–25. This is genuinely good and
worth protecting when anything is rewritten.

**Service pages have real depth** — 943 to 1,228 words each. Nothing is thin.

## The five real problems

### 1. The site never says where in Dubai it operates

This is the largest opportunity on the site.

| Place | Times used |
| --- | --- |
| Dubai | 322 |
| Bur Dubai | 43 (the footer address, essentially) |
| Abu Dhabi | 4 |
| Jabal Ali | 3 |
| Sharjah | 1 |
| **Deira, Marina, Business Bay, Al Quoz, JLT, Silicon Oasis, Sheikh Zayed Road, Internet City** | **0 — never once** |

Writing "Dubai" 322 times does not win "Dubai" — every competitor is fighting for
that word. Local search is won on districts. Someone searching *staff transport
Al Quoz* or *school bus Dubai Marina* finds nothing here.

The information already exists: the FAQ says the company works "Jabal Ali and DIC
hubs". It just never reached the pages.

**Fix:** an "areas we cover" block on each service page, naming real districts.
The ledger layout now used for Why Choose has room for exactly this.

### 2. Service pages overlap 30–42%

Shared vocabulary between the six service pages:

| Pair | Overlap |
| --- | --- |
| airport vs hotel | **42%** |
| school vs staff | 36% |
| hotel vs private car | 36% |
| the rest | 30–35% |

Around 30% is normal for one company's service pages. **42% is the point where
Google has to choose** which page answers a query, and the two split each other's
strength. Airport and hotel need pulling apart deliberately.

### 3. Nothing answers what a buyer actually asks

| Term | Occurrences across the whole site |
| --- | --- |
| AED / dirham | **0** |
| per day / per month | **0** |
| seater (14-seater, 30-seater) | **0** |
| review / testimonial | **0** |
| "years of experience" / "since" | **0** |

Withholding exact prices is defensible — contracts differ. But **seat capacity is
not a price**, and it is how people search. "Hiace van" should be "14-seater
Hiace van"; a coach should carry its seat count.

### 4. Service pages have no form; blog posts do

| Page type | Contact form |
| --- | --- |
| Blog posts (7) | present on every one |
| **Service pages (6)** | **none** |

This is backwards. A reader on a blog post is not ready to buy. A reader on
`/services/staff-transport-in-dubai/` is. The cheapest conversion win on the site
is putting the form where the intent is.

### 5. The two hub pages are the thinnest on the site

`/services/` is 467 words and `/blogs/` is 312. These are the pages that should be
collecting and passing authority to everything beneath them.

## What to do first

1. **Name the districts.** One block per service page. Highest ceiling, and the
   content already half exists in the FAQ.
2. **Put the form on the service pages.** Lowest effort, most direct effect on
   enquiries.
3. **Add seat capacities** to `/our-fleet/` and the service pages. People search
   by capacity, and the site never states one.

All three are content decisions rather than code, which is why they are written
down here rather than applied. Supply the district list and the seat counts and
they can be built into the existing layouts.
