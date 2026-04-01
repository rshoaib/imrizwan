const fs = require('fs');
const path = require('path');

const sites = [
  { key: 'dailysmartcalc', dir: 'c:\\\\Projects\\\\dailysmartcalc-next', slug: 'what-is-a-healthy-bmi-range', dateVal: '2026-03-30', matchName: 'NEXT_PUBLIC_SUPABASE_URL' },
  { key: 'onlineimageshrinker', dir: 'c:\\\\Projects\\\\onlineimageshrinker', slug: 'what-is-exif-data-in-photos', dateVal: '2026-03-30', matchName: 'VITE_SUPABASE_URL' }
];

async function run() {
  for (const site of sites) {
    try {
        const envPath = site.key === 'onlineimageshrinker' ? path.join(site.dir, '.env.production') : path.join(site.dir, '.env.local');
        require('dotenv').config({ path: envPath });
        
        let url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
        
        if (!url || !key) {
            console.log('[❌] ' + site.key + ': Missing URL or Role Key from loaded environment.');
            continue;
        }

        const headers = {
            'apikey': key,
            'Authorization': 'Bearer ' + key,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        };

        const patchData = {
            date: site.dateVal,
            display_date: 'March 30, 2026'
        };

        // If dailysmartcalc-next, it might use published_at? I'll fetch first.
        const exRes = await fetch(`${url}/rest/v1/blog_posts?slug=eq.${site.slug}`, { headers });
        if (!exRes.ok) {
           console.log(`[❌] ${site.key}: Fetch failed - ${exRes.status}`);
           continue;
        }
        
        const existingArr = await exRes.json();
        if (existingArr.length === 0) {
            console.log(`[❌] ${site.key}: Article ${site.slug} not found!`);
            continue;
        }
        
        const existing = existingArr[0];
        if (existing.published_at !== undefined) patchData.published_at = site.dateVal + 'T10:00:00.000Z';
        
        const pRes = await fetch(`${url}/rest/v1/blog_posts?slug=eq.${site.slug}`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify(patchData)
        });
        
        if (!pRes.ok) {
           console.log(`[❌] ${site.key}: Patch failed - ${pRes.status} ${await pRes.text()}`);
        } else {
           console.log(`[✅] ${site.key}: Date patched to ${site.dateVal} successfully!`);
        }
        
    } catch(err) {
        console.error(`[❌] ${site.key}: Error: ${err.message}`);
    }
  }
}
run();
