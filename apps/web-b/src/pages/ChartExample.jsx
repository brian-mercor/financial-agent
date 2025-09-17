import { useState, useEffect } from 'react'
import ChartComponent from '../components/ChartComponent'

export default function ChartExample() {
  const [chartData, setChartData] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Monthly Sales',
        data: [12, 19, 3, 5, 2, 3],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1
      }
    ]
  })

  const chartOptions = {
    plugins: {
      title: {
        display: true,
        text: 'Monthly Sales Chart'
      },
      legend: {
        display: true,
        position: 'top'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }

  // Example of updating chart data
  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(prevData => ({
        ...prevData,
        datasets: [{
          ...prevData.datasets[0],
          data: prevData.datasets[0].data.map(() => 
            Math.floor(Math.random() * 20) + 1
          )
        }]
      }))
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Chart Example</h1>
      <div className="bg-white rounded-lg shadow p-4">
        <ChartComponent 
          type="line" 
          data={chartData} 
          options={chartOptions} 
        />
      </div>
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <p className="text-sm text-gray-700">
          This chart properly handles Chart.js lifecycle to avoid the "Canvas is already in use" error.
          The chart automatically updates every 5 seconds with new data.
        </p>
      </div>
    </div>
  )
}