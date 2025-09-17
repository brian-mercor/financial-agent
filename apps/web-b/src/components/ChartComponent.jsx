import { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'

export default function ChartComponent({ data, options, type = 'line' }) {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    // Get canvas context
    const canvas = canvasRef.current
    if (!canvas) return

    // Destroy existing chart instance if it exists
    if (chartRef.current) {
      chartRef.current.destroy()
      chartRef.current = null
    }

    // Create new chart instance
    const ctx = canvas.getContext('2d')
    chartRef.current = new Chart(ctx, {
      type,
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        ...options
      }
    })

    // Cleanup function to destroy chart on unmount or re-render
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
        chartRef.current = null
      }
    }
  }, [data, options, type]) // Re-create chart when props change

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <canvas ref={canvasRef} id="chart-canvas"></canvas>
    </div>
  )
}