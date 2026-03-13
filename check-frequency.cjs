const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const restUrl = `${supabaseUrl}/rest/v1`;
const headers = {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
};

async function check() {
    const resGet = await fetch(`${restUrl}/blog_posts?select=slug,date,title`, { headers });
    const posts = await resGet.json();
    
    // Sort by date descending
    posts.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    const todayStr = "2026-03-13"; // Hardcoded to today's date context
    // March 9 is Monday, March 15 is Sunday
    const weekStart = new Date("2026-03-09");
    const weekEnd = new Date("2026-03-15");
    
    let publishedToday = 0;
    let publishedThisWeek = [];
    
    posts.forEach(p => {
        const d = new Date(p.date);
        if (p.date === todayStr) {
            publishedToday++;
        }
        if (d >= weekStart && d <= weekEnd) {
            publishedThisWeek.push(p);
        }
    });

    console.log("╔══════════════════════════════════════════════════════╗");
    console.log("║  📊 Content Dashboard — imrizwan.com                 ║");
    console.log("╠══════════════════════════════════════════════════════╣");
    console.log(`║  📦 Total Articles       │ ${String(posts.length).padEnd(25)} ║`);
    console.log(`║  📅 Last Published       │ ${posts[0].date.padEnd(25)} ║`);
    console.log("╠──────────────────────────┼──────────────────────────╣");
    console.log(`║  ✍️ Published Today      │ ${publishedToday} of 1 ${publishedToday >= 1 ? '⬛' : '⬜'}                  ║`);
    console.log(`║  📆 Published This Week  │ ${publishedThisWeek.length} of 3 ${'⬛'.repeat(publishedThisWeek.length)}${'⬜'.repeat(3 - publishedThisWeek.length).padEnd(5)}            ║`);
    console.log("╠──────────────────────────┼──────────────────────────╣");
    console.log(`║  🟢 Today Slots Left     │ ${String(Math.max(0, 1 - publishedToday)).padEnd(25)} ║`);
    console.log(`║  🟢 Week Slots Left      │ ${String(Math.max(0, 3 - publishedThisWeek.length)).padEnd(25)} ║`);
    console.log("╠══════════════════════════════════════════════════════╣");
    console.log("║  This week's articles:                               ║");
    publishedThisWeek.forEach(p => {
        console.log(`║  • ${p.date} — ${p.title.substring(0, 35)}...`.padEnd(55) + "║");
    });
    console.log("╚══════════════════════════════════════════════════════╝");
}

check().catch(console.error);
