const SupabaseREST = require('./supabase_rest.cjs');
const fs = require('fs');

async function main() {
  try {
    const db = new SupabaseREST();
    
    const content = fs.readFileSync('scripts/post.md', 'utf8');

    const newArticle = {
      slug: 'spfx-cli-migrate-yeoman-heft-2026',
      title: 'SPFx CLI: Migrate from Yeoman & Gulp to the New Toolchain (2026)',
      excerpt: 'Microsoft is retiring the Yeoman generator and Gulp in favour of the new SPFx CLI and Heft build system. This step-by-step guide covers exactly how to migrate existing projects and scaffold new ones in SPFx v1.22+.',
      image: '/images/blog/spfx-cli-migration-2026.png',
      content: content,
      date: '2026-03-20',
      display_date: 'March 20, 2026',
      read_time: '9 min read',
      category: 'SPFx',
      tags: ['spfx', 'sharepoint-framework', 'heft', 'spfx-cli', 'migration', '2026']
    };

    await db.safeInsert('blog_posts', newArticle, 'slug');

  } catch (err) {
    console.error('Fatal Error:', err.message);
  }
}

main();
