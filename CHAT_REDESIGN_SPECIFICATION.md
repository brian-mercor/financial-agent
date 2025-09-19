# Chat Interface Redesign Specification

## Overview
This document specifies the chat interface redesign implemented for financial assistant applications, transforming standard chat bubbles into professional report-style interfaces with enhanced markdown rendering.

## Changes Summary

### 1. Backend LLM Service Updates
**File**: `apps/backend/services/llm-service.ts`

#### System Prompts Enhancement
Transform all LLM responses into comprehensive, report-style outputs with structured markdown formatting.

**Base Prompt Structure**:
```typescript
const basePrompt = `You are an expert assistant that provides comprehensive, report-style responses.
Always format your responses using markdown with:
- Clear hierarchical headings (##, ###)
- Bullet points and numbered lists where appropriate
- Bold text for key terms and emphasis
- Tables for comparative data
- Code blocks when showing technical examples
- Blockquotes for important insights
- Horizontal rules to separate major sections

Structure your responses as professional reports with:
1. An executive summary or key takeaways section
2. Detailed analysis sections with clear headings
3. Supporting data and evidence
4. Actionable conclusions or recommendations

Be thorough and comprehensive, providing in-depth analysis rather than brief answers.`;
```

**Assistant-Specific Enhancements**:
- **General**: Well-researched responses on any topic
- **Analyst**: Institutional-grade market research reports with technical/fundamental analysis
- **Trader**: Detailed trading plans with entry/exit strategies
- **Advisor**: Comprehensive investment guidance with portfolio recommendations
- **Risk Manager**: Detailed risk assessment reports with VaR calculations
- **Economist**: Economic analysis reports with forecasts and scenarios

### 2. Frontend Layout Redesign

#### Desktop Layout (≥1024px)
**Two-column split design**:

**Left Panel (Reports) - Flex-1**:
- Full-width report display area
- Professional report header with timestamp
- Enhanced markdown rendering with custom styling
- Report selector for browsing multiple reports
- Auto-selects latest report

**Right Panel (Chat) - Fixed 384px width**:
- Compact chat sidebar
- Simplified message bubbles
- User messages: Right-aligned
- Assistant messages: Left-aligned with status indicator
- Minimal input area at bottom

#### Mobile/Tablet Layout (<1024px)
**Single column, center-aligned design**:

**Mobile Optimization (425px width)**:
- Responsive padding: `p-3` mobile, `p-4` tablet+
- Smaller typography with `sm:` breakpoint (640px)
- Compact components:
  - Avatar icons: 16x16px mobile, 20x20px tablet
  - Text sizes: `text-sm` mobile, `text-base` tablet
  - Reduced spacing between elements

**Message Cards**:
- Full-width cards for each message
- Clear header with user/assistant identification
- User messages: Light background with border
- Assistant reports: White background with shadow
- Horizontal scrolling for tables and code blocks

### 3. Markdown Styling Enhancements

#### Typography Hierarchy
```css
/* Headings */
h2: text-2xl (desktop) / text-xl (mobile)
h3: text-xl (desktop) / text-lg (mobile)

/* Body Text */
p: text-base (desktop) / text-sm (mobile)
li: text-base (desktop) / text-sm (mobile)
```

#### Custom Component Styling
```javascript
// Blockquotes
<blockquote className="border-l-4 border-blue-700 pl-4 my-4 italic text-gray-700 bg-blue-50 py-2 pr-4 rounded-r">

// Tables
<table className="min-w-full border-collapse border border-gray-300">
  <th className="border border-gray-300 px-4 py-2 bg-gray-100 font-semibold">
  <td className="border border-gray-300 px-4 py-2">

// Code
inline: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-blue-700">
block: <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">

// Strong emphasis
<strong className="font-bold text-blue-700">
```

### 4. Color Theme Migration (Purple → Royal Blue)

#### Color Replacements
| Purple/Indigo | Royal Blue | Usage |
|---------------|------------|--------|
| purple-500 | blue-700 | Primary actions, borders |
| purple-600 | blue-700/800 | Text, icons |
| purple-700 | blue-800 | Hover states, strong emphasis |
| indigo-500/600 | blue-800/900 | Gradients, dark accents |
| purple-50 | blue-50 | Light backgrounds |
| purple-100 | blue-100 | Secondary backgrounds |

#### CSS Gradients
```css
.gradient-bg {
  background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
}

.gradient-text {
  background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

## Implementation Guide for Other Frontend Apps

### Step 1: Update Backend LLM Service
Apply the system prompt changes to ensure all responses are formatted as reports.

### Step 2: Implement Layout Structure
1. **Desktop**: Create two-column layout
   - Reports panel (flex-1)
   - Chat sidebar (w-96 or 384px)
2. **Mobile**: Single column with responsive breakpoints

### Step 3: Apply Markdown Styling
1. Install dependencies:
   ```json
   "react-markdown": "^10.1.0",
   "remark-gfm": "^4.0.1"
   ```

2. Implement custom ReactMarkdown components as specified above

### Step 4: Update Color Theme
1. Search and replace all purple/indigo references
2. Update CSS gradients and custom classes
3. Verify focus states and hover effects

### Step 5: Mobile Optimization
1. Add responsive classes with `sm:` prefix
2. Implement horizontal scrolling for tables/code
3. Test on 425px viewport width

### Step 6: State Management
1. Add `selectedReport` state for desktop view
2. Auto-select latest assistant message on desktop
3. Implement report selector for multiple reports

## Testing Checklist

- [ ] Desktop layout (1440px): Two-column display works correctly
- [ ] Tablet layout (768px): Single column with proper spacing
- [ ] Mobile layout (425px): All content readable and accessible
- [ ] Markdown rendering: All elements styled correctly
- [ ] Color consistency: No purple/indigo remnants
- [ ] Streaming support: Real-time updates work
- [ ] Chart rendering: TradingView charts display properly
- [ ] Report selection: Can browse multiple reports on desktop
- [ ] Responsive text: Font sizes adjust appropriately
- [ ] Touch targets: Minimum 44px on mobile

## Files Modified

### Backend
- `apps/backend/services/llm-service.ts` - System prompts for report generation

### Frontend (apps/web-a)
- `src/components/SmartChatInterface.jsx` - Main chat interface redesign
- `src/components/AssistantSelector.jsx` - Color theme updates
- `src/components/AuthForm.jsx` - Focus state colors
- `src/components/HomePage.jsx` - Background and accent colors
- `src/components/Navigation.jsx` - Hover state colors
- `src/components/PlaidConnect.jsx` - Loading spinner color
- `src/components/ProtectedRoute.jsx` - Loading spinner color
- `src/pages/LoginPage.jsx` - Form focus states
- `src/index.css` - Global gradient classes

## Notes

- All frontend changes are isolated to `apps/web-a/`
- Backend changes affect all frontend apps (shared LLM service)
- Color theme uses Tailwind's blue-700 to blue-900 for royal blue appearance
- Mobile breakpoint uses Tailwind's `sm:` prefix (640px)
- Desktop breakpoint uses `lg:` prefix (1024px)