# Chart.js Canvas Reuse Error Fix

## Problem
The error "Canvas is already in use. Chart with ID '0' must be destroyed before the canvas with ID 'chart' can be reused" occurs when Chart.js tries to create a new chart on a canvas element that already has an active chart instance.

## Root Cause
This typically happens when:
1. A component re-renders without properly destroying the previous Chart instance
2. Multiple Chart instances try to use the same canvas element
3. The chart is not properly cleaned up when the component unmounts

## Solution

### 1. Use the ChartComponent Wrapper
Use the provided `ChartComponent` that properly handles Chart.js lifecycle:

```jsx
import ChartComponent from '../components/ChartComponent'

function MyComponent() {
  const data = {
    labels: ['Jan', 'Feb', 'Mar'],
    datasets: [{
      label: 'Sales',
      data: [10, 20, 30]
    }]
  }

  return <ChartComponent type="line" data={data} options={{}} />
}
```

### 2. Manual Chart Management
If you need to manage Chart.js directly, follow this pattern:

```jsx
import { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'

function MyChart() {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    // Destroy existing chart
    if (chartRef.current) {
      chartRef.current.destroy()
    }

    // Create new chart
    const ctx = canvasRef.current.getContext('2d')
    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: {...},
      options: {...}
    })

    // Cleanup on unmount
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
      }
    }
  }, []) // Add dependencies as needed

  return <canvas ref={canvasRef} />
}
```

### 3. Key Points to Remember
- **Always destroy** the previous chart instance before creating a new one
- **Use unique canvas IDs** if you have multiple charts
- **Clean up on unmount** using the useEffect cleanup function
- **Store chart instance** in a ref to persist across renders
- **Don't use** document.getElementById to get canvas - use React refs instead

### 4. Common Mistakes to Avoid
❌ Creating charts without cleanup:
```jsx
// BAD - Creates multiple chart instances
useEffect(() => {
  new Chart(canvas, config) // No cleanup!
})
```

❌ Using the same canvas ID for multiple charts:
```jsx
// BAD - Multiple charts with same ID
<canvas id="chart" />
<canvas id="chart" /> // Duplicate ID!
```

✅ Correct approach:
```jsx
// GOOD - Proper lifecycle management
useEffect(() => {
  const chart = new Chart(canvas, config)
  return () => chart.destroy() // Cleanup!
}, [])
```

## Testing
To verify the fix works:
1. Navigate to the page with the chart
2. The chart should render without errors
3. Navigate away and back - no errors should appear
4. Check console for any Canvas reuse warnings

## Files Created
- `/src/components/ChartComponent.jsx` - Reusable Chart.js wrapper component
- `/src/hooks/useChart.js` - Custom hook for Chart.js management
- `/src/pages/ChartExample.jsx` - Example implementation