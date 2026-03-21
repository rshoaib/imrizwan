const SupabaseREST = require('./supabase_rest.cjs');

async function main() {
  const db = new SupabaseREST();
  const posts = await db.select('blog_posts', 'slug,title,date');

  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10); // 2026-03-20

  // Mon–Sun week
  const day = now.getDay(); // 0=Sun
  const diffToMon = (day === 0) ? -6 : 1 - day;
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() + diffToMon);
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  const today = posts.filter(p => p.date && p.date.startsWith(todayStr));
  const week = posts.filter(p => {
    if (!p.date) return false;
    const d = new Date(p.date);
    return d >= weekStart && d <= weekEnd;
  });

  const lastPost = posts.sort((a, b) => new Date(b.date) - new Date(a.date))[0];

  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log('║  📊 Content Dashboard — imrizwan.com               ║');
  console.log('╠══════════════════════════════════════════════════════╣');
  console.log(`║  📦 Total Articles (DB)   │ ${String(posts.length).padEnd(26)}║`);
  console.log(`║  📅 Last Published        │ ${String(lastPost ? lastPost.date + ' — ' + lastPost.title.slice(0,14) + '...' : 'N/A').slice(0,26).padEnd(26)}║`);
  console.log('╠──────────────────────────┼──────────────────────────╣');
  console.log(`║  ✍️  Published Today       │ ${String(today.length + ' of 1').padEnd(26)}║`);
  console.log(`║  📆 Published This Week   │ ${String(week.length + ' of 3').padEnd(26)}║`);
  console.log('╠──────────────────────────┼──────────────────────────╣');
  console.log(`║  🟢 Today Slots Left      │ ${String(Math.max(0, 1 - today.length)).padEnd(26)}║`);
  console.log(`║  🟢 Week Slots Left       │ ${String(Math.max(0, 3 - week.length)).padEnd(26)}║`);
  console.log('╠══════════════════════════════════════════════════════╣');
  if (week.length > 0) {
    console.log('║  This week\'s articles:                              ║');
    week.forEach(p => {
      const line = `  • ${p.date} — ${p.title}`.slice(0, 52).padEnd(52);
      console.log(`║${line}║`);
    });
  } else {
    console.log('║  No articles published this week yet.               ║');
  }
  console.log('╚══════════════════════════════════════════════════════╝\n');

  if (today.length >= 1) {
    console.log('⚠️  CAUTION — Already published today. Proceed if slot is available this week.');
  } else if (week.length >= 3) {
    console.log('🛑 STOP — Weekly limit reached (3/3). Switch to another site.');
  } else {
    console.log('✅ GO — Slots available. Ready to publish!');
  }
}

main().catch(e => console.error(e.message));
