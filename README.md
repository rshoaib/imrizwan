# ImRizwan — Developer Blog & Tools

Personal site for [imrizwan.com](https://imrizwan.com) — a developer blog covering SPFx, Power Platform, SharePoint, and Microsoft 365, plus a set of free browser-based developer tools.

Built with **Next.js 16** (App Router), **React 19**, and **TypeScript**. Blog content lives in `content/blog/` as markdown files with frontmatter.

## Development

```bash
npm install
npm run dev      # start dev server on http://localhost:3000
npm run build    # generates rss.xml, then production build
npm start        # serve the production build
```

## Project structure

```
app/             Next.js App Router — pages, layouts, API routes, sitemap, rss
components/      Reusable React components (Header, Footer, BlogFeed, etc.)
content/blog/    Blog posts as markdown (frontmatter: title, date, excerpt, category, tags, image)
data/            Static data used by tools (errors, graph endpoints, quiz, tool registry)
lib/             Server utilities (blog service, markdown renderer, FAQ schema extractor)
public/          Static assets — images, og-image, rss.xml, sitemap.xml, robots.txt, llms.txt
scripts/         Build-time scripts — generate-feeds.js (RSS), validate-seo.js
types/           Global TS declarations (gtag, adsbygoogle, dataLayer on Window)
```

## Adding a blog post

Create a new markdown file in `content/blog/<slug>.md` with frontmatter:

```yaml
---
title: Your post title
excerpt: One-sentence summary used in meta description and cards.
date: 2026-01-15
displayDate: January 15, 2026
readTime: 8 min read
category: SPFx          # SPFx | Power Platform | SharePoint | Microsoft 365
image: /images/blog/your-hero.png
tags: [spfx, typescript]
---

## Your content in markdown...
```

The sitemap, RSS feed, related posts, and blog listing pick it up automatically.

## Environment variables

None are required for the blog to work — content is local. Optional:

- `NEXT_PUBLIC_EMAILJS_SERVICE_ID`, `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`, `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` — wire the contact form to EmailJS. Without these, the contact form falls back to `mailto:`.

## Deployment

Deployed on Vercel. `.github/workflows/ci.yml` runs SEO validation, type-checking, and a production build on every push to `main`.
