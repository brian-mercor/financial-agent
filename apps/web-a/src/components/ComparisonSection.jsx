import React from 'react'

function ComparisonSection() {
  const comparisonData = [
    {
      feature: 'AI Models',
      ourPlatform: 'GPT-4 + Claude',
      competitor1: 'Basic AI',
      competitor2: 'No AI',
      traditional: 'Manual Analysis'
    },
    {
      feature: 'Win Rate',
      ourPlatform: '68%',
      competitor1: '52%',
      competitor2: '48%',
      traditional: '45%'
    },
    {
      feature: 'Pricing',
      ourPlatform: 'Free tier + $29/mo',
      competitor1: '$99/month',
      competitor2: '$149/month',
      traditional: '2% commission'
    },
    {
      feature: 'Market Coverage',
      ourPlatform: 'Stocks, Crypto, Forex',
      competitor1: 'Stocks only',
      competitor2: 'Crypto only',
      traditional: 'Limited'
    }
  ]

  return (
    <section id="compare" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16">
          Why Finagent <span className="gradient-text">Outperforms</span>
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-2xl shadow-lg overflow-hidden">
            <thead className="gradient-bg text-white">
              <tr>
                <th className="p-6 text-left">Feature</th>
                <th className="p-6 text-center">Finagent AI</th>
                <th className="p-6 text-center">Robo-Advisors</th>
                <th className="p-6 text-center">Trading Bots</th>
                <th className="p-6 text-center">Human Advisors</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="p-6 font-semibold">{row.feature}</td>
                  <td className="p-6 text-center text-green-500 font-bold">{row.ourPlatform}</td>
                  <td className="p-6 text-center text-gray-500">{row.competitor1}</td>
                  <td className="p-6 text-center text-gray-500">{row.competitor2}</td>
                  <td className="p-6 text-center text-gray-500">{row.traditional}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default ComparisonSection