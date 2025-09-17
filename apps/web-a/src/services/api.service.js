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
      throw error;
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