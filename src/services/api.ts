import { Settings, ChatCompletionRequest, StreamChunk } from '@/types'

export class HermesAPI {
  private apiUrl: string
  private apiKey: string
  private model: string

  constructor(settings: Settings) {
    this.apiUrl = settings.apiUrl.replace(/\/$/, '')
    this.apiKey = settings.apiKey
    this.model = settings.model || 'hermes'
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`
    }
    return headers
  }

  async chat(
    messages: { role: string; content: string }[],
    onChunk: (chunk: string) => void,
    onToolCall?: (toolCall: { id: string; name: string; args: string }) => void,
    onDone?: () => void,
    onError?: (error: Error) => void
  ): Promise<void> {
    const request: ChatCompletionRequest = {
      model: this.model,
      messages,
      stream: true,
    }

    try {
      const response = await fetch(`${this.apiUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`API error: ${response.status} - ${error}`)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No response body')
      }

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed || trimmed === 'data: [DONE]') continue
          if (!trimmed.startsWith('data: ')) continue

          try {
            const data: StreamChunk = JSON.parse(trimmed.slice(6))
            const delta = data.choices[0]?.delta

            if (delta?.content) {
              onChunk(delta.content)
            }

            if (delta?.tool_calls) {
              for (const tc of delta.tool_calls) {
                if (tc.function?.name) {
                  onToolCall?.({
                    id: tc.id || '',
                    name: tc.function.name,
                    args: tc.function.arguments || '',
                  })
                }
              }
            }
          } catch (e) {
            console.error('Failed to parse chunk:', e)
          }
        }
      }

      onDone?.()
    } catch (error) {
      onError?.(error as Error)
    }
  }

  async getModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.apiUrl}/v1/models`, {
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        return []
      }

      const data = await response.json()
      return data.data?.map((m: { id: string }) => m.id) || []
    } catch {
      return []
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/v1/models`, {
        headers: this.getHeaders(),
        signal: AbortSignal.timeout(5000),
      })
      return response.ok
    } catch {
      return false
    }
  }
}
