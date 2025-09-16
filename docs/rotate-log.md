backend:dev: [12:01:38 AM] WD1JE-5297844 [INFO] ChatStream ChatStream received message
backend:dev: └ message: Comprehensive risk assessment of my portfolio
backend:dev: [12:01:38 AM] WD1JE-5297844 [INFO] ChatStream Chart detection results
backend:dev: ├ message: Comprehensive risk assessment of my portfolio
backend:dev: ├ detectedSymbol: null
backend:dev: ├ chartRequest: false
backend:dev: └ willShowChart: false
backend:dev: [12:01:38 AM] WD1JE-5297844 [INFO] ChatStream Workflow detected, triggering multi-agent analysis
backend:dev: [12:01:38 AM] 12S8Z-5298151 [INFO] WorkflowStatus Fetching workflow status
backend:dev: └ workflowId: WD1JE-5297844
backend:dev: [12:01:38 AM] WD1JE-5297844 [INFO] WorkflowTriggerHandler Handling workflow trigger
backend:dev: ├ workflowId: WD1JE-5297844                                                                                                                                                            backend:dev: ├ userId: user-1757995297817                                                                                                                                                           backend:dev: ├ agents: [
backend:dev: │ ├ 0: analyst
backend:dev: │ ├ 1: trader
backend:dev: │ ├ 2: advisor
backend:dev: │ ├ 3: riskManager
backend:dev: │ └ 4: economist
backend:dev: │ ]                                                                                                                                                                                    backend:dev: └ message: Comprehensive risk assessment of my portfolio...                                                                                                                            backend:dev: [12:01:38 AM] WD1JE-5297844 [INFO] WorkflowTriggerHandler Workflow started
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: ├ agents: [
backend:dev: │ ├ 0: analyst
backend:dev: │ ├ 1: trader                                                                                                                                                                          backend:dev: │ ├ 2: advisor                                                                                                                                                                         backend:dev: │ ├ 3: riskManager
backend:dev: │ └ 4: economist
backend:dev: │ ]
backend:dev: ├ totalSteps: 5
backend:dev: └ message: Starting multi-agent analysis...
backend:dev: [12:01:38 AM] WD1JE-5297844 [INFO] WorkflowTriggerHandler Starting first agent
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: ├ agent: analyst                                                                                                                                                                       backend:dev: └ task: Analyze market data and financial metrics                                                                                                                                      backend:dev: [12:01:38 AM] WD1JE-5297844 [INFO] WorkflowTriggerHandler Agent starting
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: ├ agent: analyst
backend:dev: ├ task: Analyze market data and financial metrics
backend:dev: ├ stepIndex: 0
backend:dev: └ totalSteps: 5
backend:dev: [12:01:38 AM] WD1JE-5297844 [INFO] WorkflowStreamBroadcaster Processing workflow event
backend:dev: ├ type: workflow.started
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:38 AM] WD1JE-5297844 [INFO] WorkflowWSRelay Relaying workflow event to WebSocket stream
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: ├ streamKey: workflow-WD1JE-5297844
backend:dev: └ eventType: workflow.started
backend:dev: [12:01:38 AM] WD1JE-5297844 [ERROR] WorkflowWSRelay Error relaying workflow event to WebSocket
backend:dev: ├ error: streams.set is not a function
backend:dev: └ workflowId: WD1JE-5297844
backend:dev: [12:01:38 AM] WD1JE-5297844 [INFO] WorkflowWSRelay Relaying workflow event to WebSocket stream
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ streamKey: workflow-WD1JE-5297844
backend:dev: [12:01:38 AM] WD1JE-5297844 [ERROR] WorkflowWSRelay Error relaying workflow event to WebSocket
backend:dev: ├ error: streams.set is not a function
backend:dev: └ workflowId: WD1JE-5297844
backend:dev: [12:01:38 AM] WD1JE-5297844 [DEBUG] WorkflowStreamBroadcaster Workflow event stored
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ eventType: workflow.started
backend:dev: [12:01:38 AM] WD1JE-5297844 [INFO] SSEBroadcaster Broadcasting SSE event
backend:dev: ├ type: workflow.started
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:38 AM] WD1JE-5297844 [INFO] SSEBroadcaster SSE broadcast metrics
backend:dev: ├ connectedClients: 0
backend:dev: └ queuedMessages: 1
backend:dev: [12:01:38 AM] WD1JE-5297844 [INFO] WorkflowSSERelay Relaying workflow.agent.started to SSE
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: ├ agent: analyst
backend:dev: └ userId: user-1757995297817
backend:dev: Groq service initialized successfully with Llama models
backend:dev: [12:01:39 AM] DH6WM-5299151 [INFO] WorkflowStatus Fetching workflow status
backend:dev: └ workflowId: WD1JE-5297844
backend:dev: Using local secrets storage (development mode)
backend:dev: Mastra telemetry is enabled, but the required instrumentation file was not loaded. If you are using Mastra outside of the mastra server environment, see: https://mastra.ai/en/docs/observability/tracing#tracing-outside-mastra-server-environment If you are using a custom instrumentation file or want to disable this warning, set the globalThis.___MASTRA_TELEMETRY___ variable to true in your instrumentation file.
backend:dev: [12:01:39 AM] WD1JE-5297844 [INFO] AgentExecutor Agent executor started
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: ├ agent: analyst
backend:dev: ├ task: Analyze market data and financial metrics
backend:dev: └ stepIndex: 0
backend:dev: Initialized secret: ENCRYPTION_MASTER_KEY
backend:dev: Initialized secret: JWT_SECRET
backend:dev: Initialized secret: API_SIGNING_KEY
backend:dev: [12:01:39 AM] WD1JE-5297844 [INFO] AgentExecutor Agent processing started
backend:dev: ├ agent: analyst
backend:dev: ├ task: Analyze market data and financial metrics
backend:dev: ├ stepIndex: 0
backend:dev: └ message: analyst is analyzing...
backend:dev: [12:01:39 AM] WD1JE-5297844 [INFO] AgentExecutor Agent analyst progress: Analyzing task requirements...
backend:dev: [12:01:39 AM] WD1JE-5297844 [DEBUG] AgentExecutor Agent progress update
backend:dev: ├ agent: analyst
backend:dev: ├ stepIndex: 0
backend:dev: └ message: Analyzing task requirements...
backend:dev: [12:01:39 AM] WD1JE-5297844 [INFO] WorkflowStreamBroadcaster Processing workflow event
backend:dev: ├ type: workflow.agent.progress
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:39 AM] WD1JE-5297844 [INFO] WorkflowWSRelay Relaying workflow event to WebSocket stream
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: ├ streamKey: workflow-WD1JE-5297844
backend:dev: └ eventType: workflow.agent.progress
backend:dev: [12:01:39 AM] WD1JE-5297844 [ERROR] WorkflowWSRelay Error relaying workflow event to WebSocket
backend:dev: ├ error: streams.set is not a function
backend:dev: └ workflowId: WD1JE-5297844
backend:dev: [12:01:39 AM] WD1JE-5297844 [DEBUG] WorkflowStreamBroadcaster Workflow event stored
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ eventType: workflow.agent.progress
backend:dev: [12:01:39 AM] WD1JE-5297844 [INFO] SSEBroadcaster Broadcasting SSE event
backend:dev: ├ type: workflow.agent.progress
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:39 AM] WD1JE-5297844 [INFO] SSEBroadcaster SSE broadcast metrics
backend:dev: ├ connectedClients: 0
backend:dev: └ queuedMessages: 1
backend:dev: [12:01:39 AM] WD1JE-5297844 [INFO] AgentExecutor Agent analyst progress: Gathering relevant data...
backend:dev: [12:01:39 AM] WD1JE-5297844 [DEBUG] AgentExecutor Agent progress update
backend:dev: ├ agent: analyst
backend:dev: ├ stepIndex: 0
backend:dev: └ message: Gathering relevant data...
backend:dev: [12:01:40 AM] WD1JE-5297844 [INFO] WorkflowWSRelay Relaying workflow event to WebSocket stream
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: ├ streamKey: workflow-WD1JE-5297844
backend:dev: └ eventType: workflow.agent.progress
backend:dev: [12:01:40 AM] WD1JE-5297844 [ERROR] WorkflowWSRelay Error relaying workflow event to WebSocket
backend:dev: ├ error: streams.set is not a function
backend:dev: └ workflowId: WD1JE-5297844
backend:dev: [12:01:40 AM] WD1JE-5297844 [INFO] WorkflowStreamBroadcaster Processing workflow event
backend:dev: ├ type: workflow.agent.progress
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:40 AM] WD1JE-5297844 [DEBUG] WorkflowStreamBroadcaster Workflow event stored
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ eventType: workflow.agent.progress
backend:dev: [12:01:40 AM] WD1JE-5297844 [INFO] SSEBroadcaster Broadcasting SSE event
backend:dev: ├ type: workflow.agent.progress
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:40 AM] WD1JE-5297844 [INFO] SSEBroadcaster SSE broadcast metrics
backend:dev: ├ connectedClients: 0
backend:dev: └ queuedMessages: 1
backend:dev: [12:01:40 AM] 7QP5Y-5300153 [INFO] WorkflowStatus Fetching workflow status
backend:dev: └ workflowId: WD1JE-5297844
backend:dev: [12:01:40 AM] WD1JE-5297844 [INFO] AgentExecutor Agent analyst progress: Applying analyst expertise...
backend:dev: [12:01:40 AM] WD1JE-5297844 [DEBUG] AgentExecutor Agent progress update
backend:dev: ├ agent: analyst
backend:dev: ├ stepIndex: 0
backend:dev: └ message: Applying analyst expertise...
backend:dev: [12:01:40 AM] WD1JE-5297844 [INFO] WorkflowWSRelay Relaying workflow event to WebSocket stream
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: ├ streamKey: workflow-WD1JE-5297844
backend:dev: └ eventType: workflow.agent.progress
backend:dev: [12:01:40 AM] WD1JE-5297844 [ERROR] WorkflowWSRelay Error relaying workflow event to WebSocket
backend:dev: ├ error: streams.set is not a function
backend:dev: └ workflowId: WD1JE-5297844
backend:dev: [12:01:40 AM] WD1JE-5297844 [INFO] WorkflowStreamBroadcaster Processing workflow event
backend:dev: ├ type: workflow.agent.progress
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:40 AM] WD1JE-5297844 [DEBUG] WorkflowStreamBroadcaster Workflow event stored
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ eventType: workflow.agent.progress
backend:dev: [12:01:40 AM] WD1JE-5297844 [INFO] SSEBroadcaster Broadcasting SSE event
backend:dev: ├ type: workflow.agent.progress
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:40 AM] WD1JE-5297844 [INFO] SSEBroadcaster SSE broadcast metrics
backend:dev: ├ connectedClients: 0
backend:dev: └ queuedMessages: 1
backend:dev: [12:01:40 AM] WD1JE-5297844 [INFO] AgentExecutor Agent analyst progress: Formulating insights...
backend:dev: [12:01:40 AM] WD1JE-5297844 [DEBUG] AgentExecutor Agent progress update
backend:dev: ├ agent: analyst
backend:dev: ├ stepIndex: 0
backend:dev: └ message: Formulating insights...
backend:dev: [12:01:41 AM] WD1JE-5297844 [INFO] WorkflowWSRelay Relaying workflow event to WebSocket stream
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: ├ streamKey: workflow-WD1JE-5297844
backend:dev: └ eventType: workflow.agent.progress
backend:dev: [12:01:41 AM] WD1JE-5297844 [ERROR] WorkflowWSRelay Error relaying workflow event to WebSocket
backend:dev: ├ error: streams.set is not a function
backend:dev: └ workflowId: WD1JE-5297844
backend:dev: [12:01:41 AM] WD1JE-5297844 [INFO] WorkflowStreamBroadcaster Processing workflow event
backend:dev: ├ type: workflow.agent.progress
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:41 AM] WD1JE-5297844 [DEBUG] WorkflowStreamBroadcaster Workflow event stored
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ eventType: workflow.agent.progress
backend:dev: [12:01:41 AM] WD1JE-5297844 [INFO] SSEBroadcaster Broadcasting SSE event
backend:dev: ├ type: workflow.agent.progress
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:41 AM] WD1JE-5297844 [INFO] SSEBroadcaster SSE broadcast metrics
backend:dev: ├ connectedClients: 0
backend:dev: └ queuedMessages: 1
backend:dev: [12:01:41 AM] WE8G7-5301154 [INFO] WorkflowStatus Fetching workflow status
backend:dev: └ workflowId: WD1JE-5297844
backend:dev: [12:01:41 AM] WD1JE-5297844 [INFO] AgentExecutor Agent analyst progress: Preparing recommendations...
backend:dev: [12:01:41 AM] WD1JE-5297844 [DEBUG] AgentExecutor Agent progress update
backend:dev: ├ agent: analyst
backend:dev: ├ stepIndex: 0
backend:dev: └ message: Preparing recommendations...
backend:dev: [12:01:41 AM] WD1JE-5297844 [INFO] WorkflowWSRelay Relaying workflow event to WebSocket stream
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: ├ streamKey: workflow-WD1JE-5297844
backend:dev: └ eventType: workflow.agent.progress
backend:dev: [12:01:41 AM] WD1JE-5297844 [ERROR] WorkflowWSRelay Error relaying workflow event to WebSocket
backend:dev: ├ error: streams.set is not a function
backend:dev: └ workflowId: WD1JE-5297844
backend:dev: [12:01:41 AM] WD1JE-5297844 [INFO] WorkflowStreamBroadcaster Processing workflow event
backend:dev: ├ type: workflow.agent.progress
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:41 AM] WD1JE-5297844 [DEBUG] WorkflowStreamBroadcaster Workflow event stored
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ eventType: workflow.agent.progress
backend:dev: [12:01:41 AM] WD1JE-5297844 [INFO] SSEBroadcaster Broadcasting SSE event
backend:dev: ├ type: workflow.agent.progress
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:41 AM] WD1JE-5297844 [INFO] SSEBroadcaster SSE broadcast metrics
backend:dev: ├ connectedClients: 0
backend:dev: └ queuedMessages: 1
backend:dev: Groq API error: AuthenticationError: 401 {"error":{"message":"Invalid API Key","type":"invalid_request_error","code":"invalid_api_key"}}
backend:dev:     at Function.generate (/Users/brian/Public/general-repos/fin/finagent2/node_modules/.pnpm/groq-sdk@0.32.0_encoding@0.1.13/node_modules/groq-sdk/src/error.ts:64:14)
backend:dev:     at Groq.makeStatusError (/Users/brian/Public/general-repos/fin/finagent2/node_modules/.pnpm/groq-sdk@0.32.0_encoding@0.1.13/node_modules/groq-sdk/src/core.ts:445:21)
backend:dev:     at Groq.makeRequest (/Users/brian/Public/general-repos/fin/finagent2/node_modules/.pnpm/groq-sdk@0.32.0_encoding@0.1.13/node_modules/groq-sdk/src/core.ts:511:24)
backend:dev:     at processTicksAndRejections (node:internal/process/task_queues:105:5)
backend:dev:     at async GroqService.createChatCompletion (/Users/brian/Public/general-repos/fin/finagent2/apps/backend/services/groq.service.ts:51:24)
backend:dev:     at async callLLM (/Users/brian/Public/general-repos/fin/finagent2/apps/backend/steps/agent-executor.step.ts:91:26)
backend:dev:     at async Object.handler (/Users/brian/Public/general-repos/fin/finagent2/apps/backend/steps/agent-executor.step.ts:194:27)
backend:dev:     at async runTypescriptModule (/Users/brian/Public/general-repos/fin/finagent2/node_modules/.pnpm/@motiadev+core@0.6.4-beta.130_@types+node@20.19.13_bufferutil@4.0.9_typescript@5.9.2_utf-8-validate@5.0.10/node_modules/@motiadev/core/dist/src/node/node-runner.js:58:24) {
backend:dev:   status: 401,
backend:dev:   headers: {
backend:dev:     'alt-svc': 'h3=":443"; ma=86400',
backend:dev:     'cache-control': 'private, max-age=0, no-store, no-cache, must-revalidate',
backend:dev:     'cf-cache-status': 'DYNAMIC',
backend:dev:     'cf-ray': '97fd76cf1ae79d36-EWR',
backend:dev:     connection: 'keep-alive',
backend:dev:     'content-length': '96',
backend:dev:     'content-type': 'application/json',
backend:dev:     date: 'Tue, 16 Sep 2025 04:01:42 GMT',
backend:dev:     server: 'cloudflare',
backend:dev:     'set-cookie': '__cf_bm=LtBq7TuZWeporAwi0KS5W_feWgeEfGsfuMjMlQETRdY-1757995302-1.0.1.1-FuQsx0QAngDxWan36.f0kNYw0fGLUCQ625kSN38ZR01O8arm2yS7jetjm3QfnGQnr.tMrBQhYDbu5ASYxHcczJkFmNboikYLXtMX.li4Hrs; path=/; expires=Tue, 16-Sep-25 04:31:42 GMT; domain=.groq.com; HttpOnly; Secure; SameSite=None',
backend:dev:     vary: 'Origin',
backend:dev:     via: '1.1 google',
backend:dev:     'x-groq-region': 'msp',
backend:dev:     'x-request-id': 'req_01k58ayzccefjv8xaggn412xag'
backend:dev:   },
backend:dev:   error: {
backend:dev:     error: {
backend:dev:       message: 'Invalid API Key',
backend:dev:       type: 'invalid_request_error',
backend:dev:       code: 'invalid_api_key'
backend:dev:     }
backend:dev:   }
backend:dev: }
backend:dev: LLM call failed for agent analyst: Error: Groq API error: 401 {"error":{"message":"Invalid API Key","type":"invalid_request_error","code":"invalid_api_key"}}
backend:dev:     at GroqService.createChatCompletion (/Users/brian/Public/general-repos/fin/finagent2/apps/backend/services/groq.service.ts:80:13)
backend:dev:     at processTicksAndRejections (node:internal/process/task_queues:105:5)
backend:dev:     at async callLLM (/Users/brian/Public/general-repos/fin/finagent2/apps/backend/steps/agent-executor.step.ts:91:26)
backend:dev:     at async Object.handler (/Users/brian/Public/general-repos/fin/finagent2/apps/backend/steps/agent-executor.step.ts:194:27)
backend:dev:     at async runTypescriptModule (/Users/brian/Public/general-repos/fin/finagent2/node_modules/.pnpm/@motiadev+core@0.6.4-beta.130_@types+node@20.19.13_bufferutil@4.0.9_typescript@5.9.2_utf-8-validate@5.0.10/node_modules/@motiadev/core/dist/src/node/node-runner.js:58:24)
backend:dev: [12:01:42 AM] WD1JE-5297844 [INFO] AgentExecutor Agent completed
backend:dev: ├ agent: analyst
backend:dev: ├ stepIndex: 0
backend:dev: ├ totalSteps: 5
backend:dev: └ completedSteps: 1
backend:dev: [12:01:42 AM] N4VFQ-5302152 [INFO] WorkflowStatus Fetching workflow status
backend:dev: └ workflowId: WD1JE-5297844
backend:dev: [12:01:42 AM] WD1JE-5297844 [INFO] AgentExecutor Starting next agent
backend:dev: ├ agent: trader
backend:dev: ├ task: Process with trader
backend:dev: ├ stepIndex: 1
backend:dev: ├ totalSteps: 5
backend:dev: └ message: Starting trader...
backend:dev: [12:01:42 AM] WD1JE-5297844 [INFO] AgentExecutor Agent executor completed
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: ├ agent: analyst
backend:dev: └ stepIndex: 0
backend:dev: [12:01:42 AM] WD1JE-5297844 [INFO] WorkflowWSRelay Relaying workflow event to WebSocket stream
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: ├ streamKey: workflow-WD1JE-5297844
backend:dev: └ eventType: workflow.agent.completed
backend:dev: [12:01:42 AM] WD1JE-5297844 [ERROR] WorkflowWSRelay Error relaying workflow event to WebSocket
backend:dev: ├ error: streams.set is not a function
backend:dev: └ workflowId: WD1JE-5297844
backend:dev: [12:01:42 AM] WD1JE-5297844 [INFO] WorkflowStreamBroadcaster Processing workflow event
backend:dev: ├ type: workflow.agent.completed
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:42 AM] WD1JE-5297844 [INFO] WorkflowWSRelay Relaying workflow event to WebSocket stream
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ streamKey: workflow-WD1JE-5297844
backend:dev: [12:01:42 AM] WD1JE-5297844 [ERROR] WorkflowWSRelay Error relaying workflow event to WebSocket
backend:dev: ├ error: streams.set is not a function
backend:dev: └ workflowId: WD1JE-5297844
backend:dev: [12:01:42 AM] WD1JE-5297844 [DEBUG] WorkflowStreamBroadcaster Workflow event stored
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ eventType: workflow.agent.completed
backend:dev: [12:01:42 AM] WD1JE-5297844 [INFO] SSEBroadcaster Broadcasting SSE event
backend:dev: ├ type: workflow.agent.completed
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:42 AM] WD1JE-5297844 [INFO] SSEBroadcaster SSE broadcast metrics
backend:dev: ├ connectedClients: 0
backend:dev: └ queuedMessages: 1
backend:dev: [12:01:42 AM] WD1JE-5297844 [INFO] WorkflowSSERelay Relaying workflow.agent.started to SSE
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: ├ agent: trader
backend:dev: └ userId: user-1757995297817
backend:dev: Groq service initialized successfully with Llama models
backend:dev: Using local secrets storage (development mode)
backend:dev: Mastra telemetry is enabled, but the required instrumentation file was not loaded. If you are using Mastra outside of the mastra server environment, see: https://mastra.ai/en/docs/observability/tracing#tracing-outside-mastra-server-environment If you are using a custom instrumentation file or want to disable this warning, set the globalThis.___MASTRA_TELEMETRY___ variable to true in your instrumentation file.
backend:dev: [12:01:43 AM] WD1JE-5297844 [INFO] AgentExecutor Agent executor started
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: ├ agent: trader
backend:dev: ├ task: Process with trader
backend:dev: └ stepIndex: 1
backend:dev: Initialized secret: ENCRYPTION_MASTER_KEY
backend:dev: Initialized secret: JWT_SECRET
backend:dev: Initialized secret: API_SIGNING_KEY
backend:dev: [12:01:43 AM] WD1JE-5297844 [INFO] AgentExecutor Agent processing started
backend:dev: ├ agent: trader
backend:dev: ├ task: Process with trader
backend:dev: ├ stepIndex: 1
backend:dev: └ message: trader is analyzing...
backend:dev: [12:01:43 AM] WD1JE-5297844 [INFO] AgentExecutor Agent trader progress: Analyzing task requirements...
backend:dev: [12:01:43 AM] WD1JE-5297844 [DEBUG] AgentExecutor Agent progress update
backend:dev: ├ agent: trader
backend:dev: ├ stepIndex: 1
backend:dev: └ message: Analyzing task requirements...
backend:dev: [12:01:43 AM] WD1JE-5297844 [INFO] WorkflowStreamBroadcaster Processing workflow event
backend:dev: ├ type: workflow.agent.progress
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:43 AM] WD1JE-5297844 [DEBUG] WorkflowStreamBroadcaster Workflow event stored
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ eventType: workflow.agent.progress
backend:dev: [12:01:43 AM] WD1JE-5297844 [INFO] WorkflowWSRelay Relaying workflow event to WebSocket stream
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: ├ streamKey: workflow-WD1JE-5297844
backend:dev: └ eventType: workflow.agent.progress
backend:dev: [12:01:43 AM] WD1JE-5297844 [ERROR] WorkflowWSRelay Error relaying workflow event to WebSocket
backend:dev: ├ error: streams.set is not a function
backend:dev: └ workflowId: WD1JE-5297844
backend:dev: [12:01:43 AM] B288Z-5303152 [INFO] WorkflowStatus Fetching workflow status
backend:dev: └ workflowId: WD1JE-5297844
backend:dev: [12:01:43 AM] WD1JE-5297844 [INFO] SSEBroadcaster Broadcasting SSE event
backend:dev: ├ type: workflow.agent.progress
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:43 AM] WD1JE-5297844 [INFO] SSEBroadcaster SSE broadcast metrics
backend:dev: ├ connectedClients: 0
backend:dev: └ queuedMessages: 1
backend:dev: [12:01:43 AM] WD1JE-5297844 [INFO] AgentExecutor Agent trader progress: Gathering relevant data...
backend:dev: [12:01:43 AM] WD1JE-5297844 [DEBUG] AgentExecutor Agent progress update
backend:dev: ├ agent: trader
backend:dev: ├ stepIndex: 1
backend:dev: └ message: Gathering relevant data...
backend:dev: [12:01:43 AM] WD1JE-5297844 [INFO] WorkflowWSRelay Relaying workflow event to WebSocket stream
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: ├ streamKey: workflow-WD1JE-5297844
backend:dev: └ eventType: workflow.agent.progress
backend:dev: [12:01:43 AM] WD1JE-5297844 [ERROR] WorkflowWSRelay Error relaying workflow event to WebSocket
backend:dev: ├ error: streams.set is not a function
backend:dev: └ workflowId: WD1JE-5297844
backend:dev: [12:01:43 AM] WD1JE-5297844 [INFO] WorkflowStreamBroadcaster Processing workflow event
backend:dev: ├ type: workflow.agent.progress
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:43 AM] WD1JE-5297844 [DEBUG] WorkflowStreamBroadcaster Workflow event stored
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ eventType: workflow.agent.progress
backend:dev: [12:01:43 AM] WD1JE-5297844 [INFO] SSEBroadcaster Broadcasting SSE event
backend:dev: ├ type: workflow.agent.progress
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:43 AM] WD1JE-5297844 [INFO] SSEBroadcaster SSE broadcast metrics
backend:dev: ├ connectedClients: 0
backend:dev: └ queuedMessages: 1
backend:dev: [12:01:44 AM] WD1JE-5297844 [INFO] AgentExecutor Agent trader progress: Applying trader expertise...
backend:dev: [12:01:44 AM] WD1JE-5297844 [DEBUG] AgentExecutor Agent progress update
backend:dev: ├ agent: trader
backend:dev: ├ stepIndex: 1
backend:dev: └ message: Applying trader expertise...
backend:dev: [12:01:44 AM] WD1JE-5297844 [INFO] WorkflowWSRelay Relaying workflow event to WebSocket stream
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: ├ streamKey: workflow-WD1JE-5297844
backend:dev: └ eventType: workflow.agent.progress
backend:dev: [12:01:44 AM] WD1JE-5297844 [ERROR] WorkflowWSRelay Error relaying workflow event to WebSocket
backend:dev: ├ error: streams.set is not a function
backend:dev: └ workflowId: WD1JE-5297844
backend:dev: [12:01:44 AM] WD1JE-5297844 [INFO] WorkflowStreamBroadcaster Processing workflow event
backend:dev: ├ type: workflow.agent.progress
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:44 AM] SZ8A4-5304157 [INFO] WorkflowStatus Fetching workflow status
backend:dev: └ workflowId: WD1JE-5297844
backend:dev: [12:01:44 AM] WD1JE-5297844 [DEBUG] WorkflowStreamBroadcaster Workflow event stored
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ eventType: workflow.agent.progress
backend:dev: [12:01:44 AM] WD1JE-5297844 [INFO] SSEBroadcaster Broadcasting SSE event
backend:dev: ├ type: workflow.agent.progress
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:44 AM] WD1JE-5297844 [INFO] SSEBroadcaster SSE broadcast metrics
backend:dev: ├ connectedClients: 0
backend:dev: └ queuedMessages: 1
backend:dev: [12:01:44 AM] WD1JE-5297844 [INFO] AgentExecutor Agent trader progress: Formulating insights...
backend:dev: [12:01:44 AM] WD1JE-5297844 [DEBUG] AgentExecutor Agent progress update
backend:dev: ├ agent: trader
backend:dev: ├ stepIndex: 1
backend:dev: └ message: Formulating insights...
backend:dev: [12:01:44 AM] WD1JE-5297844 [INFO] WorkflowStreamBroadcaster Processing workflow event
backend:dev: ├ type: workflow.agent.progress
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:44 AM] WD1JE-5297844 [INFO] WorkflowWSRelay Relaying workflow event to WebSocket stream
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: ├ streamKey: workflow-WD1JE-5297844
backend:dev: └ eventType: workflow.agent.progress
backend:dev: [12:01:44 AM] WD1JE-5297844 [ERROR] WorkflowWSRelay Error relaying workflow event to WebSocket
backend:dev: ├ error: streams.set is not a function
backend:dev: └ workflowId: WD1JE-5297844
backend:dev: [12:01:44 AM] WD1JE-5297844 [DEBUG] WorkflowStreamBroadcaster Workflow event stored
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ eventType: workflow.agent.progress
backend:dev: [12:01:44 AM] WD1JE-5297844 [INFO] SSEBroadcaster Broadcasting SSE event
backend:dev: ├ type: workflow.agent.progress
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:44 AM] WD1JE-5297844 [INFO] SSEBroadcaster SSE broadcast metrics
backend:dev: ├ connectedClients: 0
backend:dev: └ queuedMessages: 1
backend:dev: [12:01:45 AM] WD1JE-5297844 [INFO] AgentExecutor Agent trader progress: Preparing recommendations...
backend:dev: [12:01:45 AM] WD1JE-5297844 [DEBUG] AgentExecutor Agent progress update
backend:dev: ├ agent: trader
backend:dev: ├ stepIndex: 1
backend:dev: └ message: Preparing recommendations...
backend:dev: [12:01:45 AM] 6Q9NJ-5305153 [INFO] WorkflowStatus Fetching workflow status
backend:dev: └ workflowId: WD1JE-5297844
backend:dev: [12:01:45 AM] WD1JE-5297844 [INFO] WorkflowWSRelay Relaying workflow event to WebSocket stream
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: ├ streamKey: workflow-WD1JE-5297844
backend:dev: └ eventType: workflow.agent.progress
backend:dev: [12:01:45 AM] WD1JE-5297844 [ERROR] WorkflowWSRelay Error relaying workflow event to WebSocket
backend:dev: ├ error: streams.set is not a function
backend:dev: └ workflowId: WD1JE-5297844
backend:dev: [12:01:45 AM] WD1JE-5297844 [INFO] WorkflowStreamBroadcaster Processing workflow event
backend:dev: ├ type: workflow.agent.progress
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:45 AM] WD1JE-5297844 [INFO] SSEBroadcaster Broadcasting SSE event
backend:dev: ├ type: workflow.agent.progress
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:45 AM] WD1JE-5297844 [INFO] SSEBroadcaster SSE broadcast metrics
backend:dev: ├ connectedClients: 0
backend:dev: └ queuedMessages: 1
backend:dev: [12:01:45 AM] WD1JE-5297844 [DEBUG] WorkflowStreamBroadcaster Workflow event stored
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ eventType: workflow.agent.progress
backend:dev: Groq API error: AuthenticationError: 401 {"error":{"message":"Invalid API Key","type":"invalid_request_error","code":"invalid_api_key"}}
backend:dev:     at Function.generate (/Users/brian/Public/general-repos/fin/finagent2/node_modules/.pnpm/groq-sdk@0.32.0_encoding@0.1.13/node_modules/groq-sdk/src/error.ts:64:14)
backend:dev:     at Groq.makeStatusError (/Users/brian/Public/general-repos/fin/finagent2/node_modules/.pnpm/groq-sdk@0.32.0_encoding@0.1.13/node_modules/groq-sdk/src/core.ts:445:21)
backend:dev:     at Groq.makeRequest (/Users/brian/Public/general-repos/fin/finagent2/node_modules/.pnpm/groq-sdk@0.32.0_encoding@0.1.13/node_modules/groq-sdk/src/core.ts:511:24)
backend:dev:     at processTicksAndRejections (node:internal/process/task_queues:105:5)
backend:dev:     at async GroqService.createChatCompletion (/Users/brian/Public/general-repos/fin/finagent2/apps/backend/services/groq.service.ts:51:24)
backend:dev:     at async callLLM (/Users/brian/Public/general-repos/fin/finagent2/apps/backend/steps/agent-executor.step.ts:91:26)
backend:dev:     at async Object.handler (/Users/brian/Public/general-repos/fin/finagent2/apps/backend/steps/agent-executor.step.ts:194:27)
backend:dev:     at async runTypescriptModule (/Users/brian/Public/general-repos/fin/finagent2/node_modules/.pnpm/@motiadev+core@0.6.4-beta.130_@types+node@20.19.13_bufferutil@4.0.9_typescript@5.9.2_utf-8-validate@5.0.10/node_modules/@motiadev/core/dist/src/node/node-runner.js:58:24) {
backend:dev:   status: 401,
backend:dev:   headers: {
backend:dev:     'alt-svc': 'h3=":443"; ma=86400',
backend:dev:     'cache-control': 'private, max-age=0, no-store, no-cache, must-revalidate',
backend:dev:     'cf-cache-status': 'DYNAMIC',
backend:dev:     'cf-ray': '97fd76e4ec7542d4-EWR',
backend:dev:     connection: 'keep-alive',
backend:dev:     'content-length': '96',
backend:dev:     'content-type': 'application/json',
backend:dev:     date: 'Tue, 16 Sep 2025 04:01:45 GMT',
backend:dev:     server: 'cloudflare',
backend:dev:     'set-cookie': '__cf_bm=5QPkvfPhzh2cfDglzE1e6nWfqz7pp02VuDDN36RID1Q-1757995305-1.0.1.1-lv0d2JyFZF154Px_Cs5.lFfLWi39xQu93LMotdJYYKTtMN6z4MyMhnqTep5nWa2Id02.rP8an0tts7D2p7N3pLblFAPyjBsu_KMfxX2wI5w; path=/; expires=Tue, 16-Sep-25 04:31:45 GMT; domain=.groq.com; HttpOnly; Secure; SameSite=None',
backend:dev:     vary: 'Origin',
backend:dev:     via: '1.1 google',
backend:dev:     'x-groq-region': 'msp',
backend:dev:     'x-request-id': 'req_01k58az2srfhy839ttg4famhve'
backend:dev:   },
backend:dev:   error: {
backend:dev:     error: {
backend:dev:       message: 'Invalid API Key',
backend:dev:       type: 'invalid_request_error',
backend:dev:       code: 'invalid_api_key'
backend:dev:     }
backend:dev:   }
backend:dev: }
backend:dev: LLM call failed for agent trader: Error: Groq API error: 401 {"error":{"message":"Invalid API Key","type":"invalid_request_error","code":"invalid_api_key"}}
backend:dev:     at GroqService.createChatCompletion (/Users/brian/Public/general-repos/fin/finagent2/apps/backend/services/groq.service.ts:80:13)
backend:dev:     at processTicksAndRejections (node:internal/process/task_queues:105:5)
backend:dev:     at async callLLM (/Users/brian/Public/general-repos/fin/finagent2/apps/backend/steps/agent-executor.step.ts:91:26)
backend:dev:     at async Object.handler (/Users/brian/Public/general-repos/fin/finagent2/apps/backend/steps/agent-executor.step.ts:194:27)
backend:dev:     at async runTypescriptModule (/Users/brian/Public/general-repos/fin/finagent2/node_modules/.pnpm/@motiadev+core@0.6.4-beta.130_@types+node@20.19.13_bufferutil@4.0.9_typescript@5.9.2_utf-8-validate@5.0.10/node_modules/@motiadev/core/dist/src/node/node-runner.js:58:24)
backend:dev: [12:01:45 AM] WD1JE-5297844 [INFO] AgentExecutor Agent completed
backend:dev: ├ agent: trader
backend:dev: ├ stepIndex: 1
backend:dev: ├ totalSteps: 5
backend:dev: └ completedSteps: 2
backend:dev: [12:01:45 AM] WD1JE-5297844 [INFO] AgentExecutor Starting next agent
backend:dev: ├ agent: advisor
backend:dev: ├ task: Process with advisor
backend:dev: ├ stepIndex: 2
backend:dev: ├ totalSteps: 5
backend:dev: └ message: Starting advisor...
backend:dev: [12:01:45 AM] WD1JE-5297844 [INFO] AgentExecutor Agent executor completed
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: ├ agent: trader
backend:dev: └ stepIndex: 1
backend:dev: [12:01:46 AM] WD1JE-5297844 [INFO] WorkflowStreamBroadcaster Processing workflow event
backend:dev: ├ type: workflow.agent.completed
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:46 AM] WD1JE-5297844 [INFO] WorkflowWSRelay Relaying workflow event to WebSocket stream
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ streamKey: workflow-WD1JE-5297844
backend:dev: [12:01:46 AM] WD1JE-5297844 [ERROR] WorkflowWSRelay Error relaying workflow event to WebSocket
backend:dev: ├ error: streams.set is not a function
backend:dev: └ workflowId: WD1JE-5297844
backend:dev: [12:01:46 AM] WD1JE-5297844 [DEBUG] WorkflowStreamBroadcaster Workflow event stored
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ eventType: workflow.agent.completed
backend:dev: [12:01:46 AM] WD1JE-5297844 [INFO] WorkflowWSRelay Relaying workflow event to WebSocket stream
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: ├ streamKey: workflow-WD1JE-5297844
backend:dev: └ eventType: workflow.agent.completed
backend:dev: [12:01:46 AM] WD1JE-5297844 [ERROR] WorkflowWSRelay Error relaying workflow event to WebSocket
backend:dev: ├ error: streams.set is not a function
backend:dev: └ workflowId: WD1JE-5297844
backend:dev: [12:01:46 AM] WD1JE-5297844 [INFO] SSEBroadcaster Broadcasting SSE event
backend:dev: ├ type: workflow.agent.completed
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:46 AM] WD1JE-5297844 [INFO] SSEBroadcaster SSE broadcast metrics
backend:dev: ├ connectedClients: 0
backend:dev: └ queuedMessages: 1
backend:dev: [12:01:46 AM] WD1JE-5297844 [INFO] WorkflowSSERelay Relaying workflow.agent.started to SSE
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: ├ agent: advisor
backend:dev: └ userId: user-1757995297817
backend:dev: Groq service initialized successfully with Llama models
backend:dev: [12:01:46 AM] GTCNK-5306154 [INFO] WorkflowStatus Fetching workflow status
backend:dev: └ workflowId: WD1JE-5297844
backend:dev: Using local secrets storage (development mode)
backend:dev: Mastra telemetry is enabled, but the required instrumentation file was not loaded. If you are using Mastra outside of the mastra server environment, see: https://mastra.ai/en/docs/observability/tracing#tracing-outside-mastra-server-environment If you are using a custom instrumentation file or want to disable this warning, set the globalThis.___MASTRA_TELEMETRY___ variable to true in your instrumentation file.
backend:dev: [12:01:46 AM] WD1JE-5297844 [INFO] AgentExecutor Agent executor started
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: ├ agent: advisor
backend:dev: ├ task: Process with advisor
backend:dev: └ stepIndex: 2
backend:dev: Initialized secret: ENCRYPTION_MASTER_KEY
backend:dev: Initialized secret: JWT_SECRET
backend:dev: Initialized secret: API_SIGNING_KEY
backend:dev: [12:01:46 AM] WD1JE-5297844 [INFO] AgentExecutor Agent processing started
backend:dev: ├ agent: advisor
backend:dev: ├ task: Process with advisor
backend:dev: ├ stepIndex: 2
backend:dev: └ message: advisor is analyzing...
backend:dev: [12:01:46 AM] WD1JE-5297844 [INFO] AgentExecutor Agent advisor progress: Analyzing task requirements...
backend:dev: [12:01:46 AM] WD1JE-5297844 [DEBUG] AgentExecutor Agent progress update
backend:dev: ├ agent: advisor
backend:dev: ├ stepIndex: 2
backend:dev: └ message: Analyzing task requirements...
backend:dev: [12:01:46 AM] WD1JE-5297844 [INFO] WorkflowStreamBroadcaster Processing workflow event
backend:dev: ├ type: workflow.agent.progress
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:46 AM] WD1JE-5297844 [INFO] WorkflowWSRelay Relaying workflow event to WebSocket stream
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: ├ streamKey: workflow-WD1JE-5297844
backend:dev: └ eventType: workflow.agent.progress
backend:dev: [12:01:46 AM] WD1JE-5297844 [ERROR] WorkflowWSRelay Error relaying workflow event to WebSocket
backend:dev: ├ error: streams.set is not a function
backend:dev: └ workflowId: WD1JE-5297844
backend:dev: [12:01:46 AM] WD1JE-5297844 [DEBUG] WorkflowStreamBroadcaster Workflow event stored
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ eventType: workflow.agent.progress
backend:dev: [12:01:46 AM] WD1JE-5297844 [INFO] SSEBroadcaster Broadcasting SSE event
backend:dev: ├ type: workflow.agent.progress
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:46 AM] WD1JE-5297844 [INFO] SSEBroadcaster SSE broadcast metrics
backend:dev: ├ connectedClients: 0
backend:dev: └ queuedMessages: 1
backend:dev: [12:01:47 AM] WD1JE-5297844 [INFO] AgentExecutor Agent advisor progress: Gathering relevant data...
backend:dev: [12:01:47 AM] WD1JE-5297844 [DEBUG] AgentExecutor Agent progress update
backend:dev: ├ agent: advisor
backend:dev: ├ stepIndex: 2
backend:dev: └ message: Gathering relevant data...
backend:dev: [12:01:47 AM] WD1JE-5297844 [INFO] WorkflowWSRelay Relaying workflow event to WebSocket stream
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: ├ streamKey: workflow-WD1JE-5297844
backend:dev: └ eventType: workflow.agent.progress
backend:dev: [12:01:47 AM] WD1JE-5297844 [ERROR] WorkflowWSRelay Error relaying workflow event to WebSocket
backend:dev: ├ error: streams.set is not a function
backend:dev: └ workflowId: WD1JE-5297844
backend:dev: [12:01:47 AM] WD1JE-5297844 [INFO] WorkflowStreamBroadcaster Processing workflow event
backend:dev: ├ type: workflow.agent.progress
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:47 AM] WD1JE-5297844 [DEBUG] WorkflowStreamBroadcaster Workflow event stored
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ eventType: workflow.agent.progress
backend:dev: [12:01:47 AM] WD1JE-5297844 [INFO] SSEBroadcaster Broadcasting SSE event
backend:dev: ├ type: workflow.agent.progress
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:47 AM] WD1JE-5297844 [INFO] SSEBroadcaster SSE broadcast metrics
backend:dev: ├ connectedClients: 0
backend:dev: └ queuedMessages: 1
backend:dev: [12:01:47 AM] W1YWX-5307152 [INFO] WorkflowStatus Fetching workflow status
backend:dev: └ workflowId: WD1JE-5297844
backend:dev: [12:01:47 AM] WD1JE-5297844 [INFO] AgentExecutor Agent advisor progress: Applying advisor expertise...
backend:dev: [12:01:47 AM] WD1JE-5297844 [DEBUG] AgentExecutor Agent progress update
backend:dev: ├ agent: advisor
backend:dev: ├ stepIndex: 2
backend:dev: └ message: Applying advisor expertise...
backend:dev: [12:01:47 AM] WD1JE-5297844 [INFO] WorkflowWSRelay Relaying workflow event to WebSocket stream
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: ├ streamKey: workflow-WD1JE-5297844
backend:dev: └ eventType: workflow.agent.progress
backend:dev: [12:01:47 AM] WD1JE-5297844 [ERROR] WorkflowWSRelay Error relaying workflow event to WebSocket
backend:dev: ├ error: streams.set is not a function
backend:dev: └ workflowId: WD1JE-5297844
backend:dev: [12:01:47 AM] WD1JE-5297844 [INFO] WorkflowStreamBroadcaster Processing workflow event
backend:dev: ├ type: workflow.agent.progress
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:47 AM] WD1JE-5297844 [DEBUG] WorkflowStreamBroadcaster Workflow event stored
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ eventType: workflow.agent.progress
backend:dev: [12:01:47 AM] WD1JE-5297844 [INFO] SSEBroadcaster Broadcasting SSE event
backend:dev: ├ type: workflow.agent.progress
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:47 AM] WD1JE-5297844 [INFO] SSEBroadcaster SSE broadcast metrics
backend:dev: ├ connectedClients: 0
backend:dev: └ queuedMessages: 1
backend:dev: [12:01:48 AM] WD1JE-5297844 [INFO] AgentExecutor Agent advisor progress: Formulating insights...
backend:dev: [12:01:48 AM] WD1JE-5297844 [DEBUG] AgentExecutor Agent progress update
backend:dev: ├ agent: advisor
backend:dev: ├ stepIndex: 2
backend:dev: └ message: Formulating insights...
backend:dev: [12:01:48 AM] WD1JE-5297844 [INFO] WorkflowStreamBroadcaster Processing workflow event
backend:dev: ├ type: workflow.agent.progress
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:48 AM] WD1JE-5297844 [INFO] WorkflowWSRelay Relaying workflow event to WebSocket stream
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: ├ streamKey: workflow-WD1JE-5297844
backend:dev: └ eventType: workflow.agent.progress
backend:dev: [12:01:48 AM] WD1JE-5297844 [ERROR] WorkflowWSRelay Error relaying workflow event to WebSocket
backend:dev: ├ error: streams.set is not a function
backend:dev: └ workflowId: WD1JE-5297844
backend:dev: [12:01:48 AM] WD1JE-5297844 [DEBUG] WorkflowStreamBroadcaster Workflow event stored
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ eventType: workflow.agent.progress
backend:dev: [12:01:48 AM] WD1JE-5297844 [INFO] SSEBroadcaster Broadcasting SSE event
backend:dev: ├ type: workflow.agent.progress
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:48 AM] WD1JE-5297844 [INFO] SSEBroadcaster SSE broadcast metrics
backend:dev: ├ connectedClients: 0
backend:dev: └ queuedMessages: 1
backend:dev: [12:01:48 AM] EQZ7K-5308152 [INFO] WorkflowStatus Fetching workflow status
backend:dev: └ workflowId: WD1JE-5297844
backend:dev: [12:01:48 AM] WD1JE-5297844 [INFO] AgentExecutor Agent advisor progress: Preparing recommendations...
backend:dev: [12:01:48 AM] WD1JE-5297844 [DEBUG] AgentExecutor Agent progress update
backend:dev: ├ agent: advisor
backend:dev: ├ stepIndex: 2
backend:dev: └ message: Preparing recommendations...
backend:dev: [12:01:48 AM] WD1JE-5297844 [INFO] WorkflowWSRelay Relaying workflow event to WebSocket stream
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: ├ streamKey: workflow-WD1JE-5297844
backend:dev: └ eventType: workflow.agent.progress
backend:dev: [12:01:48 AM] WD1JE-5297844 [ERROR] WorkflowWSRelay Error relaying workflow event to WebSocket
backend:dev: ├ error: streams.set is not a function
backend:dev: └ workflowId: WD1JE-5297844
backend:dev: [12:01:48 AM] WD1JE-5297844 [INFO] WorkflowStreamBroadcaster Processing workflow event
backend:dev: ├ type: workflow.agent.progress
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:48 AM] WD1JE-5297844 [DEBUG] WorkflowStreamBroadcaster Workflow event stored
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ eventType: workflow.agent.progress
backend:dev: [12:01:48 AM] WD1JE-5297844 [INFO] SSEBroadcaster Broadcasting SSE event
backend:dev: ├ type: workflow.agent.progress
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:48 AM] WD1JE-5297844 [INFO] SSEBroadcaster SSE broadcast metrics
backend:dev: ├ connectedClients: 0
backend:dev: └ queuedMessages: 1
backend:dev: Groq API error: AuthenticationError: 401 {"error":{"message":"Invalid API Key","type":"invalid_request_error","code":"invalid_api_key"}}
backend:dev:     at Function.generate (/Users/brian/Public/general-repos/fin/finagent2/node_modules/.pnpm/groq-sdk@0.32.0_encoding@0.1.13/node_modules/groq-sdk/src/error.ts:64:14)
backend:dev:     at Groq.makeStatusError (/Users/brian/Public/general-repos/fin/finagent2/node_modules/.pnpm/groq-sdk@0.32.0_encoding@0.1.13/node_modules/groq-sdk/src/core.ts:445:21)
backend:dev:     at Groq.makeRequest (/Users/brian/Public/general-repos/fin/finagent2/node_modules/.pnpm/groq-sdk@0.32.0_encoding@0.1.13/node_modules/groq-sdk/src/core.ts:511:24)
backend:dev:     at processTicksAndRejections (node:internal/process/task_queues:105:5)
backend:dev:     at async GroqService.createChatCompletion (/Users/brian/Public/general-repos/fin/finagent2/apps/backend/services/groq.service.ts:51:24)
backend:dev:     at async callLLM (/Users/brian/Public/general-repos/fin/finagent2/apps/backend/steps/agent-executor.step.ts:91:26)
backend:dev:     at async Object.handler (/Users/brian/Public/general-repos/fin/finagent2/apps/backend/steps/agent-executor.step.ts:194:27)
backend:dev:     at async runTypescriptModule (/Users/brian/Public/general-repos/fin/finagent2/node_modules/.pnpm/@motiadev+core@0.6.4-beta.130_@types+node@20.19.13_bufferutil@4.0.9_typescript@5.9.2_utf-8-validate@5.0.10/node_modules/@motiadev/core/dist/src/node/node-runner.js:58:24) {
backend:dev:   status: 401,
backend:dev:   headers: {
backend:dev:     'alt-svc': 'h3=":443"; ma=86400',
backend:dev:     'cache-control': 'private, max-age=0, no-store, no-cache, must-revalidate',
backend:dev:     'cf-cache-status': 'DYNAMIC',
backend:dev:     'cf-ray': '97fd76fa7c144ba5-EWR',
backend:dev:     connection: 'keep-alive',
backend:dev:     'content-length': '96',
backend:dev:     'content-type': 'application/json',
backend:dev:     date: 'Tue, 16 Sep 2025 04:01:49 GMT',
backend:dev:     server: 'cloudflare',
backend:dev:     'set-cookie': '__cf_bm=rZGoGEC2coIygvlY5Tn3ohw7Am4e7YWSi9k0pP.jiY0-1757995309-1.0.1.1-jT7HDxBefsjd89VAYgHByTgKF.ok2gQ1R4U5agr80kGakAPnlfFdAeaCdSrytiCMiqE9V02SMHCE5I3_bffl3dOtWxxlYgi4YtT51phONnE; path=/; expires=Tue, 16-Sep-25 04:31:49 GMT; domain=.groq.com; HttpOnly; Secure; SameSite=None',
backend:dev:     vary: 'Origin',
backend:dev:     via: '1.1 google',
backend:dev:     'x-groq-region': 'msp',
backend:dev:     'x-request-id': 'req_01k58az65hegsa035zazk5r51d'
backend:dev:   },
backend:dev:   error: {
backend:dev:     error: {
backend:dev:       message: 'Invalid API Key',
backend:dev:       type: 'invalid_request_error',
backend:dev:       code: 'invalid_api_key'
backend:dev:     }
backend:dev:   }
backend:dev: }
backend:dev: LLM call failed for agent advisor: Error: Groq API error: 401 {"error":{"message":"Invalid API Key","type":"invalid_request_error","code":"invalid_api_key"}}
backend:dev:     at GroqService.createChatCompletion (/Users/brian/Public/general-repos/fin/finagent2/apps/backend/services/groq.service.ts:80:13)
backend:dev:     at processTicksAndRejections (node:internal/process/task_queues:105:5)
backend:dev:     at async callLLM (/Users/brian/Public/general-repos/fin/finagent2/apps/backend/steps/agent-executor.step.ts:91:26)
backend:dev:     at async Object.handler (/Users/brian/Public/general-repos/fin/finagent2/apps/backend/steps/agent-executor.step.ts:194:27)
backend:dev:     at async runTypescriptModule (/Users/brian/Public/general-repos/fin/finagent2/node_modules/.pnpm/@motiadev+core@0.6.4-beta.130_@types+node@20.19.13_bufferutil@4.0.9_typescript@5.9.2_utf-8-validate@5.0.10/node_modules/@motiadev/core/dist/src/node/node-runner.js:58:24)
backend:dev: [12:01:49 AM] WD1JE-5297844 [INFO] AgentExecutor Agent completed
backend:dev: ├ agent: advisor
backend:dev: ├ stepIndex: 2
backend:dev: ├ totalSteps: 5
backend:dev: └ completedSteps: 3
backend:dev: [12:01:49 AM] WD1JE-5297844 [INFO] AgentExecutor Starting next agent
backend:dev: ├ agent: riskManager
backend:dev: ├ task: Process with riskManager
backend:dev: ├ stepIndex: 3
backend:dev: ├ totalSteps: 5
backend:dev: └ message: Starting riskManager...
backend:dev: [12:01:49 AM] U3QUG-5309151 [INFO] WorkflowStatus Fetching workflow status
backend:dev: └ workflowId: WD1JE-5297844
backend:dev: [12:01:49 AM] WD1JE-5297844 [INFO] AgentExecutor Agent executor completed
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: ├ agent: advisor
backend:dev: └ stepIndex: 2
backend:dev: [12:01:49 AM] WD1JE-5297844 [INFO] WorkflowStreamBroadcaster Processing workflow event
backend:dev: ├ type: workflow.agent.completed
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:49 AM] WD1JE-5297844 [INFO] WorkflowWSRelay Relaying workflow event to WebSocket stream
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: ├ streamKey: workflow-WD1JE-5297844
backend:dev: └ eventType: workflow.agent.completed
backend:dev: [12:01:49 AM] WD1JE-5297844 [ERROR] WorkflowWSRelay Error relaying workflow event to WebSocket
backend:dev: ├ error: streams.set is not a function
backend:dev: └ workflowId: WD1JE-5297844
backend:dev: [12:01:49 AM] WD1JE-5297844 [DEBUG] WorkflowStreamBroadcaster Workflow event stored
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ eventType: workflow.agent.completed
backend:dev: [12:01:49 AM] WD1JE-5297844 [INFO] SSEBroadcaster Broadcasting SSE event
backend:dev: ├ type: workflow.agent.completed
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:49 AM] WD1JE-5297844 [INFO] SSEBroadcaster SSE broadcast metrics
backend:dev: ├ connectedClients: 0
backend:dev: └ queuedMessages: 1
backend:dev: [12:01:49 AM] WD1JE-5297844 [INFO] WorkflowWSRelay Relaying workflow event to WebSocket stream
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ streamKey: workflow-WD1JE-5297844
backend:dev: [12:01:49 AM] WD1JE-5297844 [ERROR] WorkflowWSRelay Error relaying workflow event to WebSocket
backend:dev: ├ error: streams.set is not a function
backend:dev: └ workflowId: WD1JE-5297844
backend:dev: [12:01:49 AM] WD1JE-5297844 [INFO] WorkflowSSERelay Relaying workflow.agent.started to SSE
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: ├ agent: riskManager
backend:dev: └ userId: user-1757995297817
backend:dev: Groq service initialized successfully with Llama models
backend:dev: Using local secrets storage (development mode)
backend:dev: Mastra telemetry is enabled, but the required instrumentation file was not loaded. If you are using Mastra outside of the mastra server environment, see: https://mastra.ai/en/docs/observability/tracing#tracing-outside-mastra-server-environment If you are using a custom instrumentation file or want to disable this warning, set the globalThis.___MASTRA_TELEMETRY___ variable to true in your instrumentation file.
backend:dev: [12:01:50 AM] WD1JE-5297844 [INFO] AgentExecutor Agent executor started
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: ├ agent: riskManager
backend:dev: ├ task: Process with riskManager
backend:dev: └ stepIndex: 3
backend:dev: Initialized secret: ENCRYPTION_MASTER_KEY
backend:dev: Initialized secret: JWT_SECRET
backend:dev: Initialized secret: API_SIGNING_KEY
backend:dev: [12:01:50 AM] WD1JE-5297844 [INFO] AgentExecutor Agent processing started
backend:dev: ├ agent: riskManager
backend:dev: ├ task: Process with riskManager
backend:dev: ├ stepIndex: 3
backend:dev: └ message: riskManager is analyzing...
backend:dev: [12:01:50 AM] WD1JE-5297844 [INFO] AgentExecutor Agent riskManager progress: Analyzing task requirements...
backend:dev: [12:01:50 AM] WD1JE-5297844 [DEBUG] AgentExecutor Agent progress update
backend:dev: ├ agent: riskManager
backend:dev: ├ stepIndex: 3
backend:dev: └ message: Analyzing task requirements...
backend:dev: [12:01:50 AM] WD1JE-5297844 [INFO] WorkflowWSRelay Relaying workflow event to WebSocket stream
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: ├ streamKey: workflow-WD1JE-5297844
backend:dev: └ eventType: workflow.agent.progress
backend:dev: [12:01:50 AM] WD1JE-5297844 [ERROR] WorkflowWSRelay Error relaying workflow event to WebSocket
backend:dev: ├ error: streams.set is not a function
backend:dev: └ workflowId: WD1JE-5297844
backend:dev: [12:01:50 AM] WD1JE-5297844 [INFO] SSEBroadcaster Broadcasting SSE event
backend:dev: ├ type: workflow.agent.progress
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:50 AM] WD1JE-5297844 [INFO] WorkflowStreamBroadcaster Processing workflow event
backend:dev: ├ type: workflow.agent.progress
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:50 AM] WD1JE-5297844 [INFO] SSEBroadcaster SSE broadcast metrics
backend:dev: ├ connectedClients: 0
backend:dev: └ queuedMessages: 1
backend:dev: [12:01:50 AM] WD1JE-5297844 [DEBUG] WorkflowStreamBroadcaster Workflow event stored
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ eventType: workflow.agent.progress
backend:dev: [12:01:50 AM] 6VCKY-5310157 [INFO] WorkflowStatus Fetching workflow status
backend:dev: └ workflowId: WD1JE-5297844
backend:dev: [12:01:50 AM] WD1JE-5297844 [INFO] AgentExecutor Agent riskManager progress: Gathering relevant data...
backend:dev: [12:01:50 AM] WD1JE-5297844 [DEBUG] AgentExecutor Agent progress update
backend:dev: ├ agent: riskManager
backend:dev: ├ stepIndex: 3
backend:dev: └ message: Gathering relevant data...
backend:dev: [12:01:50 AM] WD1JE-5297844 [INFO] WorkflowWSRelay Relaying workflow event to WebSocket stream
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: ├ streamKey: workflow-WD1JE-5297844
backend:dev: └ eventType: workflow.agent.progress
backend:dev: [12:01:50 AM] WD1JE-5297844 [ERROR] WorkflowWSRelay Error relaying workflow event to WebSocket
backend:dev: ├ error: streams.set is not a function
backend:dev: └ workflowId: WD1JE-5297844
backend:dev: [12:01:50 AM] WD1JE-5297844 [INFO] WorkflowStreamBroadcaster Processing workflow event
backend:dev: ├ type: workflow.agent.progress
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:50 AM] WD1JE-5297844 [DEBUG] WorkflowStreamBroadcaster Workflow event stored
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ eventType: workflow.agent.progress
backend:dev: [12:01:50 AM] WD1JE-5297844 [INFO] SSEBroadcaster Broadcasting SSE event
backend:dev: ├ type: workflow.agent.progress
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:50 AM] WD1JE-5297844 [INFO] SSEBroadcaster SSE broadcast metrics
backend:dev: ├ connectedClients: 0
backend:dev: └ queuedMessages: 1
backend:dev: [12:01:51 AM] WD1JE-5297844 [INFO] AgentExecutor Agent riskManager progress: Applying riskManager expertise...
backend:dev: [12:01:51 AM] WD1JE-5297844 [DEBUG] AgentExecutor Agent progress update
backend:dev: ├ agent: riskManager
backend:dev: ├ stepIndex: 3
backend:dev: └ message: Applying riskManager expertise...
backend:dev: [12:01:51 AM] WD1JE-5297844 [INFO] WorkflowStreamBroadcaster Processing workflow event
backend:dev: ├ type: workflow.agent.progress
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:51 AM] WD1JE-5297844 [INFO] WorkflowWSRelay Relaying workflow event to WebSocket stream
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: ├ streamKey: workflow-WD1JE-5297844
backend:dev: └ eventType: workflow.agent.progress
backend:dev: [12:01:51 AM] WD1JE-5297844 [ERROR] WorkflowWSRelay Error relaying workflow event to WebSocket
backend:dev: ├ error: streams.set is not a function
backend:dev: └ workflowId: WD1JE-5297844
backend:dev: [12:01:51 AM] WD1JE-5297844 [INFO] SSEBroadcaster Broadcasting SSE event
backend:dev: ├ type: workflow.agent.progress
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:51 AM] WD1JE-5297844 [INFO] SSEBroadcaster SSE broadcast metrics
backend:dev: ├ connectedClients: 0
backend:dev: └ queuedMessages: 1
backend:dev: [12:01:51 AM] JKX6V-5311179 [INFO] WorkflowStatus Fetching workflow status
backend:dev: └ workflowId: WD1JE-5297844
backend:dev: [12:01:51 AM] WD1JE-5297844 [DEBUG] WorkflowStreamBroadcaster Workflow event stored
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ eventType: workflow.agent.progress
backend:dev: [12:01:51 AM] WD1JE-5297844 [INFO] AgentExecutor Agent riskManager progress: Formulating insights...
backend:dev: [12:01:51 AM] WD1JE-5297844 [DEBUG] AgentExecutor Agent progress update
backend:dev: ├ agent: riskManager
backend:dev: ├ stepIndex: 3
backend:dev: └ message: Formulating insights...
backend:dev: [12:01:51 AM] WD1JE-5297844 [INFO] WorkflowWSRelay Relaying workflow event to WebSocket stream
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: ├ streamKey: workflow-WD1JE-5297844
backend:dev: └ eventType: workflow.agent.progress
backend:dev: [12:01:51 AM] WD1JE-5297844 [ERROR] WorkflowWSRelay Error relaying workflow event to WebSocket
backend:dev: ├ error: streams.set is not a function
backend:dev: └ workflowId: WD1JE-5297844
backend:dev: [12:01:51 AM] WD1JE-5297844 [INFO] WorkflowStreamBroadcaster Processing workflow event
backend:dev: ├ type: workflow.agent.progress
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:51 AM] WD1JE-5297844 [DEBUG] WorkflowStreamBroadcaster Workflow event stored
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ eventType: workflow.agent.progress
backend:dev: [12:01:51 AM] WD1JE-5297844 [INFO] SSEBroadcaster Broadcasting SSE event
backend:dev: ├ type: workflow.agent.progress
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:51 AM] WD1JE-5297844 [INFO] SSEBroadcaster SSE broadcast metrics
backend:dev: ├ connectedClients: 0
backend:dev: └ queuedMessages: 1
backend:dev: [12:01:52 AM] WD1JE-5297844 [INFO] AgentExecutor Agent riskManager progress: Preparing recommendations...
backend:dev: [12:01:52 AM] WD1JE-5297844 [DEBUG] AgentExecutor Agent progress update
backend:dev: ├ agent: riskManager
backend:dev: ├ stepIndex: 3
backend:dev: └ message: Preparing recommendations...
backend:dev: [12:01:52 AM] 5KGED-5312152 [INFO] WorkflowStatus Fetching workflow status
backend:dev: └ workflowId: WD1JE-5297844
backend:dev: [12:01:52 AM] WD1JE-5297844 [INFO] WorkflowWSRelay Relaying workflow event to WebSocket stream
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: ├ streamKey: workflow-WD1JE-5297844
backend:dev: └ eventType: workflow.agent.progress
backend:dev: [12:01:52 AM] WD1JE-5297844 [ERROR] WorkflowWSRelay Error relaying workflow event to WebSocket
backend:dev: ├ error: streams.set is not a function
backend:dev: └ workflowId: WD1JE-5297844
backend:dev: [12:01:52 AM] WD1JE-5297844 [INFO] WorkflowStreamBroadcaster Processing workflow event
backend:dev: ├ type: workflow.agent.progress
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:52 AM] WD1JE-5297844 [INFO] SSEBroadcaster Broadcasting SSE event
backend:dev: ├ type: workflow.agent.progress
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:52 AM] WD1JE-5297844 [INFO] SSEBroadcaster SSE broadcast metrics
backend:dev: ├ connectedClients: 0
backend:dev: └ queuedMessages: 1
backend:dev: [12:01:52 AM] WD1JE-5297844 [DEBUG] WorkflowStreamBroadcaster Workflow event stored
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ eventType: workflow.agent.progress
backend:dev: Groq API error: AuthenticationError: 401 {"error":{"message":"Invalid API Key","type":"invalid_request_error","code":"invalid_api_key"}}
backend:dev:     at Function.generate (/Users/brian/Public/general-repos/fin/finagent2/node_modules/.pnpm/groq-sdk@0.32.0_encoding@0.1.13/node_modules/groq-sdk/src/error.ts:64:14)
backend:dev:     at Groq.makeStatusError (/Users/brian/Public/general-repos/fin/finagent2/node_modules/.pnpm/groq-sdk@0.32.0_encoding@0.1.13/node_modules/groq-sdk/src/core.ts:445:21)
backend:dev:     at Groq.makeRequest (/Users/brian/Public/general-repos/fin/finagent2/node_modules/.pnpm/groq-sdk@0.32.0_encoding@0.1.13/node_modules/groq-sdk/src/core.ts:511:24)
backend:dev:     at processTicksAndRejections (node:internal/process/task_queues:105:5)
backend:dev:     at async GroqService.createChatCompletion (/Users/brian/Public/general-repos/fin/finagent2/apps/backend/services/groq.service.ts:51:24)
backend:dev:     at async callLLM (/Users/brian/Public/general-repos/fin/finagent2/apps/backend/steps/agent-executor.step.ts:91:26)
backend:dev:     at async Object.handler (/Users/brian/Public/general-repos/fin/finagent2/apps/backend/steps/agent-executor.step.ts:194:27)
backend:dev:     at async runTypescriptModule (/Users/brian/Public/general-repos/fin/finagent2/node_modules/.pnpm/@motiadev+core@0.6.4-beta.130_@types+node@20.19.13_bufferutil@4.0.9_typescript@5.9.2_utf-8-validate@5.0.10/node_modules/@motiadev/core/dist/src/node/node-runner.js:58:24) {
backend:dev:   status: 401,
backend:dev:   headers: {
backend:dev:     'alt-svc': 'h3=":443"; ma=86400',
backend:dev:     'cache-control': 'private, max-age=0, no-store, no-cache, must-revalidate',
backend:dev:     'cf-cache-status': 'DYNAMIC',
backend:dev:     'cf-ray': '97fd7710dfa44ba5-EWR',
backend:dev:     connection: 'keep-alive',
backend:dev:     'content-length': '96',
backend:dev:     'content-type': 'application/json',
backend:dev:     date: 'Tue, 16 Sep 2025 04:01:52 GMT',
backend:dev:     server: 'cloudflare',
backend:dev:     'set-cookie': '__cf_bm=JkI2wtppmPjHYwct1gJG4DhaIi_.Fv.DalD1ZHzMZnU-1757995312-1.0.1.1-Ka88XvOUV5xX.QUZHudNldNPHElm6TMrrTAxXtnJAlQchqF2LAMmfgjgqIuExMymv67DAj8ECvQ1geYZmoQHpHTAfRmQkLW5wLOizpHKi0c; path=/; expires=Tue, 16-Sep-25 04:31:52 GMT; domain=.groq.com; HttpOnly; Secure; SameSite=None',
backend:dev:     vary: 'Origin',
backend:dev:     via: '1.1 google',
backend:dev:     'x-groq-region': 'msp',
backend:dev:     'x-request-id': 'req_01k58az9naeh1ak3ky9stqe321'
backend:dev:   },
backend:dev:   error: {
backend:dev:     error: {
backend:dev:       message: 'Invalid API Key',
backend:dev:       type: 'invalid_request_error',
backend:dev:       code: 'invalid_api_key'
backend:dev:     }
backend:dev:   }
backend:dev: }
backend:dev: LLM call failed for agent riskManager: Error: Groq API error: 401 {"error":{"message":"Invalid API Key","type":"invalid_request_error","code":"invalid_api_key"}}
backend:dev:     at GroqService.createChatCompletion (/Users/brian/Public/general-repos/fin/finagent2/apps/backend/services/groq.service.ts:80:13)
backend:dev:     at processTicksAndRejections (node:internal/process/task_queues:105:5)
backend:dev:     at async callLLM (/Users/brian/Public/general-repos/fin/finagent2/apps/backend/steps/agent-executor.step.ts:91:26)
backend:dev:     at async Object.handler (/Users/brian/Public/general-repos/fin/finagent2/apps/backend/steps/agent-executor.step.ts:194:27)
backend:dev:     at async runTypescriptModule (/Users/brian/Public/general-repos/fin/finagent2/node_modules/.pnpm/@motiadev+core@0.6.4-beta.130_@types+node@20.19.13_bufferutil@4.0.9_typescript@5.9.2_utf-8-validate@5.0.10/node_modules/@motiadev/core/dist/src/node/node-runner.js:58:24)
backend:dev: [12:01:52 AM] WD1JE-5297844 [INFO] AgentExecutor Agent completed
backend:dev: ├ agent: riskManager
backend:dev: ├ stepIndex: 3
backend:dev: ├ totalSteps: 5
backend:dev: └ completedSteps: 4
backend:dev: [12:01:52 AM] WD1JE-5297844 [INFO] AgentExecutor Starting next agent
backend:dev: ├ agent: economist
backend:dev: ├ task: Process with economist
backend:dev: ├ stepIndex: 4
backend:dev: ├ totalSteps: 5
backend:dev: └ message: Starting economist...
backend:dev: [12:01:52 AM] WD1JE-5297844 [INFO] AgentExecutor Agent executor completed
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: ├ agent: riskManager
backend:dev: └ stepIndex: 3
backend:dev: [12:01:53 AM] WD1JE-5297844 [INFO] WorkflowWSRelay Relaying workflow event to WebSocket stream
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: ├ streamKey: workflow-WD1JE-5297844
backend:dev: └ eventType: workflow.agent.completed
backend:dev: [12:01:53 AM] WD1JE-5297844 [ERROR] WorkflowWSRelay Error relaying workflow event to WebSocket
backend:dev: ├ error: streams.set is not a function
backend:dev: └ workflowId: WD1JE-5297844
backend:dev: [12:01:53 AM] WD1JE-5297844 [INFO] WorkflowStreamBroadcaster Processing workflow event
backend:dev: ├ type: workflow.agent.completed
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:53 AM] WD1JE-5297844 [DEBUG] WorkflowStreamBroadcaster Workflow event stored
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ eventType: workflow.agent.completed
backend:dev: [12:01:53 AM] WD1JE-5297844 [INFO] SSEBroadcaster Broadcasting SSE event
backend:dev: ├ type: workflow.agent.completed
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:53 AM] WD1JE-5297844 [INFO] SSEBroadcaster SSE broadcast metrics
backend:dev: ├ connectedClients: 0
backend:dev: └ queuedMessages: 1
backend:dev: [12:01:53 AM] WD1JE-5297844 [INFO] WorkflowWSRelay Relaying workflow event to WebSocket stream
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ streamKey: workflow-WD1JE-5297844
backend:dev: [12:01:53 AM] WD1JE-5297844 [ERROR] WorkflowWSRelay Error relaying workflow event to WebSocket
backend:dev: ├ error: streams.set is not a function
backend:dev: └ workflowId: WD1JE-5297844
backend:dev: [12:01:53 AM] WD1JE-5297844 [INFO] WorkflowSSERelay Relaying workflow.agent.started to SSE
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: ├ agent: economist
backend:dev: └ userId: user-1757995297817
backend:dev: Groq service initialized successfully with Llama models
backend:dev: [12:01:53 AM] W6ZM2-5313202 [INFO] WorkflowStatus Fetching workflow status
backend:dev: └ workflowId: WD1JE-5297844
backend:dev: Using local secrets storage (development mode)
backend:dev: Mastra telemetry is enabled, but the required instrumentation file was not loaded. If you are using Mastra outside of the mastra server environment, see: https://mastra.ai/en/docs/observability/tracing#tracing-outside-mastra-server-environment If you are using a custom instrumentation file or want to disable this warning, set the globalThis.___MASTRA_TELEMETRY___ variable to true in your instrumentation file.
backend:dev: Initialized secret: ENCRYPTION_MASTER_KEY
backend:dev: Initialized secret: JWT_SECRET
backend:dev: Initialized secret: API_SIGNING_KEY
backend:dev: [12:01:53 AM] WD1JE-5297844 [INFO] AgentExecutor Agent executor started
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: ├ agent: economist
backend:dev: ├ task: Process with economist
backend:dev: └ stepIndex: 4
backend:dev: [12:01:53 AM] WD1JE-5297844 [INFO] AgentExecutor Agent processing started
backend:dev: ├ agent: economist
backend:dev: ├ task: Process with economist
backend:dev: ├ stepIndex: 4
backend:dev: └ message: economist is analyzing...
backend:dev: [12:01:53 AM] WD1JE-5297844 [INFO] AgentExecutor Agent economist progress: Analyzing task requirements...
backend:dev: [12:01:53 AM] WD1JE-5297844 [DEBUG] AgentExecutor Agent progress update
backend:dev: ├ agent: economist
backend:dev: ├ stepIndex: 4
backend:dev: └ message: Analyzing task requirements...
backend:dev: [12:01:54 AM] WD1JE-5297844 [INFO] WorkflowStreamBroadcaster Processing workflow event
backend:dev: ├ type: workflow.agent.progress
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:54 AM] WD1JE-5297844 [INFO] WorkflowWSRelay Relaying workflow event to WebSocket stream
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: ├ streamKey: workflow-WD1JE-5297844
backend:dev: └ eventType: workflow.agent.progress
backend:dev: [12:01:54 AM] WD1JE-5297844 [ERROR] WorkflowWSRelay Error relaying workflow event to WebSocket
backend:dev: ├ error: streams.set is not a function
backend:dev: └ workflowId: WD1JE-5297844
backend:dev: [12:01:54 AM] WD1JE-5297844 [INFO] SSEBroadcaster Broadcasting SSE event
backend:dev: ├ type: workflow.agent.progress
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:54 AM] WD1JE-5297844 [INFO] SSEBroadcaster SSE broadcast metrics
backend:dev: ├ connectedClients: 0
backend:dev: └ queuedMessages: 1
backend:dev: [12:01:54 AM] WD1JE-5297844 [DEBUG] WorkflowStreamBroadcaster Workflow event stored
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ eventType: workflow.agent.progress
backend:dev: [12:01:54 AM] WD1JE-5297844 [INFO] AgentExecutor Agent economist progress: Gathering relevant data...
backend:dev: [12:01:54 AM] WD1JE-5297844 [DEBUG] AgentExecutor Agent progress update
backend:dev: ├ agent: economist
backend:dev: ├ stepIndex: 4
backend:dev: └ message: Gathering relevant data...
backend:dev: [12:01:54 AM] RAZ2U-5314161 [INFO] WorkflowStatus Fetching workflow status
backend:dev: └ workflowId: WD1JE-5297844
backend:dev: [12:01:54 AM] WD1JE-5297844 [INFO] WorkflowWSRelay Relaying workflow event to WebSocket stream
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: ├ streamKey: workflow-WD1JE-5297844
backend:dev: └ eventType: workflow.agent.progress
backend:dev: [12:01:54 AM] WD1JE-5297844 [ERROR] WorkflowWSRelay Error relaying workflow event to WebSocket
backend:dev: ├ error: streams.set is not a function
backend:dev: └ workflowId: WD1JE-5297844
backend:dev: [12:01:54 AM] WD1JE-5297844 [INFO] WorkflowStreamBroadcaster Processing workflow event
backend:dev: ├ type: workflow.agent.progress
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:54 AM] WD1JE-5297844 [INFO] SSEBroadcaster Broadcasting SSE event
backend:dev: ├ type: workflow.agent.progress
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:54 AM] WD1JE-5297844 [INFO] SSEBroadcaster SSE broadcast metrics
backend:dev: ├ connectedClients: 0
backend:dev: └ queuedMessages: 1
backend:dev: [12:01:54 AM] WD1JE-5297844 [DEBUG] WorkflowStreamBroadcaster Workflow event stored
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ eventType: workflow.agent.progress
backend:dev: [12:01:54 AM] WD1JE-5297844 [INFO] AgentExecutor Agent economist progress: Applying economist expertise...
backend:dev: [12:01:54 AM] WD1JE-5297844 [DEBUG] AgentExecutor Agent progress update
backend:dev: ├ agent: economist
backend:dev: ├ stepIndex: 4
backend:dev: └ message: Applying economist expertise...
backend:dev: [12:01:55 AM] WD1JE-5297844 [INFO] WorkflowWSRelay Relaying workflow event to WebSocket stream
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: ├ streamKey: workflow-WD1JE-5297844
backend:dev: └ eventType: workflow.agent.progress
backend:dev: [12:01:55 AM] WD1JE-5297844 [ERROR] WorkflowWSRelay Error relaying workflow event to WebSocket
backend:dev: ├ error: streams.set is not a function
backend:dev: └ workflowId: WD1JE-5297844
backend:dev: [12:01:55 AM] WD1JE-5297844 [INFO] WorkflowStreamBroadcaster Processing workflow event
backend:dev: ├ type: workflow.agent.progress
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:55 AM] WD1JE-5297844 [INFO] SSEBroadcaster Broadcasting SSE event
backend:dev: ├ type: workflow.agent.progress
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:55 AM] WD1JE-5297844 [INFO] SSEBroadcaster SSE broadcast metrics
backend:dev: ├ connectedClients: 0
backend:dev: └ queuedMessages: 1
backend:dev: [12:01:55 AM] WD1JE-5297844 [DEBUG] WorkflowStreamBroadcaster Workflow event stored
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ eventType: workflow.agent.progress
backend:dev: [12:01:55 AM] WD1JE-5297844 [INFO] AgentExecutor Agent economist progress: Formulating insights...
backend:dev: [12:01:55 AM] WD1JE-5297844 [DEBUG] AgentExecutor Agent progress update
backend:dev: ├ agent: economist
backend:dev: ├ stepIndex: 4
backend:dev: └ message: Formulating insights...
backend:dev: [12:01:55 AM] F97RV-5315152 [INFO] WorkflowStatus Fetching workflow status
backend:dev: └ workflowId: WD1JE-5297844
backend:dev: [12:01:55 AM] WD1JE-5297844 [INFO] WorkflowStreamBroadcaster Processing workflow event
backend:dev: ├ type: workflow.agent.progress
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:55 AM] WD1JE-5297844 [INFO] WorkflowWSRelay Relaying workflow event to WebSocket stream
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: ├ streamKey: workflow-WD1JE-5297844
backend:dev: └ eventType: workflow.agent.progress
backend:dev: [12:01:55 AM] WD1JE-5297844 [ERROR] WorkflowWSRelay Error relaying workflow event to WebSocket
backend:dev: ├ error: streams.set is not a function
backend:dev: └ workflowId: WD1JE-5297844
backend:dev: [12:01:55 AM] WD1JE-5297844 [INFO] SSEBroadcaster Broadcasting SSE event
backend:dev: ├ type: workflow.agent.progress
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:55 AM] WD1JE-5297844 [INFO] SSEBroadcaster SSE broadcast metrics
backend:dev: ├ connectedClients: 0
backend:dev: └ queuedMessages: 1
backend:dev: [12:01:55 AM] WD1JE-5297844 [DEBUG] WorkflowStreamBroadcaster Workflow event stored
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ eventType: workflow.agent.progress
backend:dev: [12:01:55 AM] WD1JE-5297844 [INFO] AgentExecutor Agent economist progress: Preparing recommendations...
backend:dev: [12:01:55 AM] WD1JE-5297844 [DEBUG] AgentExecutor Agent progress update
backend:dev: ├ agent: economist
backend:dev: ├ stepIndex: 4
backend:dev: └ message: Preparing recommendations...
backend:dev: [12:01:56 AM] WD1JE-5297844 [INFO] WorkflowWSRelay Relaying workflow event to WebSocket stream
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: ├ streamKey: workflow-WD1JE-5297844
backend:dev: └ eventType: workflow.agent.progress
backend:dev: [12:01:56 AM] WD1JE-5297844 [ERROR] WorkflowWSRelay Error relaying workflow event to WebSocket
backend:dev: ├ error: streams.set is not a function
backend:dev: └ workflowId: WD1JE-5297844
backend:dev: [12:01:56 AM] WD1JE-5297844 [INFO] WorkflowStreamBroadcaster Processing workflow event
backend:dev: ├ type: workflow.agent.progress
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:56 AM] WD1JE-5297844 [INFO] SSEBroadcaster Broadcasting SSE event
backend:dev: ├ type: workflow.agent.progress
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:56 AM] WD1JE-5297844 [INFO] SSEBroadcaster SSE broadcast metrics
backend:dev: ├ connectedClients: 0
backend:dev: └ queuedMessages: 1
backend:dev: [12:01:56 AM] WD1JE-5297844 [DEBUG] WorkflowStreamBroadcaster Workflow event stored
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ eventType: workflow.agent.progress
backend:dev: [12:01:56 AM] RZDPN-5316201 [INFO] WorkflowStatus Fetching workflow status
backend:dev: └ workflowId: WD1JE-5297844
backend:dev: Groq API error: AuthenticationError: 401 {"error":{"message":"Invalid API Key","type":"invalid_request_error","code":"invalid_api_key"}}
backend:dev:     at Function.generate (/Users/brian/Public/general-repos/fin/finagent2/node_modules/.pnpm/groq-sdk@0.32.0_encoding@0.1.13/node_modules/groq-sdk/src/error.ts:64:14)
backend:dev:     at Groq.makeStatusError (/Users/brian/Public/general-repos/fin/finagent2/node_modules/.pnpm/groq-sdk@0.32.0_encoding@0.1.13/node_modules/groq-sdk/src/core.ts:445:21)
backend:dev:     at Groq.makeRequest (/Users/brian/Public/general-repos/fin/finagent2/node_modules/.pnpm/groq-sdk@0.32.0_encoding@0.1.13/node_modules/groq-sdk/src/core.ts:511:24)
backend:dev:     at processTicksAndRejections (node:internal/process/task_queues:105:5)
backend:dev:     at async GroqService.createChatCompletion (/Users/brian/Public/general-repos/fin/finagent2/apps/backend/services/groq.service.ts:51:24)
backend:dev:     at async callLLM (/Users/brian/Public/general-repos/fin/finagent2/apps/backend/steps/agent-executor.step.ts:91:26)
backend:dev:     at async Object.handler (/Users/brian/Public/general-repos/fin/finagent2/apps/backend/steps/agent-executor.step.ts:194:27)
backend:dev:     at async runTypescriptModule (/Users/brian/Public/general-repos/fin/finagent2/node_modules/.pnpm/@motiadev+core@0.6.4-beta.130_@types+node@20.19.13_bufferutil@4.0.9_typescript@5.9.2_utf-8-validate@5.0.10/node_modules/@motiadev/core/dist/src/node/node-runner.js:58:24) {
backend:dev:   status: 401,
backend:dev:   headers: {
backend:dev:     'alt-svc': 'h3=":443"; ma=86400',
backend:dev:     'cache-control': 'private, max-age=0, no-store, no-cache, must-revalidate',
backend:dev:     'cf-cache-status': 'DYNAMIC',
backend:dev:     'cf-ray': '97fd7727ac7358c1-EWR',
backend:dev:     connection: 'keep-alive',
backend:dev:     'content-length': '96',
backend:dev:     'content-type': 'application/json',
backend:dev:     date: 'Tue, 16 Sep 2025 04:01:56 GMT',
backend:dev:     server: 'cloudflare',
backend:dev:     'set-cookie': '__cf_bm=Bn_XXo98dGNpqVzud_I1CvaB0L1TPfwLXjjztOsTxew-1757995316-1.0.1.1-iRiPq._usRXnjQHxtYLhCZFyS0cz.F7_HCZY4TsuO_dbSJBysimDviwJxQ28tCFWodrS_t41Y0V31uqPARk0.Q8cd2WuexEQyBgzI6FzpkA; path=/; expires=Tue, 16-Sep-25 04:31:56 GMT; domain=.groq.com; HttpOnly; Secure; SameSite=None',
backend:dev:     vary: 'Origin',
backend:dev:     via: '1.1 google',
backend:dev:     'x-groq-region': 'msp',
backend:dev:     'x-request-id': 'req_01k58azd78e8tty9bq9tnvp82c'
backend:dev:   },
backend:dev:   error: {
backend:dev:     error: {
backend:dev:       message: 'Invalid API Key',
backend:dev:       type: 'invalid_request_error',
backend:dev:       code: 'invalid_api_key'
backend:dev:     }
backend:dev:   }
backend:dev: }
backend:dev: LLM call failed for agent economist: Error: Groq API error: 401 {"error":{"message":"Invalid API Key","type":"invalid_request_error","code":"invalid_api_key"}}
backend:dev:     at GroqService.createChatCompletion (/Users/brian/Public/general-repos/fin/finagent2/apps/backend/services/groq.service.ts:80:13)
backend:dev:     at processTicksAndRejections (node:internal/process/task_queues:105:5)
backend:dev:     at async callLLM (/Users/brian/Public/general-repos/fin/finagent2/apps/backend/steps/agent-executor.step.ts:91:26)
backend:dev:     at async Object.handler (/Users/brian/Public/general-repos/fin/finagent2/apps/backend/steps/agent-executor.step.ts:194:27)
backend:dev:     at async runTypescriptModule (/Users/brian/Public/general-repos/fin/finagent2/node_modules/.pnpm/@motiadev+core@0.6.4-beta.130_@types+node@20.19.13_bufferutil@4.0.9_typescript@5.9.2_utf-8-validate@5.0.10/node_modules/@motiadev/core/dist/src/node/node-runner.js:58:24)
backend:dev: [12:01:56 AM] WD1JE-5297844 [INFO] AgentExecutor Agent completed
backend:dev: ├ agent: economist
backend:dev: ├ stepIndex: 4
backend:dev: ├ totalSteps: 5
backend:dev: └ completedSteps: 5
backend:dev: [12:01:56 AM] WD1JE-5297844 [INFO] AgentExecutor All agents completed, generating executive summary
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ resultsCount: 5
backend:dev: Groq API error: AuthenticationError: 401 {"error":{"message":"Invalid API Key","type":"invalid_request_error","code":"invalid_api_key"}}
backend:dev:     at Function.generate (/Users/brian/Public/general-repos/fin/finagent2/node_modules/.pnpm/groq-sdk@0.32.0_encoding@0.1.13/node_modules/groq-sdk/src/error.ts:64:14)
backend:dev:     at Groq.makeStatusError (/Users/brian/Public/general-repos/fin/finagent2/node_modules/.pnpm/groq-sdk@0.32.0_encoding@0.1.13/node_modules/groq-sdk/src/core.ts:445:21)
backend:dev:     at Groq.makeRequest (/Users/brian/Public/general-repos/fin/finagent2/node_modules/.pnpm/groq-sdk@0.32.0_encoding@0.1.13/node_modules/groq-sdk/src/core.ts:511:24)
backend:dev:     at processTicksAndRejections (node:internal/process/task_queues:105:5)
backend:dev:     at async GroqService.createChatCompletion (/Users/brian/Public/general-repos/fin/finagent2/apps/backend/services/groq.service.ts:51:24)
backend:dev:     at async Function.generateExecutiveSummary (/Users/brian/Public/general-repos/fin/finagent2/apps/backend/services/summary-generator.service.ts:45:28)
backend:dev:     at async Object.handler (/Users/brian/Public/general-repos/fin/finagent2/apps/backend/steps/agent-executor.step.ts:261:32)
backend:dev:     at async runTypescriptModule (/Users/brian/Public/general-repos/fin/finagent2/node_modules/.pnpm/@motiadev+core@0.6.4-beta.130_@types+node@20.19.13_bufferutil@4.0.9_typescript@5.9.2_utf-8-validate@5.0.10/node_modules/@motiadev/core/dist/src/node/node-runner.js:58:24) {
backend:dev:   status: 401,
backend:dev:   headers: {
backend:dev:     'alt-svc': 'h3=":443"; ma=86400',
backend:dev:     'cache-control': 'private, max-age=0, no-store, no-cache, must-revalidate',
backend:dev:     'cf-cache-status': 'DYNAMIC',
backend:dev:     'cf-ray': '97fd7728be5258c1-EWR',
backend:dev:     connection: 'keep-alive',
backend:dev:     'content-length': '96',
backend:dev:     'content-type': 'application/json',
backend:dev:     date: 'Tue, 16 Sep 2025 04:01:56 GMT',
backend:dev:     server: 'cloudflare',
backend:dev:     'set-cookie': '__cf_bm=tZaZ9eM54h8ckYzW9MNI0lC.YgglNZ_NUOYwQ2gFTyA-1757995316-1.0.1.1-HEHnaGY5k.PyQ4186g55pkQ8m6HaMqYLmv0UYedNpU2BxZIZ1RYyCRte6X7LJ.4r_QqFoLA_EkV4_wQt_ya_S5VbiPIC1QqnHeuWANWckXg; path=/; expires=Tue, 16-Sep-25 04:31:56 GMT; domain=.groq.com; HttpOnly; Secure; SameSite=None',
backend:dev:     vary: 'Origin',
backend:dev:     via: '1.1 google',
backend:dev:     'x-groq-region': 'msp',
backend:dev:     'x-request-id': 'req_01k58azdccfk0ah1ja6f2ee2r7'
backend:dev:   },
backend:dev:   error: {
backend:dev:     error: {
backend:dev:       message: 'Invalid API Key',
backend:dev:       type: 'invalid_request_error',
backend:dev:       code: 'invalid_api_key'
backend:dev:     }
backend:dev:   }
backend:dev: }
backend:dev: Failed to generate executive summary: Error: Groq API error: 401 {"error":{"message":"Invalid API Key","type":"invalid_request_error","code":"invalid_api_key"}}
backend:dev:     at GroqService.createChatCompletion (/Users/brian/Public/general-repos/fin/finagent2/apps/backend/services/groq.service.ts:80:13)
backend:dev:     at processTicksAndRejections (node:internal/process/task_queues:105:5)
backend:dev:     at async Function.generateExecutiveSummary (/Users/brian/Public/general-repos/fin/finagent2/apps/backend/services/summary-generator.service.ts:45:28)
backend:dev:     at async Object.handler (/Users/brian/Public/general-repos/fin/finagent2/apps/backend/steps/agent-executor.step.ts:261:32)
backend:dev:     at async runTypescriptModule (/Users/brian/Public/general-repos/fin/finagent2/node_modules/.pnpm/@motiadev+core@0.6.4-beta.130_@types+node@20.19.13_bufferutil@4.0.9_typescript@5.9.2_utf-8-validate@5.0.10/node_modules/@motiadev/core/dist/src/node/node-runner.js:58:24)
backend:dev: [12:01:56 AM] WD1JE-5297844 [INFO] AgentExecutor Workflow completed with executive summary
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: ├ resultsCount: 6
backend:dev: └ message: Multi-agent analysis complete with executive summary
backend:dev: [12:01:56 AM] WD1JE-5297844 [INFO] AgentExecutor Agent executor completed
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: ├ agent: economist
backend:dev: └ stepIndex: 4
backend:dev: [12:01:56 AM] WD1JE-5297844 [INFO] WorkflowWSRelay Relaying workflow event to WebSocket stream
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: ├ streamKey: workflow-WD1JE-5297844
backend:dev: └ eventType: workflow.agent.completed
backend:dev: [12:01:56 AM] WD1JE-5297844 [ERROR] WorkflowWSRelay Error relaying workflow event to WebSocket
backend:dev: ├ error: streams.set is not a function
backend:dev: └ workflowId: WD1JE-5297844
backend:dev: [12:01:56 AM] WD1JE-5297844 [INFO] WorkflowStreamBroadcaster Processing workflow event
backend:dev: ├ type: workflow.agent.completed
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:56 AM] WD1JE-5297844 [INFO] SSEBroadcaster Broadcasting SSE event
backend:dev: ├ type: workflow.agent.completed
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:56 AM] WD1JE-5297844 [INFO] SSEBroadcaster SSE broadcast metrics
backend:dev: ├ connectedClients: 0
backend:dev: └ queuedMessages: 1
backend:dev: [12:01:56 AM] WD1JE-5297844 [DEBUG] WorkflowStreamBroadcaster Workflow event stored
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ eventType: workflow.agent.completed
backend:dev: [12:01:56 AM] WD1JE-5297844 [INFO] WorkflowWSRelay Relaying workflow event to WebSocket stream
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: ├ streamKey: workflow-WD1JE-5297844
backend:dev: └ eventType: workflow.completed
backend:dev: [12:01:56 AM] WD1JE-5297844 [ERROR] WorkflowWSRelay Error relaying workflow event to WebSocket
backend:dev: ├ error: streams.set is not a function
backend:dev: └ workflowId: WD1JE-5297844
backend:dev: [12:01:56 AM] WD1JE-5297844 [INFO] WorkflowStreamBroadcaster Processing workflow event
backend:dev: ├ type: workflow.completed
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:57 AM] WD1JE-5297844 [INFO] SSEBroadcaster Broadcasting SSE event
backend:dev: ├ type: workflow.completed
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ userId: user-1757995297817
backend:dev: [12:01:57 AM] WD1JE-5297844 [INFO] SSEBroadcaster SSE broadcast metrics
backend:dev: ├ connectedClients: 0
backend:dev: └ queuedMessages: 1
backend:dev: [12:01:57 AM] WD1JE-5297844 [DEBUG] WorkflowStreamBroadcaster Workflow event stored
backend:dev: ├ workflowId: WD1JE-5297844
backend:dev: └ eventType: workflow.completed
