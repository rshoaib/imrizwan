const fs = require('fs');
const path = require('path');

const projects = [
    'imrizwan',
    'buildwithriz',
    'legalpolicygen',
    'mycalcfinance',
    'onlineimageshrinker',
    'dailysmartcalc-next',
    'orderviachat'
];

const now = new Date();
const today = now.toISOString().split('T')[0];
const day = now.getDay() || 7;
const mondayOffset = new Date(now);
mondayOffset.setDate(now.getDate() - (day - 1));
const startOfWeek = mondayOffset.toISOString().split('T')[0];

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
        // Try different column schemas - some projects use 'date', others use 'published_at'
        let posts = null;
        for (const cols of ['title,date,created_at', 'title,published_at,created_at']) {
            const res = await fetch(`${restUrl}/blog_posts?select=${cols}&order=id.desc`, { headers });
            if (res.ok) {
                posts = await res.json();
                break;
            }
        }
        if (!posts) return null;
        
        let publishedToday = 0;
        let publishedThisWeek = 0;
        const weekArticles = [];

        posts.forEach(p => {
            const dateStr = p.published_at || p.date || p.created_at;
            if (!dateStr) return;
            const postDate = dateStr.split('T')[0];
            if (postDate === today) publishedToday++;
            if (postDate >= startOfWeek && postDate <= today) {
                publishedThisWeek++;
                weekArticles.push({ date: postDate, title: (p.title || '').slice(0, 40) });
            }
        });

        return {
            project,
            total: posts.length,
            publishedToday,
            publishedThisWeek,
            weekArticles,
            status: (publishedToday >= 1) ? '🟥 FULL (Today)' : (publishedThisWeek >= 3) ? '🟨 FULL (Week)' : '🟩 OPEN'
        };
    } catch(e) {
        return null;
    }
}

async function run() {
    console.log('\n=== CONTENT DASHBOARD - All Web Projects ===');
    console.log('Week: ' + startOfWeek + ' to ' + today + '  (Mon-Sun)\n');

    const tableData = [];
    const weekDetails = [];

    for (const p of projects) {
        const stats = await checkProject(p);
        if (stats) {
            tableData.push({
                Site: stats.project,
                Total: stats.total,
                Today: stats.publishedToday + '/1',
                Week: stats.publishedThisWeek + '/3',
                Status: stats.status
            });
            if (stats.weekArticles.length > 0) {
                weekDetails.push({ site: stats.project, articles: stats.weekArticles });
            }
        } else {
            tableData.push({
                Site: p,
                Total: '-',
                Today: '-',
                Week: '-',
                Status: 'No DB'
            });
        }
    }

    // Print header
    console.log('  SITE                    TOTAL  TODAY  WEEK   STATUS');
    console.log('  ----                    -----  -----  ----   ------');

    for (const row of tableData) {
        const s = row.Site.padEnd(24);
        const t = String(row.Total).padEnd(6);
        const td = String(row.Today).padEnd(6);
        const wk = String(row.Week).padEnd(6);
        console.log('  ' + s + t + td + wk + ' ' + row.Status);
    }

    if (weekDetails.length > 0) {
        console.log('\n--- This Week\'s Articles ---');
        for (const wd of weekDetails) {
            console.log('\n  ' + wd.site + ':');
            wd.articles.forEach(a => {
                console.log('    * ' + a.date + ' - ' + a.title);
            });
        }
    } else {
        console.log('\nNo articles published this week.');
    }

    const openSites = tableData.filter(r => r.Status.includes('OPEN'));
    console.log('\n' + (openSites.length > 0
        ? 'OPEN SLOTS: ' + openSites.map(r => r.Site).join(', ')
        : 'All sites at capacity this week.') + '\n');
}

run();

