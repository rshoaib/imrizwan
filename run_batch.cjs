const fs = require('fs');
const path = require('path');
const https = require('https');

const sites = [
  {
    id: 3, 
    key: 'buildwithriz', 
    dir: 'c:\\Projects\\buildwithriz', 
    envFile: '.env.local',
    slug: 'how-to-write-invoice-step-by-step',
    title: 'How to Write an Invoice Step by Step (Free 2026 Guide)',
    excerpt: 'Learn exactly how to write a professional invoice that gets you paid faster without relying on expensive software subscriptions.',
    content: `
      <h2>The Anatomy of a Perfect Invoice</h2>
      <p>Whether you're a freelance developer or a consultant, knowing how to write an invoice step by step ensures you look professional and get paid on time. Always include a clear header stating "INVOICE", your contact details, and the client's details. Generate one in 30 seconds straight from your browser using our free, zero-signup <a href="/">invoice generator</a>.</p>
      <h3>Detailed Line Items</h3>
      <p>Never group your work into one generic "Services Rendered" line. Break down your tasks so the client understands the value they received. Include payment terms directly at the bottom (e.g., Net 30, Due upon receipt).</p>
    `
  },
  {
    id: 4, 
    key: 'orderviachat', 
    dir: 'c:\\Projects\\orderviachat', 
    envFile: '.env.local',
    slug: 'uber-eats-alternatives-no-commission',
    title: 'Uber Eats Alternatives: No Commission Ordering in 2026',
    excerpt: 'Stop giving away 30% of your restaurant revenue. Explore the best zero-commission alternatives to Uber Eats, including direct WhatsApp ordering.',
    content: `
      <h2>The Problem with Third-Party Delivery Apps</h2>
      <p>In 2026, delivering platforms take up to 30% commission, leaving small restaurants with razor-thin margins. The best Uber Eats alternative isn't another marketplace app—it's owning your customer relationship.</p>
      <h3>Zero Commission WhatsApp Ordering</h3>
      <p>Using <a href="/">OrderViaChat</a>, you can accept direct orders instantly on WhatsApp without paying any per-order fees. Customers simply scan your QR code or click your link, browse your digital menu, and send the order directly to your WhatsApp inbox.</p>
    `
  },
  {
    id: 5, 
    key: 'imrizwan', 
    dir: 'c:\\Projects\\imrizwan', 
    envFile: '.env.local',
    slug: 'microsoft-graph-api-authentication-guide',
    title: 'Microsoft Graph API Authentication Guide (OAuth 2.0)',
    excerpt: 'A complete developer overview of authenticating with the Microsoft Graph API using MSAL and OAuth 2.0 flows for enterprise applications.',
    content: `
      <h2>Understanding Microsoft Graph Authentication</h2>
      <p>Before you can query Graph, you need a valid access token. Microsoft Entra ID (formerly Azure AD) provides two main flows depending on whether a user is present (Delegated) or an app is running in the background (Application permissions).</p>
      <h3>Using MSAL.js</h3>
      <p>Stop writing raw HTTP requests to the token endpoint. Use the Microsoft Authentication Library (MSAL). It handles token caching and silent renewals automatically, which is critical for SPFx web parts and standalone React applications interacting with SharePoint data.</p>
    `
  },
  {
    id: 6, 
    key: 'certquiz', 
    dir: 'c:\\Projects\\certquiz', 
    envFile: '.env.local',
    slug: 'sy0-701-exam-tips-pass-first-try',
    title: 'SY0-701 Exam Tips: Pass Security+ on Your First Try',
    excerpt: 'Practical study tactics and exam day strategies to pass the CompTIA Security+ SY0-701 exam without buying expensive courses.',
    content: `
      <h2>Master the Acronyms</h2>
      <p>The CompTIA Security+ SY0-701 exam is notorious for its alphabet soup. If you don't know the difference between PBKDF2, IPsec, and IKEv2, you will struggle. Review the official objectives PDF daily.</p>
      <h3>Practice Performance-Based Questions (PBQs)</h3>
      <p>The first 3 to 5 questions on your exam will be interactive PBQs. Don't panic. Flag them and save them for the end. Run through our <a href="/quiz/security-plus-sy0-701">free Security+ practice test</a> to identify your weak domains before exam day.</p>
    `
  },
  {
    id: 7, 
    key: 'dailysmartcalc', 
    dir: 'c:\\Projects\\dailysmartcalc-next', 
    envFile: '.env.local',
    slug: 'what-is-a-healthy-bmi-range',
    title: 'What is a Healthy BMI Range? (2026 Guide)',
    excerpt: 'Understand what Body Mass Index (BMI) categories mean for your health, and why BMI is only one piece of the health puzzle.',
    content: `
      <h2>The Standard BMI Categories</h2>
      <p>Body Mass Index is a simple calculation using your height and weight. The World Health Organization defines a healthy range as 18.5 to 24.9. Anything below is considered underweight, and above 25 is categorized as overweight. Check your current status instantly with our <a href="/bmi">free BMI calculator</a>.</p>
      <h3>Limitations of BMI</h3>
      <p>While useful for population statistics, BMI doesn't differentiate between muscle mass and fat. A bodybuilder might have a BMI of 30 due to heavy muscle density but possess very little body fat.</p>
    `
  },
  {
    id: 8, 
    key: 'onlineimageshrinker', 
    dir: 'c:\\Projects\\onlineimageshrinker', 
    envFile: '.env.production',
    slug: 'what-is-exif-data-in-photos',
    title: 'What is EXIF Data in Photos? (Privacy Guide)',
    excerpt: 'Your photos reveal more than you think. Learn what EXIF metadata is, how it compromises your location privacy, and how to safely strip it.',
    content: `
      <h2>The Hidden Data Inside Your JPGs</h2>
      <p>EXIF (Exchangeable Image File Format) data is embedded in almost every photo you snap with your smartphone. It includes your exact GPS coordinates, camera model, shutter speed, and timestamps. If you post raw images to public forums, you are broadcasting your location.</p>
      <h3>How to Strip Metadata</h3>
      <p>Always scrub this data before sharing sensitive images. Use our 100% client-side <a href="/exif">free EXIF viewer and remover</a> to securely wipe your metadata directly in your browser—no uploads required.</p>
    `
  },
  {
    id: 9, 
    key: 'tinypdftools', 
    dir: 'c:\\Projects\\pdftoolkit', 
    envFile: '.env.production',
    slug: 'how-to-fix-rotated-pdf-scan',
    title: 'How to Fix a Rotated PDF Scan',
    excerpt: 'Scanned a document upside down? Here is a simple, free way to permanently rotate your PDF pages back to the correct orientation.',
    content: `
      <h2>The Upside-Down Scan Problem</h2>
      <p>We've all been there: you scan a massive 50-page legal contract on an office printer, only to realize the pages were fed upside down. Most PDF viewers let you rotate your view, but the actual file remains messed up when you email it.</p>
      <h3>Permanently Rotate PDF Pages</h3>
      <p>To fix the actual file without buying costly Adobe Acrobat licenses, upload the file to a <a href="/rotate-pdf">free online PDF rotator</a>. Because our tool relies purely on browser-based Javascript (WebAssembly), your sensitive scanned documents are never transmitted to external servers.</p>
    `
  }
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
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

async function run() {
  console.log("🚀 Starting Batch Content Deployment Pipeline\\n");
  console.log("🚀 Starting Batch Content Deployment Pipeline\n");
  
  const results = [];

  for (const site of sites) {
    console.log(`[Site ${site.id}/9] Processing ${site.key}...`);
    try {
      let envPath = path.join(site.dir, '.env.local');
      if (!fs.existsSync(envPath)) {
        envPath = path.join(site.dir, '.env');
      }
      if (!fs.existsSync(envPath)) {
        envPath = path.join(site.dir, '.env.production');
      }
      
      if (!fs.existsSync(envPath)) {
        console.log('  ❌ Missing all env files for ' + site.key);
        results.push({ site: site.key, status: "❌ Failed", reason: "Missing .env" });
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
        console.log(`  ❌ Missing Supabase credentials in ${site.envFile}`);
        results.push({ site: site.key, status: "❌ Failed", reason: "Missing credentials" });
        continue;
      }

      const postData = {
        title: site.title,
        slug: site.slug,
        excerpt: site.excerpt,
        content: site.content,
        author: site.key === 'imrizwan' ? 'Rizwan' : 'Admin',
        published_at: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0],
        display_date: 'March 30, 2026',
        image_url: '/og-image.png'
      };

      const options = {
        method: 'POST',
        headers: {
          'apikey': key,
          'Authorization': 'Bearer ' + key,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(postData)
      };

      // Try inserting with self-healing mapping
      let success = false;
      let retries = 0;
      while (!success && retries < 10) {
        try {
          options.body = JSON.stringify(postData);
          await fetchAPI(url + '/rest/v1/blog_posts', options);
          console.log('  ✅ Inserted article successfully: ' + site.title);
          results.push({ site: site.key, status: "✅ Published", slug: site.slug });
          success = true;
        } catch (err) {
          const msg = err.response || err.message;
          
          if (msg.includes('23505') || msg.includes('duplicate key value violates unique constraint')) {
            console.log('  ✅ Article already published (Duplicate key): ' + site.title);
            results.push({ site: site.key, status: "✅ Published (Pre-existing)", slug: site.slug });
            success = true;
            break;
          }

          const missingColMatch = msg.match(/Could not find the '([^']+)' column/);
          if (missingColMatch) {
            const col = missingColMatch[1];
            console.log('  ⚠️ Removing unsupported column: ' + col);
            delete postData[col];
            retries++;
            continue;
          }
          
          const notNullMatch = msg.match(/column \\"([^\\"]+)\\".*violates not-null constraint/);
          if (notNullMatch) {
            const col = notNullMatch[1];
            console.log('  ⚠️ Adding missing required column: ' + col);
            postData[col] = (col === 'display_date' || col === 'date') ? 'March 30, 2026' : (col.includes('time') || col.includes('count') ? 5 : 'Default');
            retries++;
            continue;
          }

          throw err;
        }
      }

    } catch (e) {
      console.log('  ❌ Error processing ' + site.key + ': ' + (e.response || e.message));
      results.push({ site: site.key, status: "❌ Failed", reason: e.message });
    }
    console.log('');
  }
  
  console.log("🎯 Batch deployment complete.\n");
  console.log(JSON.stringify(results, null, 2));
}

run();
