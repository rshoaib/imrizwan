const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase credentials');
}

const restUrl = `${supabaseUrl}/rest/v1`;
const headers = {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
};

async function sync() {
    console.log('Reading temporary JSON data...');
    const dataPath = path.resolve(process.cwd(), 'scripts', 'temp-blog-data.json');
    const localPosts = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    console.log(`Found ${localPosts.length} posts. Syncing to Supabase...`);

    // Get existing
    const resGet = await fetch(`${restUrl}/blog_posts?select=slug`, { headers });
    const existing = await resGet.json();
    const existingSlugs = new Set(existing.map(p => p.slug));

    for (const post of localPosts) {
        if (existingSlugs.has(post.slug)) {
            console.log(`⏭️ Skipping: ${post.slug}`);
            continue;
        }

        const res = await fetch(`${restUrl}/blog_posts`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                slug: post.slug,
                title: post.title,
                excerpt: post.excerpt,
                content: post.content,
                date: post.date,
                display_date: post.displayDate,
                read_time: post.readTime,
                category: post.category,
                image: post.image,
                tags: post.tags
            })
        });

        if (!res.ok) {
            console.error(`❌ Error inserting ${post.slug}:`, await res.text());
        } else {
            console.log(`✅ Inserted: ${post.slug}`);
        }
    }

    fs.unlinkSync(dataPath);
    console.log('\\n🎉 Done! You can now empty data/blog.ts');
}

sync().catch(console.error);
