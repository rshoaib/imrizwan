# imrizwan.com — daily content routine

> Versioned spec for the scheduled remote agent that runs on this site.

## Mission

Land **one** meaningful change per run that helps imrizwan.com. The dominant problem for new sites is **indexation**, so prioritize work that helps existing pages get indexed before adding new ones.

## Pre-flight

1. Read `.agents/context/site-context.md` for brand voice + internal link map.
2. Read `.agents/context/target-keywords.md` for the keyword backlog.
3. Today's date in YYYY-MM-DD. Posts dir: `content/blog/`. Branch: `main`.

**Frontmatter shape (existing posts):** `title`, `slug`, `excerpt`, `date`, `displayDate`, `readTime`, `category`, `image`, `tags` (YAML array). Hero images live at `public/images/blog/`. Body is Markdown.

## Priority lanes — pick the FIRST lane with work to do

### Lane A — Refresh stuck content (highest priority)

For every `content/blog/*.md*`, determine state. Use heuristics: a post is "likely stale" if its `updated_at` (or `date`) frontmatter is ≥21 days old AND it hasn't been edited in `git log --since="21 days ago" -- content/blog/<slug>.md`.

If any post qualifies:
- Pick the oldest candidate.
- Expand by 30–50%: add original examples, an embedded comparison table, ≥3 tier-1 citations, and 2 new H2 sections that match specific long-tail queries (use `WebSearch` to find queries the URL might rank for).
- Bump `updated_at: "YYYY-MM-DD"` to today (or whatever the site's freshness field is).
- **Do NOT change `slug`, `title`, `date`, or any "first publish" field.**
- Stop after one post.

### Lane B — Internal-link strengthening (medium priority)

Only run if Lane A has nothing to do.

- Identify the most-recently-updated 3 posts on the site (proxy for "Google likes these"). Find 1–2 currently-underexposed posts (not linked from the top posts or the homepage).
- Add inline contextual links from the indexed pages into the underexposed ones. Anchor text from `.agents/context/target-keywords.md`. Never "click here".
- Stop after one file edit.

### Lane C — New post (lowest priority)

Only run if Lanes A and B have nothing to do AND no new post has been published in the last 3 days (`git log --since="3 days ago" --name-only -- content/blog/`).

- Pick the next unticked topic in `.agents/context/target-keywords.md`. Skip topics that already have a corresponding `.md` file.
- **Before writing,** inspect 2-3 existing posts in `content/blog/` to learn the exact frontmatter shape, body format (markdown vs HTML), and hero-image convention. Match it precisely.
- Write the post directly. Add any required hero image at the location the existing posts use.

## Hard constraints (all lanes)

- **Never more than 1 lane per run.**
- **Never more than 1 post created per run.** Indexation pressure is dominant.
- **Never delete or remove existing content.** Refreshes are additive only.
- **Never fabricate statistics, study names, or citations.**
- **Never skip pre-commit hooks** (`--no-verify`) or `--no-gpg-sign`.
- **Never force-push.**

## After the change

1. Run `npm run lint` (or `npx tsc --noEmit` if no lint script). Fix any errors before committing.
2. Stage only the files you edited (no `git add -A`).
3. Commit with conventional format the repo already uses (inspect `git log --oneline -10` for the pattern). Common: `blog:`, `refresh:`, `seo:`, `feat:`.
4. Push to `origin/main`. If push fails on auth, exit cleanly and report — do not retry with embedded credentials.
5. Output one paragraph: lane that ran, files changed, commit SHA, one-sentence justification.

## When to skip

If all three lanes are clear, write one line: "No work today — Lane A clear, Lane B saturated, Lane C in cooldown or backlog exhausted." Do not manufacture work.
