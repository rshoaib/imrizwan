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

async function insertDraft() {
    const dataPath = path.resolve(process.cwd(), 'scripts', 'draft2.json');
    const post = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

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
        console.log(`✅ Successfully inserted: ${post.slug}`);
    }
}

insertDraft().catch(console.error);
