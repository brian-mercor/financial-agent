class ApiService {
  constructor() {
    this.baseUrl = '';
  }

  async sendMessage(message, assistantType = 'general', history = []) {
    try {
      // First try the streaming endpoint which has chart support
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
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      
      // Fallback to basic chat endpoint
      try {
        const fallbackResponse = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message,
            assistantType,
            history,
          }),
        });

        if (!fallbackResponse.ok) {
          throw new Error(`HTTP error! status: ${fallbackResponse.status}`);
        }

        return await fallbackResponse.json();
      } catch (fallbackError) {
        console.error('Fallback API Error:', fallbackError);
        throw fallbackError;
      }
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