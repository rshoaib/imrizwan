const SupabaseREST = require('./supabase_rest.cjs');
const fs = require('fs');

async function main() {
  try {
    const db = new SupabaseREST();
    
    // Using the same object as in the codebase
    const content = fs.readFileSync('scripts/post.md', 'utf8');

    const newArticle = {
      slug: 'power-automate-html-table-styling-css',
      title: 'Power Automate: How to Style HTML Tables with CSS',
      excerpt: 'Stop sending ugly emails! Learn to apply custom CSS to the Power Automate Create HTML Table action and use our free generator to style data instantly.',
      image: '/images/blog/power-automate-html-table-styling-css.png',
      content: content,
      date: '2026-03-13',
      display_date: 'March 13, 2026',
      read_time: '5 min read',
      category: 'Power Platform',
      tags: ['power-automate', 'css', 'html-table', 'workflow', 'styling']
    };

    // Safely inserts while avoiding Postgres auto-increment bugs and ES Module crashes
    await db.safeInsert('blog_posts', newArticle, 'slug');

  } catch (err) {
    console.error('Fatal Error:', err.message);
  }
}

main();
