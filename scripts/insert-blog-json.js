const fs = require('fs');
const content = fs.readFileSync('scripts/post.md', 'utf8');

const postObj = {
  id: '31',
  slug: 'power-automate-html-table-styling-css',
  title: 'Power Automate: How to Style HTML Tables with CSS',
  excerpt: 'Stop sending ugly emails! Learn to apply custom CSS to the Power Automate Create HTML Table action and use our free generator to style data instantly.',
  image: '/images/blog/power-automate-html-table-styling-css.png',
  content: content,
  date: '2026-03-13',
  displayDate: 'March 13, 2026',
  readTime: '5 min read',
  category: 'Power Platform',
  tags: ['power-automate', 'css', 'html-table', 'workflow', 'styling']
};

let str = JSON.stringify(postObj, null, 2) + ',';

let file = fs.readFileSync('data/blog.ts', 'utf8');
file = file.replace('export const blogPosts: BlogPost[] = [', 'export const blogPosts: BlogPost[] = [\\n' + str);
fs.writeFileSync('data/blog.ts', file);
console.log('Inserted post via JSON.stringify');
