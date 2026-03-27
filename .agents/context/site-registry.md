---
site: imrizwan.com
git_branch: main
supabase_ref: jnopupouynhqeqnhxecp
content_format: html
---

# imrizwan Site Registry

## Blog Schema (`blog_posts` table)

| Column | Type | Required | Notes |
|--------|------|----------|-------|
| `id` | uuid | auto | Primary key |
| `slug` | text | ✅ | URL slug (kebab-case) |
| `title` | text | ✅ | Article title |
| `excerpt` | text | ✅ | Short description |
| `content` | text | ✅ | **HTML** (rendered via dangerouslySetInnerHTML) |
| `date` | text | ✅ | ISO date: `2026-03-27` |
| `display_date` | text | ✅ | Human-readable: `March 27, 2026` |
| `read_time` | text | ✅ | e.g. `12 min read` |
| `category` | text | ✅ | e.g. `Microsoft 365`, `Power Platform` |
| `image` | text | ✅ | Path: `/images/blog/{name}.png` |
| `tags` | text[] | optional | PostgreSQL text array |
| `created_at` | timestamptz | auto | |
| `updated_at` | timestamptz | auto | |

## Image Hosting

- **Strategy**: Local file in `public/images/blog/`
- **Column**: `image`
- **Path format**: `/images/blog/{slug}-hero.png`
- **Component**: `next/image` in `BlogPostClient.tsx`
- **⚠️ CRITICAL**: Image file MUST be `git add`-ed and pushed to `main`

## Content Format

- **Type**: HTML (Tailwind prose classes inline in the HTML string)
- **Renderer**: `dangerouslySetInnerHTML` in `BlogPostClient.tsx`
- **Tables**: Include inline Tailwind classes in the HTML (`class="w-full border-collapse..."`)
- **⚠️ IMPORTANT**: `display_date` and `read_time` are SEPARATE from `date` — all three must be set

## Deployment

- **Git branch**: `main`
- **Host**: Vercel
- **Revalidation**: ISR with `revalidate = 3600`
- **Push command**: `git push origin main`

## Post-Insert Checklist

1. ☐ Image file exists in `public/images/blog/`
2. ☐ Image file is git-tracked (`git status` shows no `??`)
3. ☐ `image` column matches the file path exactly
4. ☐ `display_date` is set (e.g. `March 27, 2026`)
5. ☐ `read_time` is set (e.g. `12 min read`)
6. ☐ Push to `main` (NOT `master`)
7. ☐ Wait 90s, verify image URL returns 200
