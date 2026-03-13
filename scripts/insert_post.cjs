const SupabaseREST = require('./supabase_rest.cjs');

const ARTICLE_CONTENT = `
# Title Here
Write your markdown content here.
`;

async function main() {
  try {
    const db = new SupabaseREST();
    
    // CHANGE THIS TO MATCH YOUR NEW ARTICLE
    const newArticle = {
        slug: 'my-new-post-slug',
        title: 'New Article Title',
        excerpt: "A short excerpt for the meta description.",
        // category: 'Tutorials', // Uncomment if your schema uses categories
        date: new Date().toISOString(),
        // display_date: 'March 12, 2026', // Uncomment if your schema uses display_date
        // read_time: '4 min read', // Uncomment if your schema uses read_time
        // image: '/guide-images/hero.png', // Uncomment if your schema uses images
        content: ARTICLE_CONTENT.trim()
    };

    console.log('Inserting into blog_posts...');
    await db.safeInsertWithId('blog_posts', newArticle, 'slug');

  } catch (err) {
    console.error('Fatal Error:', err.message);
  }
}

main();
