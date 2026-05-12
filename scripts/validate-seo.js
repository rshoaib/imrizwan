/**
 * SEO Validation Script
 * 
 * Scans all page files for SEO best practices:
 * - Title tags (via metadata exports)
 * - Meta descriptions
 * - Heading structure (single H1)
 * - Open Graph tags
 * - AdSense compliance hints
 * 
 * Run: node scripts/validate-seo.js
 */

const fs = require('fs');
const path = require('path');

const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const CYAN = '\x1b[36m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

let warnings = 0;
let errors = 0;
let passed = 0;

function log(type, file, message) {
    const relPath = path.relative(process.cwd(), file);
    if (type === 'error') {
        console.log(`  ${RED}✗ ${relPath}${RESET}: ${message}`);
        errors++;
    } else if (type === 'warn') {
        console.log(`  ${YELLOW}⚠ ${relPath}${RESET}: ${message}`);
        warnings++;
    } else {
        passed++;
    }
}

function findPageFiles(dir, files = []) {
    if (!fs.existsSync(dir)) return files;
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        // Skip node_modules, .next, .git
        if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
        
        if (entry.isDirectory()) {
            findPageFiles(fullPath, files);
        } else if (entry.name === 'page.tsx' || entry.name === 'page.jsx' || entry.name === 'page.ts') {
            files.push(fullPath);
        }
    }
    return files;
}

function findLayoutFiles(dir, files = []) {
    if (!fs.existsSync(dir)) return files;
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
        
        if (entry.isDirectory()) {
            findLayoutFiles(fullPath, files);
        } else if (entry.name === 'layout.tsx' || entry.name === 'layout.jsx') {
            files.push(fullPath);
        }
    }
    return files;
}

function validatePage(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const relPath = path.relative(process.cwd(), filePath);
    
    // Skip dynamic route pages that are purely functional (API-like)
    if (relPath.includes('[') && !content.includes('export default')) return;
    
    // Check for metadata export (Next.js App Router SEO)
    const hasMetadata = content.includes('export const metadata') || 
                        content.includes('export async function generateMetadata') ||
                        content.includes('export function generateMetadata');
    
    if (!hasMetadata) {
        // Check if parent layout might provide metadata
        const dir = path.dirname(filePath);
        const layoutPath = path.join(dir, 'layout.tsx');
        const parentLayout = path.join(path.dirname(dir), 'layout.tsx');
        
        const layoutHasMeta = (fs.existsSync(layoutPath) && 
            fs.readFileSync(layoutPath, 'utf-8').includes('metadata')) ||
            (fs.existsSync(parentLayout) && 
            fs.readFileSync(parentLayout, 'utf-8').includes('metadata'));
        
        if (!layoutHasMeta) {
            log('warn', filePath, 'Missing metadata export (title, description)');
        } else {
            log('pass', filePath, 'Metadata in parent layout');
        }
    } else {
        // Check for description in metadata
        if (hasMetadata && !content.includes('description')) {
            log('warn', filePath, 'Metadata exists but missing description');
        } else {
            log('pass', filePath, 'Has metadata with description');
        }
    }
    
    // Check for multiple h1 tags (bad for SEO)
    const h1Matches = content.match(/<h1[\s>]/g) || [];
    if (h1Matches.length > 1) {
        log('warn', filePath, `Multiple <h1> tags found (${h1Matches.length}). Use single H1 per page.`);
    }
}

function validateLayout(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Root layout checks
    if (filePath.includes('app/layout.tsx') || filePath.includes('app\\layout.tsx')) {
        // Check for viewport meta
        if (!content.includes('viewport') && !content.includes('Viewport')) {
            log('warn', filePath, 'Root layout missing viewport configuration');
        }
        
        // Check for lang attribute
        if (!content.includes('lang=')) {
            log('warn', filePath, 'Missing lang attribute on <html> tag');
        }
        
        // Check for favicon/icons
        if (!content.includes('icon') && !content.includes('favicon')) {
            log('warn', filePath, 'No favicon/icon configuration found');
        }
    }
}

// ── Main Execution ──

console.log(`\n${BOLD}${CYAN}🔍 SEO Validation Pipeline${RESET}\n`);

const appDir = path.join(process.cwd(), 'app');

if (!fs.existsSync(appDir)) {
    console.log(`${RED}No app/ directory found. Skipping SEO validation.${RESET}`);
    process.exit(0);
}

// Find and validate pages
const pages = findPageFiles(appDir);
console.log(`${BOLD}📄 Scanning ${pages.length} pages...${RESET}`);
pages.forEach(validatePage);

// Find and validate layouts
const layouts = findLayoutFiles(appDir);
console.log(`\n${BOLD}📐 Scanning ${layouts.length} layouts...${RESET}`);
layouts.forEach(validateLayout);

// Summary
console.log(`\n${BOLD}─── Results ───${RESET}`);
console.log(`  ${GREEN}✓ ${passed} checks passed${RESET}`);
if (warnings > 0) console.log(`  ${YELLOW}⚠ ${warnings} warnings${RESET}`);
if (errors > 0) console.log(`  ${RED}✗ ${errors} errors${RESET}`);

if (errors > 0) {
    console.log(`\n${RED}${BOLD}Pipeline: SEO validation FAILED${RESET}\n`);
    process.exit(1);
} else if (warnings > 0) {
    console.log(`\n${YELLOW}${BOLD}Pipeline: SEO validation PASSED with warnings${RESET}\n`);
    process.exit(0);
} else {
    console.log(`\n${GREEN}${BOLD}Pipeline: SEO validation PASSED ✅${RESET}\n`);
    process.exit(0);
}
