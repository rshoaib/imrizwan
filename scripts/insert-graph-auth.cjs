const SupabaseREST = require('./supabase_rest.cjs');
const fs = require('fs');

async function main() {
  try {
    const db = new SupabaseREST();
    
    // Read the content we just generated
    const content = fs.readFileSync('scripts/post.md', 'utf8');

    const newArticle = {
      slug: 'microsoft-graph-api-authentication-guide',
      title: 'Microsoft Graph API Authentication: The Complete Guide for SharePoint Developers (2026)',
      excerpt: 'Learn all 4 methods to authenticate Microsoft Graph API calls in 2026: SPFx AadHttpClient, MSAL.js for React, Client Credentials for Node.js, and Managed Identity for Azure Functions.',
      image: '/images/blog/graph-api-auth-hero.png',
      content: content,
      date: '2026-03-29',
      display_date: 'March 29, 2026',
      read_time: '9 min read',
      category: 'Microsoft 365', // Valid categories: 'SPFx' | 'Power Platform' | 'SharePoint' | 'Microsoft 365'
      tags: ['graph api', 'authentication', 'spfx', 'msal', 'azure ad', 'sharepoint', '2026']
    };

    console.log('Inserting article:', newArticle.slug);
    await db.safeInsert('blog_posts', newArticle, 'slug');
    console.log('✅ Success!');

  } catch (err) {
    console.error('Fatal Error:', err.message);
  }
}

main();
