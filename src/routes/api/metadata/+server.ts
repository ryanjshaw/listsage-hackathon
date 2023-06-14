import urlMetadata from 'url-metadata';
import type { RequestHandler } from '@sveltejs/kit';

const allowedOrigin = {
  'Access-Control-Allow-Origin': 'localhost'
};

export const GET: RequestHandler = async (req) => {
  const queryUrl = req.url.searchParams.get('url');

  if (!queryUrl) {
    const errorResponse = new Response(JSON.stringify({ error: 'Invalid URL' }), {
      status: 401,
      headers: allowedOrigin,
    });
    return errorResponse;
  }

  try {
    const metadata = await urlMetadata(queryUrl);

    const response = new Response(
      JSON.stringify({
        title: metadata['og:title'],
        image: metadata['og:image'],
        description: metadata['og:description']
      }),
      {
        status: 200,
        headers: {
          ...allowedOrigin,
          'Cache-Control': 's-maxage=43200',
        },
      }
    );
    return response;
  } catch (e) {
    const errorResponse = new Response(JSON.stringify(e), {
      status: 500,
      headers: allowedOrigin,
    });
    return errorResponse;
  }
};