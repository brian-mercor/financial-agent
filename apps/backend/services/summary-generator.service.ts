import { groqService } from './groq.service';
import { azureOpenAI } from './azure-openai.service';

export interface AgentResult {
  agent: string;
  task: string;
  result: string;
  completedAt?: string;
}

export class SummaryGeneratorService {
  static async generateExecutiveSummary(
    results: AgentResult[],
    userMessage: string
  ): Promise<string> {
    // Prepare the context from all agent results
    const agentInsights = results.map(r => 
      `${r.agent.toUpperCase()} ANALYSIS:\n${r.result}\n`
    ).join('\n---\n\n');

    const summaryPrompt = `You are an executive financial advisor tasked with synthesizing insights from multiple expert analysts.

Based on the following multi-agent analysis for the user's request: "${userMessage}"

${agentInsights}

Please provide a comprehensive EXECUTIVE SUMMARY that:

1. **Synthesizes Key Findings**: Identify the most important insights across all agents
2. **Highlights Consensus**: Where do the agents agree?
3. **Notes Divergence**: Where do they have different perspectives?
4. **Prioritizes Actions**: What are the top 3-5 actions the user should take?
5. **Risk Assessment**: Overall risk level and main concerns
6. **Opportunity Assessment**: Key opportunities identified
7. **Timeline**: Immediate vs short-term vs long-term recommendations

Format your response as a structured executive summary with clear sections and bullet points.
Use markdown formatting with headers, bold text for emphasis, and tables where appropriate.
Make it actionable and easy to understand for decision-making.`;

    try {
      // Try Azure model-router first (most reliable)
      if (azureOpenAI.isConfigured()) {
        const completion = await azureOpenAI.createChatCompletion({
          model: 'model-router',
          messages: [
            { role: 'system', content: summaryPrompt },
            { role: 'user', content: 'Generate the executive summary based on the multi-agent analysis.' }
          ],
          temperature: 0.7,
          max_tokens: 2000,
        });

        return this.formatExecutiveSummary(
          completion.choices[0]?.message?.content || 'Unable to generate summary'
        );
      }

      // Fallback to Groq if Azure is not available
      if (groqService.isConfigured()) {
        const completion = await groqService.createChatCompletion({
          messages: [
            { role: 'system', content: summaryPrompt },
            { role: 'user', content: 'Generate the executive summary based on the multi-agent analysis.' }
          ],
          model: 'llama-3.3-70b-versatile',
          temperature: 0.7,
          max_tokens: 2000,
        });

        if ('choices' in completion) {
          return this.formatExecutiveSummary(
            completion.choices[0]?.message?.content || 'Unable to generate summary'
          );
        }
      }

      // No LLM configured - return error message with configured status
      const azureConfigured = azureOpenAI.isConfigured();
      const groqConfigured = groqService.isConfigured();

      console.error('Unable to generate executive summary: No LLM provider configured', {
        azureConfigured,
        groqConfigured
      });

      return `
# ⚠️ **EXECUTIVE SUMMARY UNAVAILABLE**

Unable to connect to AI model for executive summary generation.

## Configuration Status:
- **Azure OpenAI**: ${azureConfigured ? '✅ Configured but failed' : '❌ Not configured'}
- **Groq**: ${groqConfigured ? '✅ Configured but failed' : '❌ Not configured'}

## Required Action:
Please ensure at least one of the following is properly configured:
1. **Azure OpenAI**: Set AZURE_OPENAI_API_KEY and AZURE_OPENAI_ENDPOINT in .env
2. **Groq**: Set GROQ_API_KEY in .env

## Agent Results Available:
While the executive summary could not be generated, individual agent analyses have been completed:
${results.map(r => `- ${r.agent}: ${r.task}`).join('\n')}

---
*Please contact your system administrator to resolve the configuration issue.*
`;
      
    } catch (error) {
      console.error('Failed to generate executive summary:', error);

      // Return error message with status instead of static summary
      const azureConfigured = azureOpenAI.isConfigured();
      const groqConfigured = groqService.isConfigured();

      return `
# ⚠️ **EXECUTIVE SUMMARY ERROR**

Failed to generate executive summary due to an error.

## Error Details:
${error instanceof Error ? error.message : 'Unknown error'}

## Configuration Status:
- **Azure OpenAI**: ${azureConfigured ? '✅ Configured' : '❌ Not configured'}
- **Groq**: ${groqConfigured ? '✅ Configured' : '❌ Not configured'}

## Troubleshooting:
1. Check API key validity
2. Verify network connectivity
3. Review backend logs for details

---
*Individual agent analyses completed successfully.*
`;
    }
  }

  private static formatExecutiveSummary(summary: string): string {
    return `
# 🎯 **EXECUTIVE SUMMARY**

*Generated: ${new Date().toLocaleString()}*

---

${summary}

---

## 📋 Summary Metadata

- **Analysis Type**: Multi-Agent Portfolio Risk Assessment
- **Agents Consulted**: Analyst, Trader, Advisor, Risk Manager, Economist
- **Confidence Level**: High (based on consensus across agents)
- **Review Recommended**: Quarterly

---

*This summary synthesizes insights from multiple specialized AI agents to provide a comprehensive view of your portfolio and investment strategy.*
`;
  }


  static formatFinalReport(results: AgentResult[], summary: string): string {
    return `
${summary}

---

## 📑 Detailed Agent Reports

The following sections contain the detailed analysis from each specialized agent:

${results.map(r => `
### ${r.agent.charAt(0).toUpperCase() + r.agent.slice(1)} Agent
*Task: ${r.task}*
*Completed: ${r.completedAt ? new Date(r.completedAt).toLocaleTimeString() : 'N/A'}*
`).join('\n')}

---

*End of Executive Summary*
`;
  }
}