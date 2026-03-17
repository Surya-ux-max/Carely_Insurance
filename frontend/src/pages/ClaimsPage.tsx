import React, { useState, useEffect } from 'react'
import { FaCheckCircle, FaClock, FaTimesCircle, FaFileAlt, FaDownload, FaSearch } from 'react-icons/fa'
import { apiClient } from '../api/client'

interface Claim {
  id: number
  worker_id: string
  amount: number
  status: 'PENDING' | 'VERIFIED' | 'APPROVED' | 'PAID' | 'REJECTED'
  date: string
  description: string
  fraud_score?: number
}

const ClaimsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('ALL')
  const [claims, setClaims] = useState<Claim[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadClaims()
  }, [])

  const loadClaims = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiClient.listAllClaims()
      const claimsData = response.claims || []
      // Transform backend data to match Claim interface
      const transformedClaims: Claim[] = claimsData.map((c: any) => ({
        id: c.id,
        worker_id: c.worker_id.toString(),
        amount: c.amount,
        status: c.status,
        date: c.date,
        description: c.description || '',
        fraud_score: c.fraud_score || 0,
      }))
      setClaims(transformedClaims)
    } catch (err) {
      console.error('Failed to load claims:', err)
      setError('Failed to load claims from backend')
      // Fallback to mock data
      const mockClaims: Claim[] = [
        {
          id: 1,
          worker_id: 'W001',
          amount: 500,
          status: 'PAID',
          date: '2024-03-15',
          description: 'Heavy rainfall disruption',
          fraud_score: 0.08,
        },
        {
          id: 2,
          worker_id: 'W002',
          amount: 300,
          status: 'APPROVED',
          date: '2024-03-14',
          description: 'Extreme temperature event',
          fraud_score: 0.12,
        },
        {
          id: 3,
          worker_id: 'W003',
          amount: 400,
          status: 'VERIFIED',
          date: '2024-03-13',
          description: 'Air quality degradation',
          fraud_score: 0.15,
        },
        {
          id: 4,
          worker_id: 'W004',
          amount: 250,
          status: 'PENDING',
          date: '2024-03-12',
          description: 'Flooding event',
          fraud_score: 0.22,
        },
      ]
      setClaims(mockClaims)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID':
        return <FaCheckCircle className="text-green-600" />
      case 'APPROVED':
        return <FaCheckCircle className="text-blue-600" />
      case 'VERIFIED':
        return <FaClock className="text-yellow-600" />
      case 'PENDING':
        return <FaClock className="text-gray-600" />
      default:
        return <FaTimesCircle className="text-red-600" />
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'badge-success'
      case 'APPROVED':
        return 'badge bg-blue-100 text-blue-800'
      case 'VERIFIED':
        return 'badge bg-yellow-100 text-yellow-800'
      case 'PENDING':
        return 'badge bg-gray-100 text-gray-800'
      default:
        return 'badge-danger'
    }
  }

  const filteredClaims = claims.filter((claim) => {
    const matchesSearch =
      claim.worker_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.id.toString().includes(searchTerm)
    const matchesFilter = filterStatus === 'ALL' || claim.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const statsData = [
    {
      title: 'Total Claims',
      value: claims.length,
      icon: FaFileAlt,
      color: 'blue',
    },
    {
      title: 'Paid',
      value: claims.filter((c) => c.status === 'PAID').length,
      icon: FaCheckCircle,
      color: 'green',
    },
    {
      title: 'Pending',
      value: claims.filter((c) => c.status === 'PENDING').length,
      icon: FaClock,
      color: 'yellow',
    },
    {
      title: 'Rejected',
      value: claims.filter((c) => c.status === 'REJECTED').length,
      icon: FaTimesCircle,
      color: 'red',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">
            Claims Management
          </h1>
          <p className="text-lg text-gray-600 font-medium">Manage and track all insurance claims</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="inline-block animate-spin mb-4">
                <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
              </div>
              <p className="text-gray-600 font-semibold">Loading claims...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">⚠️ {error} - Showing mock data</p>
          </div>
        )}

        {!loading && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8 animate-fade-in">
          {statsData.map((stat, i) => {
            const Icon = stat.icon
            return (
              <div key={i} className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-2 border-t-4" style={{ borderTopColor: stat.color === 'blue' ? '#2563eb' : stat.color === 'green' ? '#10b981' : stat.color === 'yellow' ? '#f59e0b' : '#ef4444' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div 
                    className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
                    style={{
                      backgroundColor: stat.color === 'blue' ? '#dbeafe' : stat.color === 'green' ? '#dcfce7' : stat.color === 'yellow' ? '#fef3c7' : '#fee2e2',
                      color: stat.color === 'blue' ? '#2563eb' : stat.color === 'green' ? '#10b981' : stat.color === 'yellow' ? '#f59e0b' : '#ef4444'
                    }}
                  >
                    <Icon />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Worker ID or Claim ID..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="VERIFIED">Verified</option>
              <option value="APPROVED">Approved</option>
              <option value="PAID">Paid</option>
              <option value="REJECTED">Rejected</option>
            </select>

            {/* Export Button */}
            <button className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold transition-all duration-300 hover:bg-blue-700 hover:-translate-y-0.5 shadow-md hover:shadow-lg flex items-center justify-center gap-2">
              <FaDownload /> Export
            </button>
          </div>
        </div>

        {/* Claims Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Claim ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Worker ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Risk</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredClaims.length > 0 ? (
                  filteredClaims.map((claim) => (
                    <tr key={claim.id} className="border-b border-gray-200 hover:bg-blue-50 transition-colors duration-200">
                      <td className="px-6 py-4 font-semibold text-gray-800">#{claim.id}</td>
                      <td className="px-6 py-4 text-gray-700">{claim.worker_id}</td>
                      <td className="px-6 py-4 font-semibold text-gray-800">₹{claim.amount}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                          claim.status === 'PAID' ? 'bg-green-100 text-green-800' :
                          claim.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' :
                          claim.status === 'VERIFIED' ? 'bg-yellow-100 text-yellow-800' :
                          claim.status === 'PENDING' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {getStatusIcon(claim.status)}
                          {claim.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{claim.date}</td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{claim.description}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                              className="h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${(claim.fraud_score || 0) * 100}%`,
                                backgroundColor:
                                  (claim.fraud_score || 0) > 0.5
                                    ? '#ef4444'
                                    : (claim.fraud_score || 0) > 0.3
                                      ? '#f59e0b'
                                      : '#10b981',
                              }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 w-8">
                            {((claim.fraud_score || 0) * 100).toFixed(0)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200">
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-600">
                      No claims found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ClaimsPage
