import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Monitor,
  MessageSquare,
  Palette,
  Bell,
  Shield,
  RotateCcw,
  Check,
  Layout,
  FileText,
  Moon,
  Sun,
  Zap,
  Clock,
  Minimize2,
  BarChart
} from 'lucide-react'
import { useSettings } from '../contexts/SettingsContext'
import { useAuth } from '../contexts/AuthContext'

export default function SettingsPage() {
  const navigate = useNavigate()
  const { settings, updateSetting, resetSettings } = useSettings()
  const { user } = useAuth()
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState('display')

  const handleSettingChange = (key, value) => {
    updateSetting(key, value)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const tabs = [
    { id: 'display', label: 'Display', icon: Monitor },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'advanced', label: 'Advanced', icon: Shield },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-bold">Settings</h1>
            </div>
            {saved && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg animate-fade-in">
                <Check className="h-4 w-4" />
                <span className="text-sm font-medium">Settings saved</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="space-y-1">
                {tabs.map(tab => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  )
                })}
              </div>

              <div className="mt-6 pt-6 border-t">
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to reset all settings to defaults?')) {
                      resetSettings()
                      setSaved(true)
                      setTimeout(() => setSaved(false), 2000)
                    }
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <RotateCcw className="h-5 w-5" />
                  <span className="font-medium">Reset to Defaults</span>
                </button>
              </div>
            </div>

            {/* User Info */}
            <div className="mt-6 bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-500">Logged in as</p>
              <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow">
              {activeTab === 'display' && (
                <div className="p-6 space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold mb-4">Display Settings</h2>
                    <p className="text-sm text-gray-600 mb-6">
                      Customize how the chat interface is displayed
                    </p>
                  </div>

                  {/* View Mode Setting */}
                  <div className="pb-6 border-b">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <Layout className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-gray-900">View Mode</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Choose between classic chat or split report view
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="ml-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        onClick={() => handleSettingChange('viewMode', 'classic')}
                        className={`p-4 rounded-lg border-2 transition ${
                          settings.viewMode === 'classic'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <MessageSquare className="h-5 w-5 text-gray-600" />
                          <div className="text-left">
                            <p className="font-medium">Classic Chat</p>
                            <p className="text-xs text-gray-500">Traditional message bubbles</p>
                          </div>
                        </div>
                      </button>
                      <button
                        onClick={() => handleSettingChange('viewMode', 'split')}
                        className={`p-4 rounded-lg border-2 transition ${
                          settings.viewMode === 'split'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Layout className="h-5 w-5 text-gray-600" />
                          <div className="text-left">
                            <p className="font-medium">Split View</p>
                            <p className="text-xs text-gray-500">Reports left, chat right (Desktop)</p>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Response Style Setting */}
                  <div className="pb-6 border-b">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-gray-900">Response Style</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Choose how AI responses are formatted
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="ml-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        onClick={() => handleSettingChange('responseStyle', 'conversational')}
                        className={`p-4 rounded-lg border-2 transition ${
                          settings.responseStyle === 'conversational'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <MessageSquare className="h-5 w-5 text-gray-600" />
                          <div className="text-left">
                            <p className="font-medium">Conversational</p>
                            <p className="text-xs text-gray-500">Brief, natural responses</p>
                          </div>
                        </div>
                      </button>
                      <button
                        onClick={() => handleSettingChange('responseStyle', 'report')}
                        className={`p-4 rounded-lg border-2 transition ${
                          settings.responseStyle === 'report'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-600" />
                          <div className="text-left">
                            <p className="font-medium">Report Style</p>
                            <p className="text-xs text-gray-500">Detailed, structured analysis</p>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Compact Mode */}
                  <div>
                    <label className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-start gap-3">
                        <Minimize2 className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-gray-900">Compact Mode</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Reduce spacing and use smaller text
                          </p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.compactMode}
                        onChange={(e) => handleSettingChange('compactMode', e.target.checked)}
                        className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 'chat' && (
                <div className="p-6 space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold mb-4">Chat Settings</h2>
                    <p className="text-sm text-gray-600 mb-6">
                      Configure chat behavior and features
                    </p>
                  </div>

                  {/* Streaming */}
                  <div className="pb-6 border-b">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-start gap-3">
                        <Zap className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-gray-900">Enable Streaming</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Show AI responses as they're generated
                          </p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.streamingEnabled}
                        onChange={(e) => handleSettingChange('streamingEnabled', e.target.checked)}
                        className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </label>
                  </div>

                  {/* Timestamps */}
                  <div className="pb-6 border-b">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-gray-900">Show Timestamps</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Display time for each message
                          </p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.showTimestamps}
                        onChange={(e) => handleSettingChange('showTimestamps', e.target.checked)}
                        className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </label>
                  </div>

                  {/* Auto-select Reports */}
                  <div className="pb-6 border-b">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-start gap-3">
                        <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-gray-900">Auto-select Latest Report</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Automatically display newest report in split view
                          </p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.autoSelectLatestReport}
                        onChange={(e) => handleSettingChange('autoSelectLatestReport', e.target.checked)}
                        className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </label>
                  </div>

                  {/* Charts */}
                  <div>
                    <label className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-start gap-3">
                        <BarChart className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-gray-900">Enable Charts</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Show TradingView charts when available
                          </p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.enableCharts}
                        onChange={(e) => handleSettingChange('enableCharts', e.target.checked)}
                        className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="p-6 space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold mb-4">Appearance</h2>
                    <p className="text-sm text-gray-600 mb-6">
                      Personalize the look and feel
                    </p>
                  </div>

                  {/* Dark Mode */}
                  <div className="pb-6 border-b">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-start gap-3">
                        {settings.darkMode ? (
                          <Moon className="h-5 w-5 text-gray-400 mt-0.5" />
                        ) : (
                          <Sun className="h-5 w-5 text-gray-400 mt-0.5" />
                        )}
                        <div>
                          <h3 className="font-medium text-gray-900">Dark Mode</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Use dark theme (Coming soon)
                          </p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.darkMode}
                        onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
                        className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                        disabled
                      />
                    </label>
                  </div>

                  {/* Color Theme */}
                  <div>
                    <div className="flex items-start gap-3 mb-4">
                      <Palette className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-gray-900">Color Theme</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Choose your preferred accent color
                        </p>
                      </div>
                    </div>
                    <div className="ml-8 grid grid-cols-4 gap-3">
                      {[
                        { id: 'blue', color: 'bg-blue-600' },
                        { id: 'purple', color: 'bg-purple-600' },
                        { id: 'green', color: 'bg-green-600' },
                        { id: 'red', color: 'bg-red-600' },
                      ].map(theme => (
                        <button
                          key={theme.id}
                          onClick={() => handleSettingChange('colorTheme', theme.id)}
                          className={`p-3 rounded-lg border-2 transition ${
                            settings.colorTheme === theme.id
                              ? 'border-gray-900'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className={`w-full h-8 rounded ${theme.color}`} />
                          <p className="text-xs mt-2 capitalize">{theme.id}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'advanced' && (
                <div className="p-6 space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold mb-4">Advanced Settings</h2>
                    <p className="text-sm text-gray-600 mb-6">
                      Advanced configuration options
                    </p>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      More advanced settings coming soon...
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}