import { useState, useEffect } from 'react'
import { Chat } from './components/Chat'
import { Settings } from './components/Settings'
import { Sidebar } from './components/Sidebar'
import { useSettings } from './hooks/useSettings'
import { MessageSquare, Settings as SettingsIcon } from 'lucide-react'

export default function App() {
  const { settings, isLoading } = useSettings()
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
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-hermes-500"></div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        currentSessionId={currentSessionId}
        onSessionSelect={setCurrentSessionId}
        onNewSession={() => setCurrentSessionId(null)}
        onOpenSettings={() => setShowSettings(true)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b bg-white">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-hermes-500" />
            <h1 className="text-xl font-semibold text-gray-800">Hermes UI</h1>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <SettingsIcon className="w-5 h-5 text-gray-600" />
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
