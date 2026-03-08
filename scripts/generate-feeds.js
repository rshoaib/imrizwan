// Build-time script to generate rss.xml from blog data
// Note: sitemap.xml is now generated dynamically via app/sitemap.ts
// Note: rss.xml is now also served dynamically via app/rss.xml/route.ts
//       This script is kept as a build-time fallback for static hosting scenarios.
// Run: node scripts/generate-feeds.js

const { readFileSync, writeFileSync } = require('fs')
const { join } = require('path')

const rootDir = join(__dirname, '..')

// Parse blog posts from the blog.ts source file
const blogSrc = readFileSync(join(rootDir, 'data/blog.ts'), 'utf-8')

// Extract post metadata using regex (avoids TS compilation)
const posts = []
const postRegex = /{\s*id:\s*'([^']+)',\s*slug:\s*'([^']+)',\s*title:\s*'([^']+)'.*?excerpt:\s*'([^']+)'.*?date:\s*'([^']+)'.*?displayDate:\s*'([^']+)'.*?category:\s*'([^']+)'/gs

let match
while ((match = postRegex.exec(blogSrc)) !== null) {
  posts.push({
    id: match[1],
    slug: match[2],
    title: match[3].replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'),
    excerpt: match[4].replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'),
    date: match[5],
    displayDate: match[6],
    category: match[7],
  })
}

const SITE_URL = 'https://imrizwan.com'
const SITE_NAME = 'ImRizwan'

// --- RSS Feed (build-time fallback) ---
const rssItems = posts
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
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
console.log(`✅ Generated rss.xml with ${posts.length} posts (build-time fallback)`)
console.log(`ℹ️  sitemap.xml is now generated dynamically via app/sitemap.ts`)
console.log(`ℹ️  rss.xml is also served dynamically via app/rss.xml/route.ts`)
