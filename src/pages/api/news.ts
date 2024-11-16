import type { APIRoute } from 'astro';
import { fetchAllFeeds } from '../../utils/fetchNews';

export const GET: APIRoute = async () => {
  try {
    const news = await fetchAllFeeds();
    
    return new Response(JSON.stringify(news), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch news' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}