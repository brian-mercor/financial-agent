import { TrendingUp, LineChart, PieChart } from 'lucide-react'

export const assistants = [
  {
    id: 'market-analyst',
    name: 'Market Analyst',
    description: 'Expert in market trends and technical analysis',
    icon: TrendingUp,
    color: 'bg-blue-500',
    expertise: ['Technical Analysis', 'Market Trends', 'Chart Patterns'],
    route: '/chat/market-analyst'
  },
  {
    id: 'trading-advisor',
    name: 'Trading Advisor',
    description: 'Specialized in trading strategies and risk management',
    icon: LineChart,
    color: 'bg-green-500',
    expertise: ['Trading Strategies', 'Risk Management', 'Position Sizing'],
    route: '/chat/trading-advisor'
  },
  {
    id: 'portfolio-manager',
    name: 'Portfolio Manager',
    description: 'Focused on portfolio optimization and asset allocation',
    icon: PieChart,
    color: 'bg-purple-500',
    expertise: ['Asset Allocation', 'Diversification', 'Rebalancing'],
    route: '/chat/portfolio-manager'
  }
]