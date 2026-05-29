import { ToolCall } from '@/types'
import { Loader2, CheckCircle, XCircle, Terminal, Globe, FileCode } from 'lucide-react'

interface ToolCallDisplayProps {
  toolCall: ToolCall
}

const toolIcons: Record<string, typeof Terminal> = {
  terminal: Terminal,
  web_search: Globe,
  web_extract: Globe,
  read_file: FileCode,
  write_file: FileCode,
}

export function ToolCallDisplay({ toolCall }: ToolCallDisplayProps) {
  const Icon = toolIcons[toolCall.name] || Terminal

  const statusIcon = {
    pending: <Loader2 className="w-4 h-4 animate-spin text-content-tertiary" />,
    running: <Loader2 className="w-4 h-4 animate-spin text-hermes-500" />,
    completed: <CheckCircle className="w-4 h-4 text-hermes-500" />,
    error: <XCircle className="w-4 h-4 text-red-500" />,
  }

  const statusText = {
    pending: '等待中',
    running: '执行中',
    completed: '完成',
    error: '错误',
  }

  return (
    <div className="flex items-start gap-3 ml-11">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-surface-tertiary flex items-center justify-center">
        <Icon className="w-4 h-4 text-content-secondary" />
      </div>

      <div className="flex-1 bg-surface-secondary rounded-lg p-3 border border-edge-primary">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm text-content-secondary">
            {toolCall.name}
          </span>
          {statusIcon[toolCall.status]}
          <span className="text-xs text-content-tertiary">
            {statusText[toolCall.status]}
          </span>
        </div>

        {Object.keys(toolCall.args).length > 0 && (
          <div className="text-xs text-content-secondary font-mono bg-surface-primary p-2 rounded mt-2 overflow-x-auto">
            {Object.entries(toolCall.args).map(([key, value]) => (
              <div key={key}>
                <span className="text-content-tertiary">{key}:</span>{' '}
                <span className="text-content-primary">
                  {typeof value === 'string' ? value : JSON.stringify(value)}
                </span>
              </div>
            ))}
          </div>
        )}

        {toolCall.result && (
          <div className="text-xs text-content-secondary font-mono bg-surface-primary p-2 rounded mt-2 overflow-x-auto max-h-40 overflow-y-auto">
            <pre>{toolCall.result}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
