// Build-time script to generate rss.xml from local blog content files
// Note: sitemap.xml & rss.xml are also generated dynamically via app routes.
// This script is kept as a build-time step to pre-generate the static fallback file.
// Run: node scripts/generate-feeds.js

const { writeFileSync, readdirSync, readFileSync } = require('fs')
const { join } = require('path')
const matter = require('gray-matter')

const rootDir = join(__dirname, '..')
const postsDir = join(rootDir, 'content', 'blog')

const SITE_URL = 'https://imrizwan.com'
const SITE_NAME = 'ImRizwan'

function escapeXml(str) {
  return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function main() {
  const files = readdirSync(postsDir).filter(f => f.endsWith('.md'))
  const posts = files.map(f => {
    const raw = readFileSync(join(postsDir, f), 'utf-8')
    const { data } = matter(raw)
    return {
      slug: f.replace(/\.md$/, ''),
      title: escapeXml(data.title),
      excerpt: escapeXml(data.excerpt),
      date: data.date,
      category: data.category || '',
    }
  })

  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  console.log(`✅ Read ${posts.length} posts from content/blog/`)

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

try {
  main()
} catch (err) {
  console.error('Fatal error in generate-feeds.js:', err)
  process.exit(0)
}
