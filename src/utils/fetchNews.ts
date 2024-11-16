import Parser from 'rss-parser';
import https from 'node:https';

const parser = new Parser();

const FEEDS = [
  { url: 'https://usbgf.org/feed/', source: 'USBGF' },
  { url: 'https://wbgf.info/news/feed/', source: 'WBGF' },
  { url: 'https://ukbgf.com/blog/feed/', source: 'UKBGF' }
];

export async function fetchAllFeeds() {
  const allItems = [];

  const fetchWithTimeout = (url: string) => {
    return new Promise((resolve, reject) => {
      const request = https.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; BackgammonNews/1.0;)'
        },
        timeout: 10000
      }, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to fetch ${url}: ${response.statusCode}`));
          return;
        }

        let data = '';
        response.on('data', (chunk) => data += chunk);
        response.on('end', () => resolve(data));
      });

      request.on('error', (error) => {
        console.error(`Error fetching ${url}:`, error);
        reject(error);
      });
    });
  };

  for (const feed of FEEDS) {
    try {
      console.log(`Fetching ${feed.source} from ${feed.url}`);
      const rawFeed = await fetchWithTimeout(feed.url);
      const feedContent = await parser.parseString(rawFeed as string);
      
      const items = feedContent.items.map(item => ({
        title: item.title || 'Untitled',
        link: item.link || '#',
        contentSnippet: item.contentSnippet?.substring(0, 300) || 
                       item.content?.substring(0, 300) || 
                       'No description available',
        source: feed.source,
        pubDate: new Date(item.pubDate || new Date()).toISOString(),
      }));
      
      console.log(`Found ${items.length} items from ${feed.source}`);
      allItems.push(...items);
    } catch (error) {
      console.error(`Error processing ${feed.source}:`, error);
    }
  }

  // Sort by date, newest first
  return allItems.sort((a, b) => 
    new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  );
}