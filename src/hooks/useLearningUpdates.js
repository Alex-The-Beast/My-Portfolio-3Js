import { useEffect, useState } from 'react'
import { learningUpdates as fallbackUpdates } from '../data/learningUpdates.js'

const getUpdateTags = (update) => [...(update.tags || []), ...(update.focus || [])].filter(Boolean)

const categories = ['All Posts', ...Array.from(new Set(fallbackUpdates.map((update) => update.category).filter(Boolean)))]

const getFallbackSnapshot = ({ category = 'All Posts', search = '', limit = 0, updateId = '' } = {}) => {
  const normalizedSearch = search.trim().toLowerCase()
  let updates = fallbackUpdates

  if (updateId) {
    updates = updates.filter((update) => update.slug === updateId || update.id === updateId)
  }

  if (category && category !== 'All Posts') {
    updates = updates.filter((update) => update.category === category)
  }

  if (normalizedSearch) {
    updates = updates.filter((update) => {
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

      return searchable.includes(normalizedSearch)
    })
  }

  const total = updates.length
  if (limit > 0) updates = updates.slice(0, limit)

  return {
    updates,
    categories,
    total,
    isLoading: true,
    error: '',
    syncedAt: '',
    stale: false,
  }
}

export const useLearningUpdates = ({ category = 'All Posts', search = '', limit = 0, updateId = '' } = {}) => {
  const [state, setState] = useState(() => getFallbackSnapshot({ category, search, limit, updateId }))

  useEffect(() => {
    const controller = new AbortController()

    const loadUpdates = async () => {
      const params = new URLSearchParams()
      if (category && category !== 'All Posts') params.set('category', category)
      if (search.trim()) params.set('search', search.trim())
      if (limit > 0) params.set('limit', String(limit))
      if (updateId) params.set('updateId', updateId)

      setState((current) => {
        const fallback = getFallbackSnapshot({ category, search, limit, updateId })
        const hasCurrentResults = current.updates.length > 0

        return {
          ...(hasCurrentResults ? current : fallback),
          isLoading: true,
          error: '',
        }
      })

      try {
        const query = params.toString()
        const response = await fetch(`/api/updates${query ? `?${query}` : ''}`, { signal: controller.signal })
        const data = await response.json()

        if (!response.ok) throw new Error(data.error || 'Could not load updates.')

        setState({
          updates: Array.isArray(data.updates) ? data.updates : [],
          categories: Array.isArray(data.categories) ? data.categories : categories,
          total: Number(data.total || 0),
          isLoading: false,
          error: data.error || '',
          syncedAt: data.syncedAt || '',
          stale: Boolean(data.stale),
        })
      } catch (error) {
        if (error.name === 'AbortError') return

        setState((current) => ({
          ...current,
          isLoading: false,
          error: error.message,
        }))
      }
    }

    loadUpdates()

    return () => controller.abort()
  }, [category, limit, search, updateId])

  return state
}
