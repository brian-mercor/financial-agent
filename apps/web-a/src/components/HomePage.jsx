import React, { useState } from 'react'
import { AssistantSelector, assistantProfiles } from './AssistantSelector'
import { SmartChatInterface } from './SmartChatInterface'
import { PlaidConnect } from './PlaidConnect'
import { AuthForm } from './AuthForm'
import { useAuth } from '../contexts/AuthContext'
import { TrendingUp, Menu, X, Settings, LogOut, CreditCard, BarChart3, Shield } from 'lucide-react'

export function HomePage() {
  const [selectedAssistant, setSelectedAssistant] = useState(assistantProfiles[0])
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [showPlaidConnect, setShowPlaidConnect] = useState(false)
  const { user, loading, signOut } = useAuth()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading your experience...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <AuthForm />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-white border-r border-gray-200 overflow-hidden shadow-xl`}>
        <div className="p-6 h-full overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="gradient-bg p-2 rounded-xl">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold gradient-text">Fin Agent</h1>
          </div>

          {/* User Info */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
            <p className="text-sm text-gray-600">Welcome back</p>
            <p className="text-sm font-semibold text-gray-900 truncate">{user.email}</p>
          </div>

          {/* Assistant Selector */}
          <div className="mb-6">
            <label className="text-sm font-semibold text-gray-700 mb-3 block">
              AI Assistant
            </label>
            <AssistantSelector
              selectedAssistant={selectedAssistant}
              onSelectAssistant={setSelectedAssistant}
            />
          </div>

          {/* Bank Connection */}
          <div className="mb-6">
            <label className="text-sm font-semibold text-gray-700 mb-3 block">
              Bank Connection
            </label>
            {showPlaidConnect ? (
              <PlaidConnect
                onSuccess={() => {
                  setShowPlaidConnect(false)
                }}
                onExit={() => setShowPlaidConnect(false)}
              />
            ) : (
              <button
                onClick={() => setShowPlaidConnect(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-blue-200 rounded-xl hover:bg-blue-50 transition shadow-sm hover:shadow-md"
              >
                <CreditCard className="h-4 w-4 text-blue-700" />
                <span className="font-medium text-gray-900">Manage Accounts</span>
              </button>
            )}
          </div>

          {/* Portfolio Summary Card */}
          <div className="mb-6 p-5 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl text-white shadow-lg">
            <h3 className="text-sm font-semibold opacity-90 mb-4">Portfolio Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm opacity-80">Total Value</span>
                <span className="text-xl font-bold">$0.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm opacity-80">Today's Change</span>
                <span className="text-lg font-semibold text-green-300">+0.00%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm opacity-80">Active Accounts</span>
                <span className="text-lg font-semibold">0</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 transition group">
              <BarChart3 className="h-5 w-5 text-blue-700 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-gray-700">Analytics</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 transition group">
              <Shield className="h-5 w-5 text-blue-700 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-gray-700">Security</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 transition group">
              <Settings className="h-5 w-5 text-blue-700 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-gray-700">Settings</span>
            </button>
            <button
              onClick={() => signOut()}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition group"
            >
              <LogOut className="h-5 w-5 text-red-600 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-gray-700">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg hover:bg-blue-50 transition"
              >
                {isSidebarOpen ? (
                  <X className="h-5 w-5 text-gray-600" />
                ) : (
                  <Menu className="h-5 w-5 text-gray-600" />
                )}
              </button>
              <div>
                <h2 className="text-xl font-bold gradient-text">{selectedAssistant.name}</h2>
                <p className="text-sm text-gray-600">
                  {selectedAssistant.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className={`h-3 w-3 rounded-full ${selectedAssistant.color} animate-pulse`} />
                <div className={`absolute inset-0 h-3 w-3 rounded-full ${selectedAssistant.color} blur-sm`} />
              </div>
              <span className="text-sm font-medium text-gray-600">Online</span>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 overflow-hidden">
          <SmartChatInterface assistant={selectedAssistant} />
        </div>
      </div>
    </div>
  )
}