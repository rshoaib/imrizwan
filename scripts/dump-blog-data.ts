import { blogPosts } from '../data/blog';
import * as fs from 'fs';
import * as path from 'path';

const outputPath = path.resolve(__dirname, 'temp-blog-data.json');
fs.writeFileSync(outputPath, JSON.stringify(blogPosts, null, 2));
console.log('Successfully dumped blogPosts to temp-blog-data.json');
