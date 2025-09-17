import { TrendingUp, LineChart, PieChart, DollarSign, Shield, BarChart } from 'lucide-react'

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
  },
  {
    id: 'financial-planner',
    name: 'Financial Planner',
    description: 'Personal finance and investment planning expert',
    icon: DollarSign,
    color: 'bg-yellow-500',
    expertise: ['Investment Planning', 'Retirement', 'Tax Strategy'],
    route: '/chat/financial-planner'
  },
  {
    id: 'risk-manager',
    name: 'Risk Manager',
    description: 'Risk assessment and mitigation specialist',
    icon: Shield,
    color: 'bg-red-500',
    expertise: ['Risk Assessment', 'Hedging', 'Capital Protection'],
    route: '/chat/risk-manager'
  },
  {
    id: 'economist',
    name: 'Economic Analyst',
    description: 'Macroeconomic trends and policy analysis',
    icon: BarChart,
    color: 'bg-indigo-500',
    expertise: ['Economic Indicators', 'Policy Analysis', 'Market Impact'],
    route: '/chat/economist'
  }
]