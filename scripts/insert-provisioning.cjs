const SupabaseREST = require('./supabase_rest.cjs');
const fs = require('fs');

async function main() {
  try {
    const db = new SupabaseREST();
    
    const content = fs.readFileSync('scripts/provisioning.md', 'utf8');

    const newArticle = {
      slug: 'sharepoint-provisioning-automation-guide-2026',
      title: 'Modern SharePoint Provisioning & Automation in 2026: A Developer\'s Guide',
      excerpt: 'Learn how to automate SharePoint site provisioning using PnP PowerShell, JSON Site Scripts, and the REST API. Avoid legacy subsites and prepare your tenant architecture for Microsoft Copilot.',
      image: '/images/blog/sharepoint-provisioning-automation-guide-2026.png',
      content: content,
      date: '2026-03-25',
      display_date: 'March 25, 2026',
      read_time: '6 min read',
      category: 'SharePoint',
      tags: ['sharepoint', 'provisioning', 'automation', 'pnp', 'site-scripts', '2026']
    };

    await db.safeInsert('blog_posts', newArticle, 'slug');
    console.log('Finished safeInsert attempt for ' + newArticle.slug);

  } catch (err) {
    console.error('Fatal Error:', err.message);
  }
}

main();
