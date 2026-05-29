import { useState, useEffect } from 'react'
import { useSettings } from '@/hooks/useSettings'
import { HermesAPI } from '@/services/api'
import { X, Check, Loader2, AlertCircle } from 'lucide-react'

interface SettingsProps {
  onClose: () => void
}

export function Settings({ onClose }: SettingsProps) {
  const { settings, updateSettings } = useSettings()
  const [apiUrl, setApiUrl] = useState(settings.apiUrl)
  const [apiKey, setApiKey] = useState(settings.apiKey)
  const [model, setModel] = useState(settings.model || '')
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null)
  const [models, setModels] = useState<string[]>([])

  // Load models when URL changes
  useEffect(() => {
    if (apiUrl) {
      const api = new HermesAPI({ apiUrl, apiKey, model })
      api.getModels().then(setModels).catch(() => setModels([]))
    }
  }, [apiUrl, apiKey])

  const handleTest = async () => {
    setTesting(true)
    setTestResult(null)

    const api = new HermesAPI({ apiUrl, apiKey, model })
    const success = await api.testConnection()

    setTestResult(success ? 'success' : 'error')
    setTesting(false)
  }

  const handleSave = () => {
    updateSettings({
      apiUrl: apiUrl.trim(),
      apiKey: apiKey.trim(),
      model: model.trim() || undefined,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">设置</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-4">
          {/* API URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API 地址
            </label>
            <input
              type="url"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="http://localhost:8080"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-hermes-500 focus:ring-1 focus:ring-hermes-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Hermes Gateway API Server 地址
            </p>
          </div>

          {/* API Key */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="可选，localhost 免认证"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-hermes-500 focus:ring-1 focus:ring-hermes-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              留空则使用免认证模式（仅限 localhost）
            </p>
          </div>

          {/* Model */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              模型
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-hermes-500 focus:ring-1 focus:ring-hermes-500"
            >
              <option value="">使用默认模型</option>
              {models.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Test Connection */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleTest}
              disabled={!apiUrl || testing}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {testing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                '测试连接'
              )}
            </button>

            {testResult === 'success' && (
              <div className="flex items-center gap-1 text-sm text-hermes-600">
                <Check className="w-4 h-4" />
                连接成功
              </div>
            )}

            {testResult === 'error' && (
              <div className="flex items-center gap-1 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                连接失败
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            disabled={!apiUrl.trim()}
            className="px-4 py-2 bg-hermes-500 text-white rounded-lg hover:bg-hermes-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  )
}
