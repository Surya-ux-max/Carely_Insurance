import React, { useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'
import { FaUsers, FaClipboard, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa'
import { useData, loadDashboardStats } from '../stores'

const AdminDashboard: React.FC = () => {
  const { stats, loading } = useData()

  useEffect(() => {
    loadDashboardStats()
  }, [])

  const chartData = [
    { name: 'Jan', workers: 120, subscriptions: 100, claims: 8 },
    { name: 'Feb', workers: 135, subscriptions: 115, claims: 12 },
    { name: 'Mar', workers: 150, subscriptions: 120, claims: 15 },
  ]

  const getColorClasses = (color: string) => {
    const colors: { [key: string]: { bg: string; text: string } } = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
      green: { bg: 'bg-green-100', text: 'text-green-600' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-600' },
      red: { bg: 'bg-red-100', text: 'text-red-600' },
    }
    return colors[color] || colors.blue
  }

  const statCards = [
    { title: 'Total Workers', value: stats?.total_workers || 0, icon: FaUsers, color: 'blue' },
    { title: 'Active Subscriptions', value: stats?.active_subscriptions || 0, icon: FaCheckCircle, color: 'green' },
    { title: 'Total Claims', value: stats?.total_claims || 0, icon: FaClipboard, color: 'orange' },
    { title: 'Fraud Detected', value: stats?.fraud_detected || 0, icon: FaExclamationTriangle, color: 'red' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin">
            <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
          </div>
          <p className="mt-4 text-gray-600 font-semibold">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-lg text-gray-600 font-medium">Monitor and manage platform metrics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8 animate-fade-in">
          {statCards.map((stat, i) => {
            const Icon = stat.icon
            const borderColor = stat.color === 'blue' ? '#2563eb' : stat.color === 'green' ? '#10b981' : stat.color === 'orange' ? '#f59e0b' : '#ef4444'
            const bgColor = stat.color === 'blue' ? '#dbeafe' : stat.color === 'green' ? '#dcfce7' : stat.color === 'orange' ? '#fef3c7' : '#fee2e2'
            const textColor = stat.color === 'blue' ? '#2563eb' : stat.color === 'green' ? '#10b981' : stat.color === 'orange' ? '#f59e0b' : '#ef4444'
            
            return (
              <div key={i} className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-2 border-t-4" style={{ borderTopColor: borderColor }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div 
                    className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
                    style={{ backgroundColor: bgColor, color: textColor }}
                  >
                    <Icon />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 animate-fade-in">
          {/* Bar Chart */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-4 border-b border-gray-200">Monthly Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="workers" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                <Bar dataKey="subscriptions" fill="#10b981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="claims" fill="#f59e0b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Line Chart */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-4 border-b border-gray-200">Claims Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="claims" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', r: 5 }} activeDot={{ r: 7 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-2 border-t-4 border-blue-600">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Pending Claims</h3>
            <p className="text-3xl font-bold text-blue-600">{stats?.pending_claims || 0}</p>
            <p className="text-xs text-gray-500 mt-2">Requiring verification</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-2 border-t-4 border-green-600">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Avg Payout Time</h3>
            <p className="text-3xl font-bold text-green-600">{stats?.average_payout_time ? stats.average_payout_time.toFixed(1) : 0}h</p>
            <p className="text-xs text-gray-500 mt-2">From approval to completion</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-2 border-t-4 border-orange-600">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Success Rate</h3>
            <p className="text-3xl font-bold text-orange-600">
              {stats?.total_claims ? Math.round(((stats.total_payouts || 0) / stats.total_claims) * 100) : 0}%
            </p>
            <p className="text-xs text-gray-500 mt-2">Payouts completed</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
