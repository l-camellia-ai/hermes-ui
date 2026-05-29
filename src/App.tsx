import { useState, useEffect } from 'react'
import { Chat } from './components/Chat'
import { Settings } from './components/Settings'
import { Sidebar } from './components/Sidebar'
import { useSettings } from './hooks/useSettings'
import { useTheme } from './hooks/useTheme'
import { MessageSquare, Settings as SettingsIcon } from 'lucide-react'

export default function App() {
  const { settings, isLoading } = useSettings()
  const { theme, toggleTheme } = useTheme()
  const [showSettings, setShowSettings] = useState(false)
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)

  // Show settings if no API URL is configured
  useEffect(() => {
    if (!isLoading && !settings.apiUrl) {
      setShowSettings(true)
    }
  }, [settings.apiUrl, isLoading])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-surface-secondary">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-hermes-500"></div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-surface-secondary">
      {/* Sidebar */}
      <Sidebar
        currentSessionId={currentSessionId}
        onSessionSelect={setCurrentSessionId}
        onNewSession={() => setCurrentSessionId(null)}
        onOpenSettings={() => setShowSettings(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b bg-surface-primary border-edge-primary">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-hermes-500" />
            <h1 className="text-xl font-semibold text-content-primary">Hermes UI</h1>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 rounded-lg hover:bg-surface-tertiary transition-colors"
          >
            <SettingsIcon className="w-5 h-5 text-content-secondary" />
          </button>
        </header>

        {/* Chat Area */}
        <Chat
          sessionId={currentSessionId}
          onSessionCreated={setCurrentSessionId}
        />
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <Settings onClose={() => setShowSettings(false)} />
      )}
    </div>
  )
}
