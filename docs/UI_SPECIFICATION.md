# Financial Assistant Chat Application - Complete UI Specification

## Overview
Create a modern, responsive financial assistant chat application with a collapsible sidebar, intelligent chat interface, and real-time workflow visualization.

## Core Layout Structure
- **Container**: Full-screen flex layout with light/dark mode support
- **Sidebar** (320px width, collapsible): Left panel with user controls
- **Main Content Area**: Flexible chat interface with header

## Sidebar Components (Collapsible)

### 1. Brand Header
- Logo icon (trending chart symbol)
- Application name "Fin Agent"
- Collapse/expand toggle button

### 2. User Information Panel
- Display logged-in user email
- Rounded container with subtle background
- Sign out button with icon

### 3. Assistant Selector Dropdown
- Current assistant display with colored indicator dot
- Dropdown menu with 6 assistant types:
  - **General Assistant** (blue) - General Finance, Education, Guidance
  - **Financial Analyst** (green) - Fundamental Analysis, Technical Analysis, Valuations
  - **Trading Assistant** (orange) - Day Trading, Technical Indicators, Risk Management
  - **Investment Advisor** (purple) - Portfolio Strategy, Retirement Planning, Tax Optimization
  - **Risk Manager** (red) - Risk Assessment, Hedging, Stress Testing
  - **Macro Economist** (indigo) - Economic Trends, Policy Impact, Market Cycles
- Each option shows name, description, and expertise tags

### 4. Bank Connection Management
- "Manage Accounts" button
- Plaid integration capability
- Modal/inline connection flow

### 5. Portfolio Summary Widget
- Total Value display
- Today's Change (with color coding)
- Connected Accounts count
- Subtle background container

### 6. Quick Actions
- View Charts button
- Settings button
- Sign Out button
- Full-width styled buttons with icons

## Main Chat Area

### 1. Header Bar
- Sidebar toggle button (hamburger/X icon)
- Selected assistant name and description
- Online status indicator with colored dot

### 2. Chat Messages Container
- Scrollable message history
- Message types:
  - **User messages** (right-aligned, blue background)
  - **Assistant messages** (left-aligned, gray background, with assistant icon)
  - **System messages** (gradient purple-pink background, with sparkle icon)
- Markdown rendering support for assistant responses
- Timestamp display for each message
- Empty state with assistant icon, greeting, and suggested prompts

### 3. Agent Workflow Status Panel
(Appears when multi-agent workflow active)
- Gradient background (purple to pink)
- Shows active agents with status indicators:
  - Pending (gray)
  - Processing (animated spinner)
  - Completed (green checkmark)
- Progress bars for each agent
- Workflow ID display
- Estimated completion time
- Close button

### 4. Message Input Area
- Multi-line textarea with auto-resize
- Placeholder text: "Ask [Assistant Name] anything..."
- Send button with icon
- Loading state with spinner
- Expertise tags display below input
- Enter to send, Shift+Enter for new line

## Interactive Features

### 1. Chat Functionality
- Real-time message streaming
- Workflow orchestration for complex queries
- Chart embedding support (TradingView integration)
- Message history persistence
- Auto-scroll to latest message

### 2. Multi-Agent Workflows
- Automatic detection of complex queries
- Visual progress tracking
- Real-time status updates via polling/SSE
- Compiled results display
- Individual agent result rendering

### 3. Assistant Intelligence
- Context-aware responses
- Specialized expertise per assistant type
- Workflow triggering for comprehensive analysis
- Integration with backend analysis APIs

## Visual Design Requirements

### 1. Color Scheme
- Light/dark mode support
- Assistant-specific color coding
- Gradient accents for system messages
- Status indicators (green for success, red for errors)

### 2. Typography
- Clear hierarchy with varied font sizes
- Monospace for code/data
- Regular for chat messages
- Bold for headers and emphasis

### 3. Animations
- Smooth sidebar collapse/expand
- Loading spinners
- Progress bar animations
- Message appearance transitions

### 4. Responsive Design
- Mobile-friendly sidebar collapse
- Adaptive message width
- Touch-friendly controls
- Minimum 320px width support

## State Management Requirements

- Current user session
- Selected assistant profile
- Message history array
- Active workflow tracking
- Sidebar visibility toggle
- Loading states for async operations
- Error handling and display

## API Integration Points

- `/api/chat/stream` - Main chat endpoint
- `/api/workflow/{id}/status` - Workflow status polling
- Authentication endpoints
- Plaid connection API
- Portfolio data endpoints

## Accessibility Features

- Keyboard navigation support
- ARIA labels for screen readers
- High contrast mode compatibility
- Focus indicators
- Semantic HTML structure

## Technical Implementation Notes

### Required Libraries/Frameworks
- React/Next.js for component architecture
- Tailwind CSS for styling
- Radix UI for accessible components
- React Markdown for message rendering
- Lucide React for icons
- WebSocket/SSE for real-time updates

### Component Structure
```
- HomePage (main container)
  - Sidebar
    - BrandHeader
    - UserInfoPanel
    - AssistantSelector
    - PlaidConnect
    - PortfolioSummary
    - QuickActions
  - MainContent
    - HeaderBar
    - SmartChatInterface
      - MessageContainer
      - AgentStatusPanel
      - MessageInput
```

### Key Features to Implement
1. Authentication flow with protected routes
2. Persistent chat history per user
3. Multi-agent workflow orchestration
4. Real-time status updates
5. Chart integration (TradingView)
6. Responsive design patterns
7. Dark mode toggle
8. Error boundary implementation
9. Loading state management
10. Accessibility compliance

This UI should provide a professional, feature-rich financial assistant experience with smooth interactions, real-time updates, and intelligent multi-agent coordination capabilities.