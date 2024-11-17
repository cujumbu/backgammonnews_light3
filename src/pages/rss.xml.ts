import rss from '@astrojs/rss';
import { fetchAllFeeds } from '../utils/fetchNews';

export async function GET(context) {
  const news = await fetchAllFeeds();
  
  return rss({
    title: 'Backgammon News',
    description: 'Latest updates from the backgammon world',
    site: context.site,
    items: news.map((item) => ({
      title: item.title,
      pubDate: new Date(item.pubDate),
      description: item.contentSnippet,
      link: item.link,
      author: item.author,
    })),
  });
}
