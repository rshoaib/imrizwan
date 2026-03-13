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
    
    console.log(JSON.stringify(posts, null, 2));
}

check().catch(console.error);
