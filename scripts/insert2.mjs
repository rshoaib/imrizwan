import fs from 'fs';
import path from 'path';

async function main() {
    try {
        const envContent = fs.readFileSync(path.resolve(process.cwd(), '.env.local'), 'utf8');
        const supabaseUrlMatch = envContent.match(/(?:NEXT_PUBLIC|VITE)_SUPABASE_URL="?([^ "\r\n]+)/);
        const supabaseKeyMatch = envContent.match(/SUPABASE_SERVICE_ROLE_KEY="?([^ "\r\n]+)/);
        
        if (!supabaseUrlMatch || !supabaseKeyMatch) {
            throw new Error("Missing env matching");
        }
        
        const supabaseUrl = supabaseUrlMatch[1].trim();
        const supabaseKey = supabaseKeyMatch[1].trim();

        const post = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'scripts', 'draft2.json'), 'utf8'));

        post.content = post.content.replace(/\\\\\\`/g, "`");

        console.log(`Inserting: ${post.slug}...`);

        const res = await fetch(`${supabaseUrl}/rest/v1/blog_posts`, {
            method: 'POST',
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
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
            console.error('Failed:', await res.text());
        } else {
            console.log('Success:', await res.json());
        }
    } catch (e) {
        fs.writeFileSync(path.resolve(process.cwd(), 'error.txt'), e.stack || e.toString(), 'utf8');
        console.error(e);
    }
}

main();
