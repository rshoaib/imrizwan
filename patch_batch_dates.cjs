const fs = require('fs');
const path = require('path');
const https = require('https');

const sites = [
  { key: 'buildwithriz', dir: 'c:\\\\Projects\\\\buildwithriz', envFile: '.env.local', slug: 'how-to-write-invoice-step-by-step' },
  { key: 'certquiz', dir: 'c:\\\\Projects\\\\certquiz', envFile: '.env.local', slug: 'sy0-701-exam-tips-pass-first-try' },
  { key: 'dailysmartcalc', dir: 'c:\\\\Projects\\\\dailysmartcalc-next', envFile: '.env.local', slug: 'what-is-a-healthy-bmi-range' },
  { key: 'onlineimageshrinker', dir: 'c:\\\\Projects\\\\onlineimageshrinker', envFile: '.env.production', slug: 'what-is-exif-data-in-photos' }
];

function fetchAPI(url, options) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ status: res.statusCode, data: data ? JSON.parse(data) : null });
        } else {
          reject(new Error('HTTP ' + res.statusCode + ': ' + data));
        }
      });
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

async function run() {
  console.log("🚀 Starting Bulk Date Patch Strategy (March 30)\\n");
  for (const site of sites) {
    let envPath = path.join(site.dir, site.envFile);
    if (!fs.existsSync(envPath)) envPath = path.join(site.dir, '.env.local');
    if (!fs.existsSync(envPath)) envPath = path.join(site.dir, '.env');
    
    if (!fs.existsSync(envPath)) {
        console.log('[❌] ' + site.key + ': Missing env file.');
        continue;
    }

    const envContent = fs.readFileSync(envPath, 'utf8');
    const vars = {};
    envContent.split('\n').forEach(line => {
      line = line.trim();
      if (!line || line.startsWith('#')) return;
      const idx = line.indexOf('=');
      if (idx === -1) return;
      const k = line.substring(0, idx).trim();
      const v = line.substring(idx + 1).trim().replace(/^"|"$/g, '').trim();
      vars[k] = v;
    });

    const url = vars.VITE_SUPABASE_URL || vars.NEXT_PUBLIC_SUPABASE_URL || vars.SUPABASE_URL;
    const key = vars.SUPABASE_SERVICE_ROLE_KEY || vars.SUPABASE_ANON_KEY || vars.VITE_SUPABASE_ANON_KEY;
    if (!url || !key) {
      console.log('[❌] ' + site.key + ': Missing Supabase keys.');
      continue;
    }

    let patchData = {
      date: '2026-03-30',
      display_date: 'March 30, 2026',
      published_at: '2026-03-30T10:00:00.000Z'
    };

    const options = {
      method: 'PATCH',
      headers: {
        'apikey': key,
        'Authorization': 'Bearer ' + key,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      }
    };

    let success = false;
    let retries = 0;
    while (!success && retries < 10) {
      try {
        options.body = JSON.stringify(patchData);
        await fetchAPI(url + '/rest/v1/blog_posts?slug=eq.' + site.slug, options);
        console.log('[✅] ' + site.key + ': Successfully patched dates for ' + site.slug + ' to 2026-03-30!');
        success = true;
      } catch (err) {
          const msg = err.message;
          const missingColMatch = msg.match(/Could not find the '([^']+)' column/);
          if (missingColMatch) {
            const col = missingColMatch[1];
            delete patchData[col];
            retries++;
            continue;
          }
          console.log('[❌] ' + site.key + ': Patch failed - ' + msg);
          break;
      }
    }
  }
}
run();
