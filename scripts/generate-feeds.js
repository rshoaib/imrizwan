// Build-time script to generate rss.xml from Supabase blog data
// Note: sitemap.xml & rss.xml are also generated dynamically via app routes.
// This script is kept as a build-time step to pre-generate the static fallback file.
// Run: node scripts/generate-feeds.js

const { writeFileSync, existsSync, readFileSync } = require('fs')
const { join } = require('path')
const path = require('path')

const rootDir = join(__dirname, '..')

// Load env vars from .env.local
const envPath = path.resolve(rootDir, '.env.local')
let SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
let SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if ((!SUPABASE_URL || !SUPABASE_ANON_KEY) && existsSync(envPath)) {
  const envFile = readFileSync(envPath, 'utf-8')
  envFile.split('\n').forEach(line => {
    const [key, ...val] = line.split('=')
    if (!key) return
    const value = val.join('=').replace(/"/g, '').trim()
    if (key.trim() === 'NEXT_PUBLIC_SUPABASE_URL') SUPABASE_URL = value
    if (key.trim() === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') SUPABASE_ANON_KEY = value
  })
}

const SITE_URL = 'https://imrizwan.com'
const SITE_NAME = 'ImRizwan'

async function main() {
  let posts = []

  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/blog_posts?select=slug,title,excerpt,date,display_date,category&order=date.desc`,
        {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
        }
      )
      if (res.ok) {
        const data = await res.json()
        posts = (data || []).map(p => ({
          slug: p.slug,
          title: (p.title || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'),
          excerpt: (p.excerpt || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'),
          date: p.date,
          displayDate: p.display_date,
          category: p.category,
        }))
        console.log(`✅ Fetched ${posts.length} posts from Supabase`)
      } else {
        console.warn(`⚠️  Supabase returned ${res.status} — generating empty RSS feed`)
      }
    } catch (err) {
      console.warn('⚠️  Could not fetch from Supabase:', err.message)
    }
  } else {
    console.warn('⚠️  Supabase credentials not found — generating empty RSS feed')
  }

  const rssItems = posts
    .map(
      (p) => `    <item>
      <title>${p.title}</title>
      <link>${SITE_URL}/blog/${p.slug}</link>
      <description>${p.excerpt}</description>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <guid isPermaLink="true">${SITE_URL}/blog/${p.slug}</guid>
      <category>${p.category}</category>
    </item>`
    )
    .join('\n')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${SITE_URL}</link>
    <description>Developer blog by Rizwan — SPFx webparts, Power Platform solutions, SharePoint development tips.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
${rssItems}
  </channel>
</rss>
`

  writeFileSync(join(rootDir, 'public/rss.xml'), rss)
  console.log(`✅ Generated rss.xml with ${posts.length} posts`)
  console.log(`ℹ️  sitemap.xml is generated dynamically via app/sitemap.ts`)
  console.log(`ℹ️  rss.xml is also served dynamically via app/rss.xml/route.ts`)
}

main().catch(err => {
  console.error('Fatal error in generate-feeds.js:', err)
  // Exit 0 so it doesn't block the build — RSS is served dynamically anyway
  process.exit(0)
})
