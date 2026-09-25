const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const DOCUMENTARY_GENRE = 99;
const ANIME_GENRE = 16;

const FILTERS = new Set(['all', 'movie', 'series', 'anime', 'documentary']);

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

function buildRequests(filter, page, language) {
  const params = new URLSearchParams({
    sort_by: 'popularity.desc',
    page: String(page),
    language,
  });

  const movie = (genre) => {
    const query = new URLSearchParams(params);
    if (genre) query.set('with_genres', String(genre));
    return { path: `/discover/movie?${query}`, mediaType: 'movie' };
  };

  const tv = (genre) => {
    const query = new URLSearchParams(params);
    if (genre) query.set('with_genres', String(genre));
    return { path: `/discover/tv?${query}`, mediaType: 'tv' };
  };

  if (filter === 'movie') return [movie()];
  if (filter === 'series') return [tv()];
  if (filter === 'anime') return [tv(ANIME_GENRE)];
  if (filter === 'documentary') return [movie(DOCUMENTARY_GENRE), tv(DOCUMENTARY_GENRE)];
  return [movie(), tv()];
}

async function fetchTmdb(request, token) {
  const response = await fetch(`${TMDB_BASE_URL}${request.path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    return { error: response.status === 401 ? 'TMDB token rejected.' : `TMDB error ${response.status}.` };
  }

  const body = await response.json();
  return {
    items: (body.results ?? []).map((item) => ({
      ...item,
      media_type: request.mediaType,
    })),
  };
}

async function mediaDetails(request, env) {
  if (!env.TMDB_BEARER_TOKEN) {
    return json({ error: 'TMDB_BEARER_TOKEN is not configured.' }, 500);
  }

  const url = new URL(request.url);
  const mediaType = url.searchParams.get('media_type');
  const id = url.searchParams.get('id');
  const language = url.searchParams.get('language') === 'en-US' ? 'en-US' : 'pt-BR';

  if (!['movie', 'tv'].includes(mediaType) || !/^\d+$/.test(id ?? '')) {
    return json({ error: 'Invalid media details request.' }, 400);
  }

  const params = new URLSearchParams({
    append_to_response: 'videos,watch/providers',
    include_video_language: `${language},en-US,null`,
    language,
    watch_region: 'BR',
  });

  const response = await fetch(`${TMDB_BASE_URL}/${mediaType}/${id}?${params}`, {
    headers: { Authorization: `Bearer ${env.TMDB_BEARER_TOKEN}` },
  });

  if (!response.ok) {
    return json({ error: response.status === 401 ? 'TMDB token rejected.' : `TMDB error ${response.status}.` }, 502);
  }

  const body = await response.json();
  return json({
    ...body,
    media_type: mediaType,
    genre_ids: (body.genres ?? []).map((genre) => genre.id),
    videos: body.videos?.results ?? [],
    watch_providers: body['watch/providers']?.results?.BR ?? null,
  });
}

async function recommendation(request, env) {
  if (!env.TMDB_BEARER_TOKEN) {
    return json({ error: 'TMDB_BEARER_TOKEN is not configured.' }, 500);
  }

  const url = new URL(request.url);
  const filter = url.searchParams.get('filter') ?? 'all';
  const language = url.searchParams.get('language') === 'en-US' ? 'en-US' : 'pt-BR';

  if (!FILTERS.has(filter)) {
    return json({ error: 'Invalid recommendation filter.' }, 400);
  }

  const page = Math.floor(Math.random() * 500) + 1;
  const requests = buildRequests(filter, page, language);
  const results = await Promise.all(requests.map((item) => fetchTmdb(item, env.TMDB_BEARER_TOKEN)));
  const failed = results.find((result) => result.error);

  if (failed?.error) {
    return json({ error: failed.error }, 502);
  }

  return json(results.flatMap((result) => result.items ?? []));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return json(null, 204);
    }

    if (url.pathname === '/api/recommendation' && request.method === 'GET') {
      return recommendation(request, env);
    }

    if (url.pathname === '/api/media-details' && request.method === 'GET') {
      return mediaDetails(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};
