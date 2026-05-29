import { useState, useEffect, useCallback } from 'react'
import { Settings } from '@/types'

const STORAGE_KEY = 'hermes-ui-settings'

const defaultSettings: Settings = {
  apiUrl: '',
  apiKey: '',
  model: '',
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setSettings(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse settings:', e)
      }
    }
    setIsLoading(false)
  }, [])

  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const clearSettings = useCallback(() => {
    setSettings(defaultSettings)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return {
    settings,
    isLoading,
    updateSettings,
    clearSettings,
  }
}
