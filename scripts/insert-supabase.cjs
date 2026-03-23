const SupabaseREST = require('./supabase_rest.cjs');
const fs = require('fs');

async function main() {
  try {
    const db = new SupabaseREST();
    
    const content = fs.readFileSync('scripts/post.md', 'utf8');

    const newArticle = {
      slug: 'migrate-yeoman-to-new-spfx-cli',
      title: 'The Yeoman Era is Over: Migrating to the New SPFx CLI in 2026',
      excerpt: 'Learn why Microsoft deprecated Yeoman and how to migrate your legacy SharePoint Framework (SPFx) projects to the new Vite-based SPFx CLI pipeline for 4x faster builds in less than 15 minutes.',
      image: '/images/blog/spfx-cli-migration-hero.png',
      content: content,
      date: '2026-03-23',
      display_date: 'March 23, 2026',
      read_time: '7 min read',
      category: 'Microsoft 365',
      tags: ['spfx', 'sharepoint', 'cli', 'yeoman', 'migration', 'react', '2026']
    };

    await db.safeInsert('blog_posts', newArticle, 'slug');

  } catch (err) {
    console.error('Fatal Error:', err.message);
  }
}

main();
