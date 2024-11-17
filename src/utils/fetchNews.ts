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
          'User-Agent': 'Mozilla/5.0 (compatible; BackgammonNews/1.0;)',
          'Accept': 'application/rss+xml, application/xml, application/atom+xml, text/xml;q=0.9, */*;q=0.8'
        },
        timeout: 15000 // Increased timeout to 15 seconds
      }, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to fetch ${url}: ${response.statusCode}`));
          return;
        }

        const chunks: Buffer[] = [];
        response.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
        response.on('end', () => {
          const data = Buffer.concat(chunks).toString('utf-8');
          resolve(data);
        });
      });

      request.on('error', (error) => {
        console.error(`Error fetching ${url}:`, error);
        reject(error);
      });

      request.on('timeout', () => {
        request.destroy();
        reject(new Error(`Timeout fetching ${url}`));
      });
    });
  };

  const results = await Promise.allSettled(
    FEEDS.map(async (feed) => {
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
        return items;
      } catch (error) {
        console.error(`Error processing ${feed.source}:`, error);
        return [];
      }
    })
  );

  // Collect successful results
  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      allItems.push(...result.value);
    }
  });

  // Sort by date, newest first
  return allItems.sort((a, b) => 
    new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  );
}
