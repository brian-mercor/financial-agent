import { useEffect, useRef, useState } from 'react'
import { AlertCircle, TrendingUp } from 'lucide-react'

export function ChartRenderer({ chartHtml, symbol, height = '500px' }) {
  const containerRef = useRef(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const scriptLoadedRef = useRef(false)

  // Load TradingView script once globally
  useEffect(() => {
    if (window.TradingView) {
      scriptLoadedRef.current = true
      return
    }

    // Check if script is already in document
    const existingScript = document.querySelector('script[src*="tradingview.com/tv.js"]')
    if (existingScript) {
      // Wait for it to load
      existingScript.addEventListener('load', () => {
        scriptLoadedRef.current = true
      })
      return
    }

    // Load TradingView library
    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/tv.js'
    script.async = true
    script.onload = () => {
      scriptLoadedRef.current = true
      console.log('TradingView library loaded')
    }
    script.onerror = () => {
      console.error('Failed to load TradingView library')
    }
    document.head.appendChild(script)

    return () => {
      // Don't remove the script as it might be used by other charts
    }
  }, [])

  useEffect(() => {
    if (!chartHtml || !containerRef.current) {
      setIsLoading(false)
      return
    }

    const renderChart = () => {
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

        // Parse the HTML but don't include script tags yet
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = chartHtml

        // Extract scripts
        const scripts = Array.from(tempDiv.getElementsByTagName('script'))

        // Remove script tags from HTML
        scripts.forEach(script => script.remove())

        // Add the HTML without scripts
        chartContainer.innerHTML = tempDiv.innerHTML
        containerRef.current.appendChild(chartContainer)

        // Now execute the inline scripts (external script should already be loaded)
        scripts.forEach(script => {
          if (!script.src) {
            // Only execute inline scripts (widget initialization)
            try {
              // Wait a bit to ensure DOM is ready
              setTimeout(() => {
                if (window.TradingView) {
                  // Execute the script in the global context
                  const scriptContent = script.textContent || script.innerHTML
                  // Use Function constructor instead of eval for better error handling
                  const executeScript = new Function(scriptContent)
                  executeScript()
                } else {
                  console.error('TradingView not loaded yet')
                  setError('TradingView library not loaded. Please refresh.')
                }
              }, 100)
            } catch (err) {
              console.error('Error executing chart script:', err)
              setError('Failed to initialize chart')
            }
          }
        })

        // Set loading false after scripts execute
        setTimeout(() => setIsLoading(false), 500)

      } catch (err) {
        console.error('Error rendering chart:', err)
        setError('Failed to render chart')
        setIsLoading(false)
      }
    }

    // Check if TradingView is already loaded
    if (window.TradingView || scriptLoadedRef.current) {
      renderChart()
    } else {
      // Wait for TradingView to load
      const checkInterval = setInterval(() => {
        if (window.TradingView) {
          clearInterval(checkInterval)
          renderChart()
        }
      }, 100)

      // Timeout after 5 seconds
      const timeout = setTimeout(() => {
        clearInterval(checkInterval)
        if (!window.TradingView) {
          setError('TradingView library failed to load')
          setIsLoading(false)
        }
      }, 5000)

      return () => {
        clearInterval(checkInterval)
        clearTimeout(timeout)
      }
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
        <button
          onClick={() => window.location.reload()}
          className="mt-3 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm transition-colors"
        >
          Refresh Page
        </button>
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
      {symbol && !isLoading && (
        <div className="mt-2 text-xs text-muted text-center flex items-center justify-center gap-1">
          <TrendingUp className="w-3 h-3" />
          Interactive chart for {symbol}
        </div>
      )}
    </div>
  )
}