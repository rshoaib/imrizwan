const fs = require('fs');
const path = require('path');

const projects = [
    'imrizwan',
    'legalpolicygen',
    'mycalcfinance',
    'onlineimageshrinker',
    'dailysmartcalc-next',
    'orderviachat'
];

const now = new Date();
const today = now.toISOString().split('T')[0];
const day = now.getDay() || 7;
if(day !== 1) now.setHours(-24 * (day - 1));
const startOfWeek = now.toISOString().split('T')[0];

async function checkProject(project) {
    const envPath = path.join('c:\\Projects', project, '.env.local');
    if (!fs.existsSync(envPath)) return null;

    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = Object.fromEntries(
        envContent.split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('#'))
        .map(line => {
            const idx = line.indexOf('=');
            if (idx === -1) return [line, ''];
            return [line.slice(0, idx), line.slice(idx + 1).replace(/^"|"$/g, '')];
        })
    );

    const supabaseUrl = envVars['VITE_SUPABASE_URL'] || envVars['NEXT_PUBLIC_SUPABASE_URL'] || envVars['SUPABASE_URL'];
    const supabaseKey = envVars['SUPABASE_SERVICE_ROLE_KEY'];
    
    if (!supabaseUrl || !supabaseKey) return null;

    const restUrl = `${supabaseUrl}/rest/v1`;
    const headers = { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` };

    try {
        const res = await fetch(`${restUrl}/blog_posts?select=title,published_at,date,created_at&order=id.desc`, { headers });
        if (!res.ok) {
            // some projects might use a different table name or not have blog posts
            return null;
        }
        const posts = await res.json();
        
        let publishedToday = 0;
        let publishedThisWeek = 0;

        posts.forEach(p => {
            const dateStr = p.published_at || p.date || p.created_at;
            if (!dateStr) return;
            const postDate = dateStr.split('T')[0];
            if (postDate === today) publishedToday++;
            if (postDate >= startOfWeek && postDate <= today) publishedThisWeek++;
        });

        return {
            project,
            total: posts.length,
            publishedToday,
            publishedThisWeek,
            status: (publishedToday >= 1) ? '🟥 NO (Daily Limit)' : (publishedThisWeek >= 3) ? '🟨 NO (Weekly Limit)' : '🟩 YES (Open)'
        };
    } catch(e) {
        return null;
    }
}

async function run() {
    const results = [];
    for (const p of projects) {
        const stats = await checkProject(p);
        if (stats) {
            results.push(stats);
        } else {
            results.push({ project: p, error: 'Cannot read Supabase DB' });
        }
    }
    fs.writeFileSync('limits.json', JSON.stringify(results, null, 2));
    console.log('Results written to limits.json');
}
run();
