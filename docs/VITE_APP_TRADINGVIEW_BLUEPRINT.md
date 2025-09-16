# Blueprint: TradingView Integration for Vite Apps

## Overview
This blueprint provides a standardized approach for integrating TradingView charts and financial data into Vite-based React applications. It ensures consistency across multiple themed Vite apps while maintaining compatibility with the backend services.

## Architecture

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   Vite App       │────▶│  API Proxy       │────▶│   Backend        │
│  (localhost:5174)│     │  (/api/*)       │     │ (localhost:3000) │
└──────────────────┘     └──────────────────┘     └──────────────────┘
        │                                                   │
        │                                                   ▼
        ▼                                          ┌──────────────────┐
┌──────────────────┐                              │  Chart Service   │
│ TradingView      │◀──────────────────────────────│  (generates HTML)│
│ Widget Scripts   │                              └──────────────────┘
└──────────────────┘
```

## Core Components

### 1. API Service Layer (`src/services/api.service.js`)
- Centralized API communication
- Handles chart requests and responses
- Manages authentication headers
- Error handling and retry logic

### 2. Smart Chat Interface (`src/components/SmartChatInterface.jsx`)
- Message handling
- Chart rendering container
- Dynamic script injection for TradingView widgets
- Response parsing and display

### 3. Vite Configuration (`vite.config.js`)
- API proxy setup
- CSP headers configuration
- Environment variable mapping
- Development server settings

### 4. Chart Renderer Component (`src/components/ChartRenderer.jsx`)
- Isolated chart rendering
- Script lifecycle management
- Error boundary for widget failures
- Loading states

## Implementation Steps

### Step 1: Configure Vite Proxy
```javascript
// vite.config.js
export default defineConfig({
  server: {
    proxy: {
      '/api/chat': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/chat/, '/api/chat/stream')
      },
      '/api/assistant': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    },
    headers: {
      'Content-Security-Policy': "default-src 'self' https://*.tradingview.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.tradingview.com https://s3.tradingview.com; style-src 'self' 'unsafe-inline' https://*.tradingview.com; frame-src https://*.tradingview.com; img-src 'self' data: https://*.tradingview.com; connect-src 'self' https://*.tradingview.com wss://*.tradingview.com;"
    }
  }
})
```

### Step 2: Create API Service
```javascript
// src/services/api.service.js
class ApiService {
  async sendMessage(message, context) {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, ...context })
    });
    return response.json();
  }
}
```

### Step 3: Chart Renderer Component
```javascript
// src/components/ChartRenderer.jsx
const ChartRenderer = ({ chartHtml, symbol }) => {
  useEffect(() => {
    if (chartHtml) {
      // Parse and inject scripts
      const container = document.getElementById(`chart-${symbol}`);
      if (container) {
        container.innerHTML = chartHtml;
        executeScripts(container);
      }
    }
  }, [chartHtml]);
  
  return <div id={`chart-${symbol}`} />;
};
```

### Step 4: Update Chat Interface
```javascript
// src/components/SmartChatInterface.jsx
const SmartChatInterface = () => {
  const handleMessage = async (message) => {
    const response = await apiService.sendMessage(message);
    if (response.chartHtml) {
      // Render chart
      setMessages(prev => [...prev, {
        ...response,
        hasChart: true
      }]);
    }
  };
};
```

## Security Considerations

### Content Security Policy (CSP)
- Allow TradingView domains
- Enable unsafe-inline for TradingView widgets
- Restrict other script sources

### Script Execution
- Sanitize chart HTML before rendering
- Use controlled script execution
- Implement error boundaries

### API Security
- Use authentication tokens
- Implement rate limiting
- Validate symbol inputs

## Testing Strategy

### Unit Tests
- API service methods
- Chart renderer component
- Message parsing logic

### Integration Tests
- End-to-end chat flow
- Chart loading scenarios
- Error handling

### Visual Tests
- Chart rendering across themes
- Responsive design
- Loading states

## Deployment Checklist

- [ ] Configure production API endpoints
- [ ] Set up environment variables
- [ ] Update CSP for production domains
- [ ] Enable HTTPS for production
- [ ] Configure CORS settings
- [ ] Set up monitoring and logging
- [ ] Test on multiple browsers
- [ ] Verify mobile responsiveness

## Common Issues & Solutions

### Issue: TradingView scripts blocked by CSP
**Solution**: Update CSP headers in vite.config.js

### Issue: Charts not rendering
**Solution**: Ensure script execution after DOM update

### Issue: Multiple charts interfering
**Solution**: Use unique container IDs per chart

### Issue: API timeout on chart requests
**Solution**: Implement retry logic with exponential backoff

## Reusability Guidelines

### For New Vite Apps
1. Copy core service files
2. Update theme variables
3. Configure API endpoints
4. Customize UI components
5. Test integration

### Shared Components Library
Consider creating a shared npm package:
```
@finagent/chart-components
├── ChartRenderer
├── ApiService
├── useChart hook
└── utils/
```

## Monitoring & Analytics

### Track Key Metrics
- Chart load time
- API response time
- Error rates
- User interactions

### Logging
- Chart requests
- API errors
- Widget initialization
- Performance metrics

## Future Enhancements

1. **WebSocket Support**: Real-time chart updates
2. **Offline Mode**: Cache charts for offline viewing
3. **Custom Indicators**: User-defined technical indicators
4. **Multi-Chart Layout**: Support multiple charts simultaneously
5. **Export Functionality**: Save charts as images/PDF
6. **Annotation Tools**: Drawing tools integration
7. **Mobile Optimization**: Touch-friendly interface
8. **Theme Customization**: User-defined chart themes

## Resources

- [TradingView Widget Documentation](https://www.tradingview.com/widget/)
- [Vite Configuration Guide](https://vitejs.dev/config/)
- [React Best Practices](https://react.dev/learn)
- [CSP Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

## Version History

- v1.0.0 - Initial blueprint
- v1.1.0 - Added CSP configuration
- v1.2.0 - Enhanced error handling

---

**Note**: This blueprint should be reviewed and updated quarterly to ensure compatibility with latest TradingView API changes and security best practices.