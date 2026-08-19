# Slots in `forge`

Implements slot schema version 1 of [`../SLOTS.md`](../SLOTS.md). Names are
defined there; this file records what this template actually marks up. The
validator checks both directions, so this table and the HTML cannot drift apart.

Forge was written to test whether that shared vocabulary survives a second,
structurally different template. Everything below is a name from the shared
file. The four amendments forge needed are `process.*`, `pricing.*`,
`services.item.detail`, and marking `contact.phone` in chrome rather than only
in the contact section; each was added to `../SLOTS.md` first, and none of them
is scoped to this template or to its category.

## Single slots

| Slot | Element | Required | Pages | What goes there |
|---|---|---|---|---|
| `site.title` | `<title>`, `<meta property="og:title">` | required | index | Browser tab and search result title |
| `site.description` | `<meta name="description">`, `<meta property="og:description">` | required | index | One or two sentences for search results |
| `site.canonical` | `<link rel="canonical">`, `<meta property="og:url">` | required | index | Absolute URL of the home page |
| `site.og_image` | `<meta property="og:image">` | optional | index | Absolute URL of the share image |
| `business.name` | text | required | all | Display name, in the rail and the footer |
| `business.tagline` | text | required | all | One line in the footer saying what the business does |
| `nav.cta` | `<a>` text | optional | all | Label of the standing call to action |
| `hero.eyebrow` | text | required | index | Three or four words above the headline |
| `hero.heading` | text (`<h1>`) | required | index | The page's one `<h1>` |
| `hero.body` | text | required | index | Two or three sentences under the headline |
| `hero.cta_primary` | `<a>` text | required | index | Label of the primary call to action |
| `hero.cta_secondary` | `<a>` text | required | index | Label of the secondary call to action |
| `process.heading` | text (`<h2>`) | optional | index | Process section heading |
| `process.intro` | text | optional | index | One or two sentences under it |
| `services.heading` | text (`<h2>`) | required | index | Services section heading |
| `services.intro` | text | required | index | One or two sentences under it |
| `pricing.heading` | text (`<h2>`) | optional | index | Pricing section heading |
| `pricing.intro` | text | optional | index | One or two sentences under it |
| `testimonials.heading` | text (`<h2>`) | required | index | Testimonials section heading |
| `testimonials.intro` | text | optional | index | One sentence under it |
| `about.heading` | text (`<h2>`) | required | index | About section heading |
| `about.body` | text | required | index | Three or four sentences about the business |
| `about.image` | `<img src>` | optional | index | Supporting photograph |
| `about.image_alt` | `<img alt>` | optional | index | Alt text for that photograph |
| `faq.heading` | text (`<h2>`) | required | index | FAQ section heading |
| `faq.intro` | text | optional | index | One sentence under it |
| `contact.heading` | text (`<h2>`) | required | index | Contact section heading |
| `contact.intro` | text | optional | index | One sentence under it |
| `contact.address` | text | required | index | Workshop address, or the service area |
| `contact.phone` | text | required | all | Phone number as it should be read |
| `contact.phone_href` | `<a href>` | required | all | The same number as a `tel:` URI |
| `contact.email` | text | required | index | Public email address |
| `contact.email_href` | `<a href>` | required | index | The same address as a `mailto:` URI |
| `contact.hours` | text | required | index | Opening hours |
| `footer.blurb` | text | required | all | Closing line above the copyright |
| `footer.copyright` | text | required | all | Copyright line |
| `rs.review_banner.heading` | text | reserved | privacy, terms | Heading of the visible legal review banner |
| `rs.review_banner.body` | text | reserved | privacy, terms | Body of that banner |
| `behaviour.mobile_nav` | `<meta content>` | optional | all | `on` to close the rail's small screen menu on Escape, outside click and link follow |
| `behaviour.faq_accordion` | `<meta content>` | optional | index | `on` to make opening one FAQ answer close the others |

`contact.phone` and `contact.phone_href` are the only content slots forge marks
outside `index.html`. The rail is standing chrome, so it has room to keep the
number in view, and it does that on all four pages: twice per page, once in the
small screen menu and once at the foot of the rail. Same name, same value, as
the multiplicity rule requires. `nav.cta` is marked three times on `index.html`,
because the pricing band ends with the same call to action the rail carries and
it is the same label, not a second one.

## Repeating groups

| Group | Count shipped | What it repeats | Inner slots |
|---|---|---|---|
| `process.step` | 4 | One step of an ordered `<ol>`, numbered by the browser | `process.step.title`, `process.step.body` |
| `services.item` | 3 | One full width service row: heading, body, and a short line in the right hand column | `services.item.title`, `services.item.body`, `services.item.detail` |
| `pricing.tier` | 3 | One way of buying the work | `pricing.tier.name`, `pricing.tier.price`, `pricing.tier.body` |
| `testimonials.item` | 2 | One large quote with its attribution | `testimonials.item.quote`, `testimonials.item.name`, `testimonials.item.role` |
| `faq.item` | 4 | One `<details>`: question in `<summary>`, answer below | `faq.item.question`, `faq.item.answer` |
| `rs.review_banner` | 2 | The visible legal review banner, once on `privacy.html` and once on `terms.html` | `rs.review_banner.heading`, `rs.review_banner.body` |

`testimonials.item` ships the vocabulary's minimum of two rather than beacon's
three, deliberately. A brand new trade business has no quotes at all, and the
more convincing placeholder quotes a template ships the more tempting it is to
leave one in place.

## The behaviours this template ships

`behaviours.js` is part of the template, like `tailwind.css` is. It is written
once, reviewed once and shipped to every site built from forge, and a
`behaviour.*` slot decides whether a given site runs a given part of it. The AI
turns one on by filling the slot with `"on"`; it never writes script into a
client's repository, and `newUnsafeMarkup` in `core/src/lib/guards.ts` refuses
it if it tries (#166, and #124 for why).

| Slot | What turns on | What it attaches to |
|---|---|---|
| `behaviour.mobile_nav` | Closing the rail's small screen menu on Escape, an outside click, and following a link | `[data-rs-mobile-nav]` on the rail's `<details>` |
| `behaviour.faq_accordion` | Opening one FAQ answer closes the others | the `<details>` elements marked `data-rs-slot-group="faq.item"` |

Both enhance markup that already works: the menu and the FAQ are native
`<details>` and open with scripting off.

## Forge ships no theme toggle, deliberately

Beacon carries `behaviour.dark_mode`. Forge does not, and it is a decision
rather than an omission: **forge is already a dark template.** `canvas` is a
warm near-black and `ink` is the light text drawn on it. A dark mode toggle here
would be a *light* mode toggle, and the mechanism cannot say that. The generated
override block is keyed on `[data-rs-theme="dark"]` and reads its palette from
`brand_dark` in `rocket-site.json`, so shipping forge's alternate palette would
mean writing its LIGHT colours under a key called `brand_dark`, in the one file
an agency edits by hand. A misleading key in a hand-edited config is worse than
a missing feature.

So an operator who asks for a theme toggle on a forge site is told that this
template does not ship that behaviour, and that adding it is a change to the
template library. That is the honest answer and it is the one the refusal in
`core/src/lib/content-safety.ts` gives when a page carries no matching slot.
Giving forge a real light mode means naming the alternate palette for what it
is, in `rocket-site.schema.json`, `_lib/theme.mjs` and `SLOTS.md` together, and
that is its own change.

## The step numbers are not slots

`process.step` renders inside an `<ol>`, and the numbers in the gutter are the
browser's list markers styled with the `marker:` variant. Adding or reordering a
step renumbers the list for free. A number typed into the markup, or worse
carried in a slot, is a number that can disagree with the order the instances
are actually in, and nobody notices until a customer reads step 3 twice.

## The legal review banner

`privacy.html` and `terms.html` each carry a visible banner saying the document
has not been reviewed. It exists because the HTML comment at the top of those
files is invisible to the agency staffer previewing the site in a browser, and
that person is exactly who the placeholder rule is protecting.

Nothing in Rocket Sites takes it away (#268). The `legal` block of
`rocket-site.json` records what a person decided and is read by no code, so the
warning stays put until somebody removes it deliberately, which is the point: a
page that still says `[ENTITY]` should still say it has not been read.

**Removing it is one edit, and a person makes it:** delete the element carrying
`data-rs-slot-group="rs.review_banner"`. There is exactly one per legal page and
nothing else depends on it.

## Secondary pages carry no `site.*` slots

`privacy.html`, `terms.html` and `404.html` ship a plain `<title>` and
`<meta name="description">` of their own, and no canonical or Open Graph tags. A
slot name means one value everywhere, so marking `site.title` on those pages
would force them to share the home page's title. They also carry
`<meta name="robots" content="noindex">`: a review banner is not something to
put in a search index.

## No contact form

The contact section ships details plus `mailto:` and `tel:` links, and no
`<form>`. There is no server behind a Rocket Sites site to receive a submission,
and a form that posts nowhere drops a client's leads without anybody noticing.

`contact.form_action` is therefore not implemented here either, which makes it a
name in the shared vocabulary that no template in the repo exercises. That
observation was made here first and it turned out to be the smaller half of the
problem: as of 2026-08-15 there is also no value an agency could put in it that
works. An `action` on another host is refused by RS005 and by the extension's
content-safety guard, which decide on the `//` and so cannot tell a form service
from a hostile host; a `mailto:` action passes both guards and does not submit,
because Chrome blocks the navigation. So the sentence that used to follow here,
inviting an agency with its own endpoint to add a `<form>` and point it at the
slot, has been removed rather than softened. `../SLOTS.md` section 7 has the
measurement; #231 is where the destination gets decided.

## Not slotted

- **The body text of `privacy.html` and `terms.html`.** Deliberately, not by
  oversight. Only the shared chrome on those pages is slotted. Slotting the
  legal prose would invite a generator to rewrite it, and a rewritten policy is
  a policy nobody reviewed. The whole point of the placeholders is that a human
  has to touch this text.
- **`[ENTITY]`, `[JURISDICTION]`, `[CONTACT]` and `[DATE]`.** Not slots. They
  live under `legal` in `rocket-site.json`, outside the `slots` map, and every
  one of them is `null` in the shipped seed. That block is a record of what a
  person decided and is read by no code (#268), so filling one of those fields
  in leaves the page exactly as it was: the placeholders come out when a person
  edits this file. `[DATE]` in particular: a "last updated" date a generator
  invents is a false claim about when the document was reviewed.
- **`business.logo` and `business.logo_alt`.** Forge does not implement the
  optional logo pair, and beacon does not either. The mark in the rail and in
  the footer sits immediately beside the business name as text, which makes it
  decorative: it carries `alt=""` and `aria-hidden="true"`, and a slotted `alt`
  there would have a screen reader announce the name twice. The pair is usable
  by a template that shows a logo with no adjacent wordmark. This one does not,
  and guessing at alt text to satisfy the vocabulary would be the wrong trade.
- **The step numbers, the nav labels and the section ids.** The numbers come
  from the `<ol>`. The labels and ids are the page's skeleton and the anchors
  the links point at; `template.json.sections` records the ids instead.
- **Decorative artwork.** The rail mark, the favicon, the accent rules and the
  FAQ chevrons are file or inline SVG marked `aria-hidden="true"`. They belong
  to the template's design, not to the client's content, and asking a model to
  write path data produces a broken glyph.
- **The `<dt>` labels in the contact list** (Workshop, Phone, Email, Open). They
  name the slot next to them; translating them is a template edit, not a content
  edit.
- **Layout and Tailwind classes.** Edited directly, as literal classes. That is
  what keeps the source matching the rendered DOM.
