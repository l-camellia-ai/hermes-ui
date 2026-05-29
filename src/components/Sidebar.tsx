import { useState, useEffect } from 'react'
import { Session } from '@/types'
import { Plus, MessageSquare, Settings, Trash2, Moon, Sun } from 'lucide-react'

interface SidebarProps {
  currentSessionId: string | null
  onSessionSelect: (id: string) => void
  onNewSession: () => void
  onOpenSettings: () => void
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

export function Sidebar({
  currentSessionId,
  onSessionSelect,
  onNewSession,
  onOpenSettings,
  theme,
  onToggleTheme,
}: SidebarProps) {
  const [sessions, setSessions] = useState<Session[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('hermes-sessions')
    if (stored) {
      try {
        setSessions(JSON.parse(stored))
      } catch {
        setSessions([])
      }
    }
  }, [])

  // Refresh sessions when currentSessionId changes
  useEffect(() => {
    const stored = localStorage.getItem('hermes-sessions')
    if (stored) {
      try {
        setSessions(JSON.parse(stored))
      } catch {
        setSessions([])
      }
    }
  }, [currentSessionId])

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const updated = sessions.filter((s) => s.id !== id)
    setSessions(updated)
    localStorage.setItem('hermes-sessions', JSON.stringify(updated))
    localStorage.removeItem(`hermes-session-${id}`)

    if (currentSessionId === id) {
      onNewSession()
    }
  }

  return (
    <div className="w-64 bg-sidebar text-sidebar-heading flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <button
          onClick={onNewSession}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-sidebar-border hover:bg-sidebar-hover transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>新对话</span>
        </button>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto p-2">
        {sessions.length === 0 ? (
          <div className="text-center text-sidebar-text py-8 opacity-50">
            <MessageSquare className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">暂无对话</p>
          </div>
        ) : (
          <div className="space-y-1">
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => onSessionSelect(session.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors group ${
                  currentSessionId === session.id
                    ? 'bg-sidebar-active text-sidebar-heading'
                    : 'text-sidebar-text hover:bg-sidebar-hover'
                }`}
              >
                <MessageSquare className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 truncate text-sm">{session.title}</span>
                <button
                  onClick={(e) => handleDeleteSession(session.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-opacity"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border space-y-1">
        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-sidebar-hover transition-colors text-sidebar-text"
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4" />
          )}
          <span>{theme === 'light' ? '深色模式' : '浅色模式'}</span>
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-sidebar-hover transition-colors text-sidebar-text"
        >
          <Settings className="w-4 h-4" />
          <span>设置</span>
        </button>
      </div>
    </div>
  )
}
