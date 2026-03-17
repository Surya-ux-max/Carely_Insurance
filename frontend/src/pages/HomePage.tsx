
import React from 'react'
import { Link } from 'react-router-dom'
import { FaShieldAlt, FaBolt, FaHeartbeat, FaChartLine } from 'react-icons/fa'

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800 text-white">
      {/* Hero */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">GigShield AI</h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Parametric Insurance for Gig Workers
          </p>
          <p className="text-lg text-blue-100 mb-12 max-w-2xl mx-auto">
            Instant protection against income disruption. Get covered, get verified, get paid—all in minutes.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/worker"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Worker Portal
            </Link>
            <Link
              to="/admin"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
            >
              Admin Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold mb-12 text-center">Why Choose GigShield?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: FaBolt, title: 'Instant Claims', desc: 'No paperwork. Automatic detection and verification.' },
            { icon: FaChartLine, title: 'AI Powered', desc: 'ML models detect disruptions in real-time.' },
            { icon: FaHeartbeat, title: 'Always Available', desc: 'Coverage when you need it most.' },
            { icon: FaShieldAlt, title: 'Fraud Protected', desc: 'Advanced fraud detection keeps everyone safe.' },
          ].map((feature, i) => {
            const Icon = feature.icon
            return (
              <div key={i} className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6 text-center">
                <Icon className="text-4xl mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-blue-100 text-sm">{feature.desc}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-black bg-opacity-20 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            {[
              { num: '1', title: 'Subscribe', desc: 'Choose your insurance plan' },
              { num: '2', title: 'Monitor', desc: 'AI tracks environmental data' },
              { num: '3', title: 'Detect', desc: 'Disruption gets flagged' },
              { num: '4', title: 'Pay', desc: 'Instant payout to your account' },
            ].map((step, i) => (
              <div key={i}>
                <div className="bg-white text-blue-600 w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl mx-auto mb-4">
                  {step.num}
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-blue-100 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
