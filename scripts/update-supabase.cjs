const SupabaseREST = require('./supabase_rest.cjs');
const fs = require('fs');

async function main() {
  try {
    const db = new SupabaseREST();
    const content = fs.readFileSync('scripts/post.md', 'utf8');

    const res = await fetch(
      `${db.restUrl}/blog_posts?slug=eq.enterprise-governance-sharepoint-ai-developer-checklist`,
      {
        method: 'PATCH',
        headers: db.headers,
        body: JSON.stringify({ content })
      }
    );

    if (res.ok) {
      console.log('✅ Article content updated in Supabase');
    } else {
      console.error('❌ Update failed:', await res.text());
    }
  } catch (err) {
    console.error('Fatal Error:', err.message);
  }
}

main();
