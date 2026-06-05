import { fetchLearningUpdates } from '../_notion-updates.js'

const cacheKey = 'learning-updates:v1'
const defaultCacheTtl = 300

const json = (body, init = {}) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init.headers,
    },
  })

const getCachedUpdates = async (env) => {
  if (!env.CONTENT_CACHE) return null

  return env.CONTENT_CACHE.get(cacheKey, 'json')
}

const putCachedUpdates = async (env, payload) => {
  if (!env.CONTENT_CACHE) return

  await env.CONTENT_CACHE.put(cacheKey, JSON.stringify(payload), {
    expirationTtl: Number(env.CONTENT_CACHE_TTL_SECONDS || defaultCacheTtl),
  })
}

export const onRequestGet = async ({ request, env }) => {
  const url = new URL(request.url)
  const shouldRefresh = url.searchParams.get('refresh') === '1'

  if (!shouldRefresh) {
    const cached = await getCachedUpdates(env)
    if (cached) {
      return json(cached, {
        headers: {
          'Cache-Control': 'public, max-age=60',
          'X-Content-Source': 'kv',
        },
      })
    }
  }

  try {
    const payload = {
      updates: await fetchLearningUpdates(env),
      syncedAt: new Date().toISOString(),
    }

    await putCachedUpdates(env, payload)

    return json(payload, {
      headers: {
        'Cache-Control': 'public, max-age=60',
        'X-Content-Source': 'notion',
      },
    })
  } catch (error) {
    const cached = await getCachedUpdates(env)
    if (cached) {
      return json(
        {
          ...cached,
          stale: true,
          error: error.message,
        },
        {
          headers: {
            'Cache-Control': 'public, max-age=30',
            'X-Content-Source': 'kv-stale',
          },
        },
      )
    }

    return json(
      {
        error: error.message,
        updates: [],
      },
      { status: 500 },
    )
  }
}
