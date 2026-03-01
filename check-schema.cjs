const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/blog/power-apps-canvas-app-sharepoint-complete-guide', { waitUntil: 'networkidle0' });
  
  const scripts = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map(s => s.textContent);
  });
  
  console.log("Found JSON-LD scripts:", scripts.length);
  
  let foundArticle = false;
  scripts.forEach((s, idx) => {
    if (s.includes('Article')) {
      foundArticle = true;
      console.log(`\nScript ${idx + 1} contains Article schema:`);
      console.log(s.substring(0, 300) + '...');
    }
  });

  if (!foundArticle) {
    console.log('\n❌ Article schema NOT found in any JSON-LD script block');
  } else {
    console.log('\n✅ Article schema successfully injected');
  }

  await browser.close();
})();
