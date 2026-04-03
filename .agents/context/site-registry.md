---
site: imrizwan.com
git_branch: main
content_format: markdown
---

# imrizwan Site Registry

## Blog Content (`content/blog/*.md`)

Blog posts are stored as local markdown files with YAML frontmatter.

### Frontmatter Schema

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | string | ✅ | Article title |
| `slug` | string | ✅ | URL slug (kebab-case), must match filename |
| `excerpt` | string | ✅ | Short description |
| `date` | string | ✅ | ISO date: `2026-03-27` |
| `displayDate` | string | ✅ | Human-readable: `March 27, 2026` |
| `readTime` | string | ✅ | e.g. `12 min read` |
| `category` | string | ✅ | e.g. `Microsoft 365`, `Power Platform`, `SPFx`, `SharePoint` |
| `image` | string | optional | Path: `/images/blog/{name}.png` |
| `tags` | string[] | optional | YAML array |

### File Format

```markdown
---
title: "Article Title"
slug: article-slug
excerpt: "Short description"
date: "2026-03-27"
displayDate: "March 27, 2026"
readTime: "12 min read"
category: "Microsoft 365"
image: "/images/blog/article-hero.png"
tags:
  - "tag1"
  - "tag2"
---

Markdown content here...
```

## Image Hosting

- **Strategy**: Local file in `public/images/blog/`
- **Path format**: `/images/blog/{slug}-hero.png`
- **Component**: `next/image` in `BlogPostClient.tsx`

## Content Format

- **Type**: Markdown with YAML frontmatter
- **Parser**: `gray-matter` for frontmatter, custom `renderMarkdown()` for HTML
- **Renderer**: `dangerouslySetInnerHTML` in `BlogPostClient.tsx`

## Deployment

- **Git branch**: `main`
- **Host**: Vercel
- **Generation**: Fully static at build time
- **Push command**: `git push origin main`

## New Post Checklist

1. ☐ Create `content/blog/{slug}.md` with frontmatter + content
2. ☐ Image file exists in `public/images/blog/`
3. ☐ `image` field matches the file path exactly
4. ☐ `displayDate` is set (e.g. `March 27, 2026`)
5. ☐ `readTime` is set (e.g. `12 min read`)
6. ☐ Push to `main`
