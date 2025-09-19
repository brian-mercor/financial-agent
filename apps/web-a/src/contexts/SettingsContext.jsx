import React, { createContext, useContext, useState, useEffect } from 'react'

const SettingsContext = createContext()

export function useSettings() {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}

export function SettingsProvider({ children }) {
  // Load settings from localStorage or use defaults
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('userSettings')
    if (saved) {
      return JSON.parse(saved)
    }
    return {
      // View settings
      viewMode: 'classic', // 'classic' or 'split'
      responseStyle: 'conversational', // 'conversational' or 'report'

      // Theme settings
      colorTheme: 'blue', // 'blue', 'purple', 'green', etc.
      darkMode: false,

      // Chat settings
      streamingEnabled: true,
      showTimestamps: true,
      compactMode: false,

      // Advanced settings
      autoSelectLatestReport: true,
      enableCharts: true,
    }
  })

  // Persist settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('userSettings', JSON.stringify(settings))
  }, [settings])

  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const updateMultipleSettings = (updates) => {
    setSettings(prev => ({
      ...prev,
      ...updates
    }))
  }

  const resetSettings = () => {
    const defaults = {
      viewMode: 'classic',
      responseStyle: 'conversational',
      colorTheme: 'blue',
      darkMode: false,
      streamingEnabled: true,
      showTimestamps: true,
      compactMode: false,
      autoSelectLatestReport: true,
      enableCharts: true,
    }
    setSettings(defaults)
  }

  return (
    <SettingsContext.Provider value={{
      settings,
      updateSetting,
      updateMultipleSettings,
      resetSettings
    }}>
      {children}
    </SettingsContext.Provider>
  )
}