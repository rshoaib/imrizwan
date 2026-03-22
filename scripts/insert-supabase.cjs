const SupabaseREST = require('./supabase_rest.cjs');
const fs = require('fs');

async function main() {
  try {
    const db = new SupabaseREST();
    
    const content = fs.readFileSync('scripts/post.md', 'utf8');

    const newArticle = {
      slug: 'enterprise-governance-sharepoint-ai-developer-checklist',
      title: 'Enterprise Governance for SharePoint-Powered AI: A Developer\'s Checklist (2026)',
      excerpt: 'Copilot doesn\'t fix bad governance — it amplifies it. Here\'s the hands-on developer checklist with PowerShell scripts, SAM configuration, and sensitivity label implementation to make your SharePoint tenant AI-ready.',
      image: '/images/blog/enterprise-governance-ai-sharepoint.png',
      content: content,
      date: '2026-03-22',
      display_date: 'March 22, 2026',
      read_time: '12 min read',
      category: 'Microsoft 365',
      tags: ['copilot', 'governance', 'sharepoint', 'ai', 'powershell', '2026']
    };

    await db.safeInsert('blog_posts', newArticle, 'slug');

  } catch (err) {
    console.error('Fatal Error:', err.message);
  }
}

main();
