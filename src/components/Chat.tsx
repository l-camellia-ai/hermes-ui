import { useState, useRef, useEffect, useCallback } from 'react'
import { useSettings } from '@/hooks/useSettings'
import { HermesAPI } from '@/services/api'
import { Message, ToolCall } from '@/types'
import { MessageBubble } from './MessageBubble'
import { ToolCallDisplay } from './ToolCallDisplay'
import { Send, Paperclip, Loader2 } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'

interface ChatProps {
  sessionId: string | null
  onSessionCreated: (id: string) => void
}

export function Chat({ sessionId, onSessionCreated }: ChatProps) {
  const { settings } = useSettings()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentToolCall, setCurrentToolCall] = useState<ToolCall | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Load messages for session
  useEffect(() => {
    if (sessionId) {
      const stored = localStorage.getItem(`hermes-session-${sessionId}`)
      if (stored) {
        try {
          setMessages(JSON.parse(stored))
        } catch {
          setMessages([])
        }
      }
    } else {
      setMessages([])
    }
  }, [sessionId])

  // Save messages when they change
  useEffect(() => {
    if (sessionId && messages.length > 0) {
      localStorage.setItem(`hermes-session-${sessionId}`, JSON.stringify(messages))
    }
  }, [sessionId, messages])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, currentToolCall])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }, [input])

  const createNewSession = useCallback(() => {
    const id = uuidv4()
    const session = {
      id,
      title: '新对话',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messageCount: 0,
    }

    // Save session to list
    const sessions = JSON.parse(localStorage.getItem('hermes-sessions') || '[]')
    sessions.unshift(session)
    localStorage.setItem('hermes-sessions', JSON.stringify(sessions))

    onSessionCreated(id)
    return id
  }, [onSessionCreated])

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return

    const api = new HermesAPI(settings)
    const currentSessionId = sessionId || createNewSession()

    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    }

    const assistantMessage: Message = {
      id: uuidv4(),
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      isStreaming: true,
    }

    setMessages((prev) => [...prev, userMessage, assistantMessage])
    setInput('')
    setIsLoading(true)

    // Prepare messages for API
    const apiMessages = [...messages, userMessage].map((m) => ({
      role: m.role,
      content: m.content,
    }))

    let fullContent = ''

    await api.chat(
      apiMessages,
      // onChunk
      (chunk) => {
        fullContent += chunk
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessage.id
              ? { ...m, content: fullContent }
              : m
          )
        )
      },
      // onToolCall
      (tc) => {
        const toolCall: ToolCall = {
          id: tc.id,
          name: tc.name,
          args: JSON.parse(tc.args || '{}'),
          status: 'running',
        }
        setCurrentToolCall(toolCall)
      },
      // onDone
      () => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessage.id
              ? { ...m, isStreaming: false }
              : m
          )
        )
        setCurrentToolCall(null)
        setIsLoading(false)

        // Update session title if first message
        if (messages.length === 0) {
          const title = input.trim().slice(0, 50) + (input.trim().length > 50 ? '...' : '')
          const sessions = JSON.parse(localStorage.getItem('hermes-sessions') || '[]')
          const updated = sessions.map((s: { id: string }) =>
            s.id === currentSessionId ? { ...s, title, updatedAt: Date.now() } : s
          )
          localStorage.setItem('hermes-sessions', JSON.stringify(updated))
        }
      },
      // onError
      (error) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessage.id
              ? { ...m, content: `错误: ${error.message}`, isStreaming: false }
              : m
          )
        )
        setCurrentToolCall(null)
        setIsLoading(false)
      }
    )
  }, [input, isLoading, messages, sessionId, settings, createNewSession])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <div className="text-6xl mb-4">✦</div>
            <p className="text-lg font-medium">Hermes Agent</p>
            <p className="text-sm mt-1">发送消息开始对话</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}

        {/* Current Tool Call */}
        {currentToolCall && (
          <ToolCallDisplay toolCall={currentToolCall} />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t bg-white p-4">
        <div className="flex items-end gap-3 max-w-4xl mx-auto">
          <button
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
            title="添加附件"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入消息... (Shift+Enter 换行)"
              className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 pr-12 focus:outline-none focus:border-hermes-500 focus:ring-1 focus:ring-hermes-500 max-h-[200px]"
              rows={1}
              disabled={isLoading}
            />
          </div>

          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-3 rounded-xl bg-hermes-500 text-white hover:bg-hermes-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
