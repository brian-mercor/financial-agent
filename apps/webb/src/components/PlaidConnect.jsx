import React, { useCallback, useEffect, useState } from 'react'
import { usePlaidLink } from 'react-plaid-link'

export function PlaidConnect({ onSuccess, onExit }) {
  const [token, setToken] = useState(null)

  useEffect(() => {
    // In production, fetch this from your backend
    const fetchLinkToken = async () => {
      try {
        // Simulated token for development
        // Replace with actual API call to your backend
        const mockToken = 'link-development-token'
        setToken(mockToken)
      } catch (error) {
        console.error('Error fetching link token:', error)
      }
    }
    fetchLinkToken()
  }, [])

  const onSuccessCallback = useCallback((publicToken, metadata) => {
    // Send public token to backend to exchange for access token
    console.log('Plaid connection successful:', { publicToken, metadata })
    onSuccess?.(publicToken, metadata)
  }, [onSuccess])

  const config = {
    token,
    onSuccess: onSuccessCallback,
    onExit: onExit || (() => {}),
  }

  const { open, ready } = usePlaidLink(config)

  if (!token) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
        <p className="text-sm text-gray-500 mt-2">Loading...</p>
      </div>
    )
  }

  return (
    <button
      onClick={() => open()}
      disabled={!ready}
      className="w-full gradient-bg text-white px-4 py-3 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Connect Bank Account
    </button>
  )
}