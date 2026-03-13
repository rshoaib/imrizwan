const fs = require('fs');
const path = require('path');

// Manually parse .env.local since dotenv is not installed
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envContent.split('\\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
        envVars[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
    }
});

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL'] || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars['SUPABASE_SERVICE_ROLE_KEY'] || process.env.SUPABASE_SERVICE_ROLE_KEY;

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

async function insertDraft() {
    const dataPath = path.resolve(process.cwd(), 'scripts', 'draft2.json');
    const post = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    // Fix literal backslash escaping in content directly before insert just in case
    post.content = post.content.replace(/\\\\\\`/g, "`");

    console.log(`Inserting: ${post.slug}`);

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
