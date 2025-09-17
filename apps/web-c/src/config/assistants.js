import { TrendingUp, LineChart, PieChart, Shield, Globe } from 'lucide-react'

export const assistants = [
  {
    id: 'general',
    name: 'General Assistant',
    description: 'Your all-purpose financial AI companion',
    icon: Globe,
    color: 'bg-gray-500',
    expertise: ['Market Overview', 'Quick Analysis', 'Basic Trading'],
    route: '/chat/general'
  },
  {
    id: 'analyst',
    name: 'Market Analyst',
    description: 'Expert in market trends and technical analysis',
    icon: TrendingUp,
    color: 'bg-blue-500',
    expertise: ['Technical Analysis', 'Market Trends', 'Chart Patterns'],
    route: '/chat/analyst'
  },
  {
    id: 'trader',
    name: 'Trading Advisor',
    description: 'Specialized in trading strategies and execution',
    icon: LineChart,
    color: 'bg-green-500',
    expertise: ['Trading Strategies', 'Entry/Exit Points', 'Position Sizing'],
    route: '/chat/trader'
  },
  {
    id: 'advisor',
    name: 'Portfolio Manager',
    description: 'Focused on portfolio optimization and allocation',
    icon: PieChart,
    color: 'bg-purple-500',
    expertise: ['Asset Allocation', 'Diversification', 'Rebalancing'],
    route: '/chat/advisor'
  },
  {
    id: 'riskManager',
    name: 'Risk Manager',
    description: 'Specialized in risk assessment and mitigation',
    icon: Shield,
    color: 'bg-red-500',
    expertise: ['Risk Assessment', 'Stop-Loss Strategy', 'Hedging'],
    route: '/chat/risk-manager'
  }
]