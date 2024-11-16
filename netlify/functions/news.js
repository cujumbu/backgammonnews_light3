import Parser from 'rss-parser';
import https from 'https';

const parser = new Parser();

const FEEDS = [
  { url: 'https://usbgf.org/feed/', source: 'USBGF' },
  { url: 'https://wbgf.info/news/feed/', source: 'WBGF' },
  { url: 'https://ukbgf.com/blog/feed/', source: 'UKBGF' }
];

const fetchWithTimeout = (url) => {
  return new Promise((resolve, reject) => {
    const request = https.get(url, {
      headers: {
        'User-Agent': 'BackgammonNews/1.0'
      }
    }, (response) => {
      let data = '';
      response.on('data', (chunk) => data += chunk);
      response.on('end', () => resolve(data));
    });

    request.on('error', reject);
    request.setTimeout(5000, () => {
      request.destroy();
      reject(new Error('Timeout'));
    });
  });
};

async function fetchAllFeeds() {
  const allItems = [];

  for (const feed of FEEDS) {
    try {
      const rawFeed = await fetchWithTimeout(feed.url);
      const feedContent = await parser.parseString(rawFeed);
      
      const items = feedContent.items.map(item => ({
        title: item.title || 'Untitled',
        link: item.link || '#',
        contentSnippet: item.contentSnippet?.substring(0, 300) || 
                       item.content?.substring(0, 300) || 
                       'No description available',
        source: feed.source,
        pubDate: new Date(item.pubDate || new Date()).toISOString(),
      }));
      
      allItems.push(...items);
    } catch (error) {
      console.error(`Error fetching ${feed.source}:`, error);
    }
  }

  return allItems.sort((a, b) => 
    new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  );
}

export const handler = async () => {
  try {
    const news = await fetchAllFeeds();
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      },
      body: JSON.stringify(news)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch news' })
    };
  }
};