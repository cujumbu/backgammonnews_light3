import Parser from 'rss-parser';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const parser = new Parser();

const FEEDS = [
  { url: 'https://usbgf.org/feed/', source: 'USBGF' },
  { url: 'https://wbgf.info/news/feed/', source: 'WBGF' },
  { url: 'https://ukbgf.com/blog/feed/', source: 'UKBGF' }
];

async function fetchFeed(feed) {
  try {
    const feedContent = await parser.parseURL(feed.url);
    return feedContent.items.map(item => ({
      title: item.title,
      link: item.link,
      contentSnippet: item.contentSnippet?.substring(0, 300) || item.content?.substring(0, 300) || 'No description available',
      source: feed.source,
      pubDate: new Date(item.pubDate || new Date()).toISOString(),
    }));
  } catch (error) {
    console.error(`Error fetching ${feed.source}:`, error);
    return [];
  }
}

async function fetchAllFeeds() {
  const results = await Promise.all(FEEDS.map(fetchFeed));
  const allItems = results.flat();
  
  // Sort by date
  allItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  
  const cacheFile = path.join(__dirname, '..', 'data', 'news-cache.json');
  await fs.mkdir(path.dirname(cacheFile), { recursive: true });
  await fs.writeFile(cacheFile, JSON.stringify(allItems, null, 2));
  
  console.log(`Cached ${allItems.length} news items`);
}

fetchAllFeeds().catch(console.error);