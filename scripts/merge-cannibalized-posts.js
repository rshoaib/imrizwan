const fs = require('fs');
const path = require('path');

const envContent = fs.readFileSync(path.resolve(process.cwd(), '.env.local'), 'utf8');
const envVars = Object.fromEntries(
    envContent
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('#'))
        .map(line => {
            const idx = line.indexOf('=');
            return [line.slice(0, idx), line.slice(idx + 1).replace(/^"|"$/g, '')];
        })
);

const supabaseUrl = envVars['VITE_SUPABASE_URL'] || envVars['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = envVars['SUPABASE_SERVICE_ROLE_KEY'];

const restUrl = `${supabaseUrl}/rest/v1`;
const headers = {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
};

async function mergeAndDelete() {
    const slugIndexed = 'spfx-migrate-gulp-heft-webpack-2026'; // This one is indexed, we keep it
    const slugUnindexed = 'spfx-1-23-new-cli-replacing-yeoman-heft-migration-guide-2026'; // Unindexed, we delete it
    
    // 1. Fetch both posts
    const resGet1 = await fetch(`${restUrl}/blog_posts?slug=eq.${slugIndexed}`, { headers });
    const resGet2 = await fetch(`${restUrl}/blog_posts?slug=eq.${slugUnindexed}`, { headers });
    
    const data1 = await resGet1.json();
    const data2 = await resGet2.json();
    
    if (data1.length === 0 || data2.length === 0) {
        console.error("One or both posts not found. Check slugs.");
        return;
    }
    
    const indexedId = data1[0].id;
    const unindexedId = data2[0].id;

    // Use the comprehensive content/title from the unindexed post
    const mergedContent = data2[0].content + '\n\n' + '### Visualize Your Upgraded Architecture\nAs you migrate your SPFx projects, it is critical to document your target environment. Use the free **[M365 Architecture Canvas](/tools/m365-architecture-canvas)** to drag and drop SharePoint and Teams components into a visually exportable architecture diagram.';
    
    // 2. Update indexed post with the comprehensive content, title, excerpt, and image
    console.log(`\n✅ Updating indexed post (${slugIndexed}) with superior content...`);
    const resPatch = await fetch(`${restUrl}/blog_posts?id=eq.${indexedId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
            title: data2[0].title,
            excerpt: data2[0].excerpt,
            content: mergedContent,
            image: data2[0].image
        })
    });

    if (!resPatch.ok) {
        console.error(`❌ Error updating indexed post:`, await resPatch.text());
        return;
    }
    
    // 3. Delete unindexed post
    console.log(`🗑️ Deleting cannibalized unindexed post (${slugUnindexed})...`);
    const resDelete = await fetch(`${restUrl}/blog_posts?id=eq.${unindexedId}`, {
        method: 'DELETE',
        headers
    });
    
    if (!resDelete.ok) {
        console.error(`❌ Error deleting post:`, await resDelete.text());
        return;
    }

    console.log(`🎉 Successfully merged and deleted the duplicate post!`);
}

mergeAndDelete().catch(console.error);
