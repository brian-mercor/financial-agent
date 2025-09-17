import { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'

export default function useChart(config) {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy()
      chartInstance.current = null
    }

    // Create new chart
    const ctx = chartRef.current.getContext('2d')
    chartInstance.current = new Chart(ctx, config)

    // Cleanup on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
        chartInstance.current = null
      }
    }
  }, [config])

  // Update chart data
  const updateChart = (newData) => {
    if (chartInstance.current) {
      chartInstance.current.data = newData
      chartInstance.current.update()
    }
  }

  return { chartRef, updateChart, chartInstance: chartInstance.current }
}