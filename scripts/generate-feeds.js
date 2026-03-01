// Build-time script to generate rss.xml and sitemap.xml from blog data
// Run: node scripts/generate-feeds.js

import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = join(__dirname, '..')

// Parse blog posts from the blog.ts source file
const blogSrc = readFileSync(join(rootDir, 'src/data/blog.ts'), 'utf-8')

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
const SITE_NAME = 'iamrizwan'
const now = new Date().toISOString()

// --- RSS Feed ---
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
console.log(`✅ Generated rss.xml with ${posts.length} posts`)

// --- Sitemap ---
const staticPages = [
  { loc: '/', priority: '1.0', changefreq: 'weekly' },
  { loc: '/blog', priority: '0.9', changefreq: 'weekly' },
  { loc: '/tools', priority: '0.9', changefreq: 'weekly' },
  { loc: '/tools/json-column-formatter', priority: '0.8', changefreq: 'monthly' },
  { loc: '/tools/guid-generator', priority: '0.8', changefreq: 'monthly' },
  { loc: '/projects', priority: '0.8', changefreq: 'monthly' },
  { loc: '/about', priority: '0.7', changefreq: 'monthly' },
  { loc: '/contact', priority: '0.6', changefreq: 'monthly' },
]

const sitemapUrls = [
  ...staticPages.map(
    (p) => `  <url>
    <loc>${SITE_URL}${p.loc}</loc>
    <lastmod>${now.split('T')[0]}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  ),
  ...posts.map(
    (p) => `  <url>
    <loc>${SITE_URL}/blog/${p.slug}</loc>
    <lastmod>${p.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
  ),
].join('\n')

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls}
</urlset>
`

writeFileSync(join(rootDir, 'public/sitemap.xml'), sitemap)
console.log(`✅ Generated sitemap.xml with ${staticPages.length + posts.length} URLs`)
