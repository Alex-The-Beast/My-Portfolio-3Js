import { useEffect, useState } from 'react'
import { learningUpdates as fallbackUpdates } from '../data/learningUpdates.js'

const initialState = {
  updates: fallbackUpdates,
  isLoading: true,
  error: '',
  source: 'static',
  syncedAt: '',
  stale: false,
}

export const useLearningUpdates = () => {
  const [state, setState] = useState(initialState)

  useEffect(() => {
    const controller = new AbortController()

    const loadUpdates = async () => {
      setState((current) => ({
        ...current,
        isLoading: true,
        error: '',
      }))

      try {
        const response = await fetch('/api/updates', { signal: controller.signal })
      
        const data = await response.json()
          console.log("Loaded from API", data);

        if (!response.ok) throw new Error(data.error || 'Could not load updates.')

        setState({
          updates: Array.isArray(data.updates) ? data.updates : [],
          isLoading: false,
          error: data.error || '',
          source: response.headers.get('X-Content-Source') || 'api',
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
  }, [])

  return state
}
