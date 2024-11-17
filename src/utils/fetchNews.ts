import Parser from 'rss-parser';
import https from 'node:https';
import * as cheerio from 'cheerio';

const parser = new Parser({
  customFields: {
    item: ['content:encoded', 'content', 'description']
  }
});

const FEEDS = [
  { url: 'https://usbgf.org/feed/', source: 'USBGF' },
  { url: 'https://wbgf.info/news/feed/', source: 'WBGF' },
  { url: 'https://ukbgf.com/blog/feed/', source: 'UKBGF' }
];

function extractFirstImage(content: string): string | null {
  if (!content) return null;
  try {
    const $ = cheerio.load(content);
    const firstImg = $('img').first();
    return firstImg.attr('src') || null;
  } catch {
    return null;
  }
}

function cleanContent(content: string): string {
  if (!content) return '';
  try {
    const $ = cheerio.load(content);
    $('script, style, iframe').remove();
    return $.text().trim();
  } catch {
    return content.replace(/<[^>]*>/g, '').trim();
  }
}

export async function fetchAllFeeds() {
  const allItems = [];

  const fetchWithTimeout = (url: string) => {
    return new Promise((resolve, reject) => {
      const request = https.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; BackgammonNews/1.0;)',
          'Accept': 'application/rss+xml, application/xml, application/atom+xml, text/xml;q=0.9, */*;q=0.8'
        },
        timeout: 15000
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
        
        const items = await Promise.all(feedContent.items.map(async item => {
          const fullContent = item['content:encoded'] || item.content || item.description || '';
          const imageUrl = extractFirstImage(fullContent);
          const cleanedContent = cleanContent(fullContent);

          return {
            title: item.title || 'Untitled',
            link: item.link || '#',
            contentSnippet: cleanedContent.substring(0, 300),
            source: feed.source,
            pubDate: new Date(item.pubDate || new Date()).toISOString(),
            imageUrl,
            categories: item.categories || [],
            author: item.creator || item.author || 'Unknown',
            readingTime: Math.ceil(cleanedContent.split(/\s+/).length / 200)
          };
        }));
        
        console.log(`Found ${items.length} items from ${feed.source}`);
        return items;
      } catch (error) {
        console.error(`Error processing ${feed.source}:`, error);
        return [];
      }
    })
  );

  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      allItems.push(...result.value);
    }
  });

  return allItems.sort((a, b) => 
    new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  );
}
