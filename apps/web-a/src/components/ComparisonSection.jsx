import React from 'react'

function ComparisonSection() {
  const comparisonData = [
    {
      feature: 'Setup Time',
      ourPlatform: '5 minutes',
      competitor1: '2-3 hours',
      competitor2: '1-2 hours',
      traditional: '1-2 weeks'
    },
    {
      feature: 'Performance',
      ourPlatform: '99.9%',
      competitor1: '95%',
      competitor2: '92%',
      traditional: '85%'
    },
    {
      feature: 'Cost',
      ourPlatform: 'Free tier available',
      competitor1: '$99/month',
      competitor2: '$149/month',
      traditional: 'Custom pricing'
    },
    {
      feature: 'Support',
      ourPlatform: '24/7',
      competitor1: 'Business hours',
      competitor2: 'Email only',
      traditional: 'Limited'
    }
  ]

  return (
    <section id="compare" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16">
          See the <span className="gradient-text">Difference</span>
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-2xl shadow-lg overflow-hidden">
            <thead className="gradient-bg text-white">
              <tr>
                <th className="p-6 text-left">Feature</th>
                <th className="p-6 text-center">Our Platform</th>
                <th className="p-6 text-center">Competitor A</th>
                <th className="p-6 text-center">Competitor B</th>
                <th className="p-6 text-center">Traditional</th>
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