const SupabaseREST = require('./supabase_rest.cjs');

async function fix() {
  try {
    const db = new SupabaseREST();
    await db.update('blog_posts', { date: '2026-03-25', display_date: 'March 25, 2026' }, 'slug', 'sharepoint-provisioning-automation-guide-2026');
  } catch (err) {
    console.error('Fatal Error:', err.message);
  }
}
fix();
