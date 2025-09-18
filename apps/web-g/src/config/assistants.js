import { TrendingUp, LineChart, PieChart, BarChart, Activity, DollarSign } from 'lucide-react'

export const assistants = [
  {
    id: 'market-analyst',
    name: 'Market Analyst',
    description: 'Expert in market trends and technical analysis',
    icon: TrendingUp,
    color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    expertise: ['Technical Analysis', 'Market Trends', 'Chart Patterns'],
    route: '/chat/market-analyst'
  },
  {
    id: 'trading-advisor',
    name: 'Trading Advisor',
    description: 'Specialized in trading strategies and risk management',
    icon: LineChart,
    color: 'bg-gradient-to-r from-green-500 to-emerald-500',
    expertise: ['Trading Strategies', 'Risk Management', 'Position Sizing'],
    route: '/chat/trading-advisor'
  },
  {
    id: 'portfolio-manager',
    name: 'Portfolio Manager',
    description: 'Focused on portfolio optimization and asset allocation',
    icon: PieChart,
    color: 'bg-gradient-to-r from-purple-500 to-pink-500',
    expertise: ['Asset Allocation', 'Diversification', 'Rebalancing'],
    route: '/chat/portfolio-manager'
  },
  {
    id: 'risk-manager',
    name: 'Risk Manager',
    description: 'Expert in risk assessment and mitigation strategies',
    icon: Activity,
    color: 'bg-gradient-to-r from-red-500 to-orange-500',
    expertise: ['Risk Assessment', 'Stop Loss', 'Position Management'],
    route: '/chat/risk-manager'
  },
  {
    id: 'crypto-specialist',
    name: 'Crypto Specialist',
    description: 'Cryptocurrency and DeFi expert',
    icon: DollarSign,
    color: 'bg-gradient-to-r from-yellow-500 to-amber-500',
    expertise: ['Cryptocurrency', 'DeFi', 'Blockchain Analysis'],
    route: '/chat/crypto-specialist'
  }
]