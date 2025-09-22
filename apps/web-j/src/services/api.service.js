class ApiService {
  constructor() {
    this.baseUrl = '';
  }

  async sendMessage(message, assistantType = 'general', history = []) {
    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          assistantType,
          history,
          userId: `user-${Date.now()}`,
          context: {
            symbols: [],
            timeframe: '1d',
            riskTolerance: 'moderate',
          },
          stream: false
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);

      // MOCK: Fallback to mock response when backend is not available
      console.warn('Backend not available, using mock response');
      return {
        traceId: `mock-${Date.now()}`,
        response: `MOCK RESPONSE: The backend service is currently not available. This is a mock response for "${message}". Please ensure the backend is running on http://localhost:3000 to get real AI responses.`,
        assistantType,
        llmProvider: 'mock',
        model: 'mock-model'
      };
    }
  }

  async streamMessage(message, assistantType = 'general', history = [], onChunk) {
    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          assistantType,
          history,
          userId: `user-${Date.now()}`,
          context: {
            symbols: [],
            timeframe: '1d',
            riskTolerance: 'moderate',
          },
          stream: true
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') return;
            try {
              const parsed = JSON.parse(data);
              onChunk(parsed);
            } catch (e) {
              console.error('Failed to parse SSE data:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Stream Error:', error);

      // MOCK: Fallback to mock response when backend is not available
      console.warn('Backend not available, using mock response');

      // Simulate streaming with a mock response
      const mockResponse = `MOCK RESPONSE: The backend service is currently not available. This is a mock response for "${message}". Please ensure the backend is running on http://localhost:3000 to get real AI responses.`;

      // Simulate chunked streaming
      const words = mockResponse.split(' ');
      for (const word of words) {
        await new Promise(resolve => setTimeout(resolve, 50)); // Simulate delay
        onChunk(word + ' ');
      }

      // Return complete response
      return {
        traceId: `mock-${Date.now()}`,
        response: mockResponse,
        assistantType,
        llmProvider: 'mock',
        model: 'mock-model'
      };
    }
  }

  async getWorkflowStatus(workflowId) {
    try {
      const response = await fetch(`/api/workflow/${workflowId}/status`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Workflow status error:', error);
      throw error;
    }
  }
}

export default new ApiService();