const SupabaseREST = require('./supabase_rest.cjs');

const article = {
  slug: 'microsoft-graph-api-oauth2-guide',
  title: 'Demystifying the Microsoft Graph API: A Complete Guide to OAuth 2.0 and App Permissions',
  excerpt: 'Understanding exactly how to authenticate your custom applications against the Microsoft Graph API is the hardest part of M365 development. Here is a massive breakdown of OAuth 2.0 flows, Delegated vs. Application permissions, and how to acquire your first access token securely.',
  category: 'Microsoft 365',
  date: '2026-03-30',
  display_date: 'March 30, 2026',
  read_time: '12 min read',
  image: '/images/blog/graph-api-hero.png',
  tags: [
    "graph-api",
    "oauth2",
    "azure-ad",
    "m365",
    "authentication"
  ],
  content: require('fs').readFileSync('./scripts/article-payload.md', 'utf8')
};

async function main() {
  const db = new SupabaseREST();
  // using dynamic insert logic here to check existing slug or insert
  const existing = await db.select('blog_posts', 'id,slug');
  if (existing.some(r => r.slug === article.slug)) {
       await db.update('blog_posts', article, 'slug', article.slug);
       console.log('✅ Successfully padded imrizwan endpoint with article update!');
  } else {
       const maxId = existing.length > 0 ? Math.max(...existing.map(r => r.id)) : 0;
       const nextId = maxId + 1;
       const finalPayload = { id: nextId, ...article };
       
       const res = await fetch(`${db.restUrl}/blog_posts`, {
         method: 'POST',
         headers: db.headers,
         body: JSON.stringify(finalPayload)
       });
       if (!res.ok) throw new Error(`Insert Failed: ${res.status} ${await res.text()}`);
       console.log('✅ Successfully padded imrizwan endpoint with article insertion!');
  }
}

main().catch(err => {
  console.error('❌ Insert failed:', err.message);
  process.exit(1);
});
