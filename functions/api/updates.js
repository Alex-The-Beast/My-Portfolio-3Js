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

const getUpdateTags = (update) => [...(update.tags || []), ...(update.focus || [])].filter(Boolean)

const getCategories = (updates) => [
  'All Posts',
  ...Array.from(new Set(updates.map((update) => update.category).filter(Boolean))),
]

const getFilteredPayload = (payload, url) => {
  const updates = Array.isArray(payload.updates) ? payload.updates : []
  const category = url.searchParams.get('category') || 'All Posts'
  const search = (url.searchParams.get('search') || '').trim().toLowerCase()
  const updateId = url.searchParams.get('updateId') || ''
  const limit = Number(url.searchParams.get('limit') || 0)

  let filteredUpdates = updates

  if (updateId) {
    filteredUpdates = filteredUpdates.filter((update) => update.slug === updateId || update.id === updateId)
  }

  if (category && category !== 'All Posts') {
    filteredUpdates = filteredUpdates.filter((update) => update.category === category)
  }

  if (search) {
    filteredUpdates = filteredUpdates.filter((update) => {
      const searchable = [
        update.title,
        update.summary,
        update.category,
        update.status,
        ...(update.notes || []),
        ...getUpdateTags(update),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return searchable.includes(search)
    })
  }

  const total = filteredUpdates.length
  if (Number.isFinite(limit) && limit > 0) {
    filteredUpdates = filteredUpdates.slice(0, limit)
  }

  return {
    ...payload,
    updates: filteredUpdates,
    total,
    categories: getCategories(updates),
  }
}

export const onRequestGet = async ({ request, env }) => {
  const url = new URL(request.url)
  const shouldRefresh = url.searchParams.get('refresh') === '1'

  if (!shouldRefresh) {
    const cached = await getCachedUpdates(env)
    if (cached) {
      return json(getFilteredPayload(cached, url), {
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

    return json(getFilteredPayload(payload, url), {
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
          ...getFilteredPayload(cached, url),
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
