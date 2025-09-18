import { useEffect, useRef, useState } from 'react'
import { AlertCircle, TrendingUp } from 'lucide-react'

export function ChartRenderer({ chartHtml, symbol, height = '500px' }) {
  const containerRef = useRef(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!chartHtml || !containerRef.current) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // Clear previous content
      containerRef.current.innerHTML = ''

      // Create isolated container for chart
      const chartContainer = document.createElement('div')
      chartContainer.style.width = '100%'
      chartContainer.style.height = height
      chartContainer.style.position = 'relative'
      chartContainer.innerHTML = chartHtml

      // Append to container
      containerRef.current.appendChild(chartContainer)

      // Execute any inline scripts
      const scripts = chartContainer.getElementsByTagName('script')
      Array.from(scripts).forEach(script => {
        if (script.src) {
          // External script
          const newScript = document.createElement('script')
          newScript.src = script.src
          newScript.async = true
          newScript.onload = () => setIsLoading(false)
          newScript.onerror = () => {
            setError('Failed to load TradingView library')
            setIsLoading(false)
          }
          document.head.appendChild(newScript)
        } else {
          // Inline script
          try {
            const newScript = document.createElement('script')
            newScript.textContent = script.textContent
            document.head.appendChild(newScript)
            setIsLoading(false)
          } catch (err) {
            console.error('Error executing chart script:', err)
            setError('Failed to render chart')
            setIsLoading(false)
          }
        }
      })

      // Set loading false after a timeout if scripts don't report back
      const timeout = setTimeout(() => setIsLoading(false), 3000)
      return () => clearTimeout(timeout)

    } catch (err) {
      console.error('Error rendering chart:', err)
      setError('Failed to render chart')
      setIsLoading(false)
    }
  }, [chartHtml, height])

  if (!chartHtml) {
    return null
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 mt-4">
        <div className="flex items-center gap-2 text-red-400">
          <AlertCircle className="w-5 h-5" />
          <span className="font-medium">Chart Error</span>
        </div>
        <p className="text-red-300 mt-2 text-sm">{error}</p>
      </div>
    )
  }

  return (
    <div className="relative mt-4">
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 rounded-xl">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent"></div>
            <span className="text-white text-sm">Loading chart...</span>
          </div>
        </div>
      )}
      <div
        ref={containerRef}
        className="w-full rounded-xl overflow-hidden"
        style={{ minHeight: height }}
      />
      {symbol && (
        <div className="mt-2 text-xs text-muted text-center">
          Interactive chart for {symbol}
        </div>
      )}
    </div>
  )
}