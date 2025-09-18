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

      containerRef.current.innerHTML = ''

      const chartContainer = document.createElement('div')
      chartContainer.style.width = '100%'
      chartContainer.style.height = height
      chartContainer.style.position = 'relative'
      chartContainer.innerHTML = chartHtml

      containerRef.current.appendChild(chartContainer)

      const scripts = chartContainer.getElementsByTagName('script')
      const scriptArray = Array.from(scripts)

      // Separate external scripts from inline scripts
      const externalScripts = scriptArray.filter(s => s.src)
      const inlineScripts = scriptArray.filter(s => !s.src)

      // Load external scripts first
      let scriptsToLoad = externalScripts.length

      if (scriptsToLoad === 0) {
        // No external scripts, execute inline scripts immediately
        inlineScripts.forEach(script => {
          try {
            const newScript = document.createElement('script')
            newScript.textContent = script.textContent
            document.head.appendChild(newScript)
          } catch (err) {
            console.error('Error executing chart script:', err)
            setError('Failed to render chart')
          }
        })
        setIsLoading(false)
      } else {
        // Load external scripts first
        externalScripts.forEach(script => {
          // Check if TradingView is already loaded
          if (script.src.includes('tv.js') && window.TradingView) {
            scriptsToLoad--
            if (scriptsToLoad === 0) {
              // All external scripts loaded, execute inline scripts
              setTimeout(() => {
                inlineScripts.forEach(inlineScript => {
                  try {
                    const newScript = document.createElement('script')
                    newScript.textContent = inlineScript.textContent
                    document.head.appendChild(newScript)
                  } catch (err) {
                    console.error('Error executing chart script:', err)
                  }
                })
                setIsLoading(false)
              }, 100) // Small delay to ensure TradingView is fully initialized
            }
          } else {
            const newScript = document.createElement('script')
            newScript.src = script.src
            newScript.async = true
            newScript.onload = () => {
              scriptsToLoad--
              if (scriptsToLoad === 0) {
                // All external scripts loaded, execute inline scripts
                setTimeout(() => {
                  inlineScripts.forEach(inlineScript => {
                    try {
                      const newInlineScript = document.createElement('script')
                      newInlineScript.textContent = inlineScript.textContent
                      document.head.appendChild(newInlineScript)
                    } catch (err) {
                      console.error('Error executing chart script:', err)
                    }
                  })
                  setIsLoading(false)
                }, 100) // Small delay to ensure TradingView is fully initialized
              }
            }
            newScript.onerror = () => {
              setError('Failed to load TradingView library')
              setIsLoading(false)
            }
            document.head.appendChild(newScript)
          }
        })
      }

      const timeout = setTimeout(() => setIsLoading(false), 3000)
      return () => clearTimeout(timeout)

    } catch (err) {
      console.error('Error rendering chart:', err)
      setError('Failed to render chart')
      setIsLoading(false)
    }
  }, [chartHtml, height])

  if (!chartHtml) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600">No chart data available</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-red-700">
          <AlertCircle className="h-5 w-5" />
          <span className="font-medium">Chart Error</span>
        </div>
        <p className="text-red-600 mt-2">{error}</p>
      </div>
    )
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-lg">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent"></div>
            <span className="text-gray-600 text-sm">Loading chart...</span>
          </div>
        </div>
      )}
      <div
        ref={containerRef}
        className="w-full rounded-lg overflow-hidden bg-white"
        style={{ minHeight: height }}
      />
      {symbol && (
        <div className="mt-2 text-xs text-gray-500 text-center">
          Chart for {symbol}
        </div>
      )}
    </div>
  )
}