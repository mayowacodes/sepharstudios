# SEO Setup

> What's wired today, how to extend it per-page, and the verification steps before launching marketing pushes.

## What's in place

### Site-wide meta

[`apps/web/src/lib/constants/index.ts`](../apps/web/src/lib/constants/index.ts) — `SiteMeta` is the single source of truth:

```ts
{
  name: 'Sephar Studios',
  title: 'Sephar Studios — Faith-based streaming for families',
  titleTemplate: '%s · Sephar Studios',
  description: '…',
  keywords: ['faith based streaming', …],
  ogimage: '/screenshot-wide.webp',
  twitterHandle: '@sepharstudios',
  link: 'https://sepharstudios.com',
  organization: { name, legalName, logo, sameAs[] }
}
```

[`apps/web/src/routes/+layout.svelte`](../apps/web/src/routes/+layout.svelte) consumes these and emits a baseline set of tags on every route:

- `<title>` (from `SiteMeta.title`)
- `<meta name="title" / description / keywords>`
- `<link rel="canonical">` — computed from `page.url.pathname`, trailing slash stripped, query stripped
- Open Graph: `og:type`, `og:site_name`, `og:url`, `og:title`, `og:description`, `og:image`
- Twitter: `twitter:card=summary_large_image`, `site`, `url`, `title`, `description`, `image`

### Site-wide structured data

[`apps/web/src/app.html`](../apps/web/src/app.html) emits a `@graph` with two nodes:

- `Organization` — name, URL, logo
- `WebSite` — `potentialAction` for the sitelinks search box (`/search?q={search_term_string}`)

These render once per page from the static HTML shell.

### sitemap.xml

[`apps/web/src/routes/sitemap.xml/+server.ts`](../apps/web/src/routes/sitemap.xml/+server.ts) generates an XML sitemap at `https://sepharstudios.com/sitemap.xml`:

- 13 static marketing/info routes (`/`, `/browse`, `/movies`, `/shows`, `/documentaries`, `/kids`, `/plans`, `/about`, `/help`, `/terms`, `/privacy`, `/guidelines`, `/device-support`)
- Every `mediaLibrary` row where `isActive=true` → emits both `/watch/<id>` and `/watch/<slug>`
- Every verified creator → `/creators/<id>`

Response is cached `s-maxage=3600` (1h CDN cache).

### robots.txt

[`apps/web/static/robots.txt`](../apps/web/static/robots.txt) — explicit `Allow: /` plus `Disallow:` for: `/auth/`, `/settings`, `/profiles`, `/dashboard`, `/checkout`, `/apply/`, `/admin/`, `/creator/`, `/api/`, `/sw.js`, `/offline`. Ends with the sitemap reference.

### Per-page metadata pattern

Pages override the layout defaults via `<svelte:head>`. Example from [`/watch/[id]`](../apps/web/src/routes/watch/[id]/+page.svelte):

```svelte
<svelte:head>
  <title>{content.title} — Sephar Studios</title>
  <meta name="description" content={content.description ?? ''} />
  <meta property="og:type" content="video.other" />
  <meta property="og:title" content={`${content.title} — Sephar Studios`} />
  <meta property="og:image" content={content.posterUrl || …} />
  {@html `<script type="application/ld+json">${JSON.stringify(videoSchema)}</script>`}
</svelte:head>
```

The watch page also emits `VideoObject` structured data for Google Video search + rich-result carousels.

---

## Adding SEO to a new page

For most pages, just the title + description override is enough:

```svelte
<svelte:head>
  <title>Plans · Sephar Studios</title>
  <meta name="description" content="Pick a plan: freemium with ads, basic ad-free, premium family." />
</svelte:head>
```

The layout-level `<link rel="canonical">` and Twitter card tags carry through. Only override `og:*` if you have a more specific image to share.

### When to add structured data

Use [Google's structured data search gallery](https://developers.google.com/search/docs/appearance/structured-data/search-gallery) to pick the right type:

| Page type | Schema |
|---|---|
| `/watch/[id]` | `VideoObject` ✓ (already done) |
| `/creators/[id]` | `Person` or `Organization` (creator-type dependent) |
| `/plans` | `Product` with multiple `Offer` children |
| Blog/articles | `Article` or `BlogPosting` |
| FAQ pages (`/help`) | `FAQPage` with `Question` children |
| Series episode | `TVEpisode` with `partOfSeries` |

Use a JSON-LD payload, not microdata or RDFa.

---

## Verification

### Before deploy

1. **Build the site:** `bun run build` — sitemap generation must compile cleanly.
2. **Lint structured data:** paste a rendered `<script type="application/ld+json">` block into [Schema.org Validator](https://validator.schema.org/) — every emitted schema should pass.

### After deploy

1. **Submit sitemap to Google Search Console:** add `https://sepharstudios.com/sitemap.xml`. GSC will show coverage + indexing errors.
2. **Submit to Bing Webmaster Tools** (smaller share but cheap to do).
3. **Verify rich results:** run `https://sepharstudios.com/watch/<some-id>` through Google's [Rich Results Test](https://search.google.com/test/rich-results). Should report a valid `VideoObject` with no errors.
4. **Verify OG previews:** paste any URL into Facebook's [Sharing Debugger](https://developers.facebook.com/tools/debug/) and X's Card Validator (account required). Both should show the right title, description, and image.
5. **Mobile-friendly check:** Google's Lighthouse audit. Aim for SEO score ≥ 95.

---

## Outstanding / future improvements

- **Per-page `og:image` for marketing pages** — `/about`, `/plans`, etc. share the generic site screenshot today. Generate dedicated 1200×630 images for each.
- **`hreflang` tags** — only needed if you launch language variants. Not in scope today (single-language site).
- **Breadcrumb structured data** on category routes (`/movies`, `/shows`).
- **Article structured data** on the help center and any future blog.
- **Image alt-text audit** — verify every `<img alt>` in cards/heroes is meaningful (not just the file name).
- **`X-Robots-Tag: noindex`** header on `/api/*` (defense in depth — robots.txt is advisory, Disallow doesn't prevent indexing if linked externally).
- **Server-side rendering audit** — confirm all marketing pages render meaningful HTML server-side (no client-only `{#if mounted}` gating critical SEO content).

---

## Marketing-side checklist (not code)

- [ ] Verify the site in [Google Search Console](https://search.google.com/search-console).
- [ ] Verify the site in [Bing Webmaster Tools](https://www.bing.com/webmasters).
- [ ] Submit `sitemap.xml` URL to both.
- [ ] Set up Google Analytics 4 (or rely on Openpanel, already wired).
- [ ] Update `SiteMeta.organization.sameAs` with real social URLs when accounts are live.
- [ ] Generate per-page OG images (Figma + a static `/og/*.webp` directory).
- [ ] Confirm the `twitterHandle` matches the actual X account.
