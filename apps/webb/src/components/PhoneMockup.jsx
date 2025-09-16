import React from 'react'

function PhoneMockup() {
  return (
    <div className="phone-mockup">
      <div className="phone-screen">
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="text-2xl font-bold gradient-text mb-2">Dashboard</div>
            <div className="text-gray-600">Overview</div>
            <div className="text-4xl font-bold text-gray-900">Welcome</div>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-6 text-white mb-4">
            <div className="text-sm opacity-90">Total Activity</div>
            <div className="text-3xl font-bold">+25%</div>
          </div>
          <div className="space-y-3">
            <div className="bg-gray-100 rounded-xl p-4 flex justify-between">
              <span className="text-gray-700">Status</span>
              <span className="text-green-500">Active</span>
            </div>
            <div className="bg-gray-100 rounded-xl p-4 flex justify-between">
              <span className="text-gray-700">Recent Activity</span>
              <span className="text-gray-900">5 mins ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PhoneMockup