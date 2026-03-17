import React, { useEffect, useState } from 'react'
import { FaUser, FaShieldAlt, FaClipboard, FaCheckCircle } from 'react-icons/fa'
import { useAuth, useData, loadWorkerData } from '../stores'
import { apiClient } from '../api/client'
import type { Worker, InsurancePlan, Subscription } from '../types'

const WorkerPortal: React.FC = () => {
  const { user } = useAuth()
  const { claims, loading } = useData()
  const [plans, setPlans] = useState<InsurancePlan[]>([
    {
      id: 1,
      name: 'DAILY',
      duration_days: 1,
      premium_amount: 5,
      payout_amount: 200,
      active: true,
    },
    {
      id: 2,
      name: 'WEEKLY',
      duration_days: 7,
      premium_amount: 25,
      payout_amount: 200,
      active: true,
    },
    {
      id: 3,
      name: 'MONTHLY',
      duration_days: 30,
      premium_amount: 120,
      payout_amount: 200,
      active: true,
    },
  ])
  const [activeTab, setActiveTab] = useState('overview')
  const [subscription, setSubscription] = useState<Subscription | null>(null)

  useEffect(() => {
    if (user?.id) {
      loadWorkerData(user.id)
      loadSubscription()
    }
  }, [user])

  const loadSubscription = async () => {
    if (user?.id) {
      try {
        const sub = await apiClient.getSubscription(user.id)
        setSubscription(sub)
      } catch (error) {
        console.error('Failed to load subscription', error)
      }
    }
  }

  const handleSubscribe = async (planId: number) => {
    if (!user?.id) return
    try {
      await apiClient.createSubscription(user.id, planId)
      await loadSubscription()
      alert('Successfully subscribed to the plan!')
    } catch (error) {
      alert('Failed to subscribe: ' + (error as Error).message)
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Worker Portal</h1>
          <p className="text-gray-600">Please log in to access the worker portal.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 rounded-full p-3">
              <FaUser className="text-2xl text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
              <p className="text-gray-600">{user.platform} • {user.zone}</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex gap-8">
            {['overview', 'plans', 'claims', 'payouts'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 font-medium capitalize ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Coverage Status</h2>
              {subscription ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FaCheckCircle className="text-green-600" />
                    <span className="font-semibold text-green-700">Active Subscription</span>
                  </div>
                  <p className="text-gray-700">
                    Plan: {subscription.plan_id} | Premium: ₹{subscription.premium_paid} | 
                    Valid until: {new Date(subscription.expiry_date).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-700">No active subscription. Subscribe to a plan to get covered.</p>
                </div>
              )}
            </div>
          )}

          {/* Plans Tab */}
          {activeTab === 'plans' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Insurance Plans</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {plans.map((plan) => (
                  <div key={plan.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-2">Duration: {plan.duration_days} day(s)</p>
                    <p className="text-sm text-gray-500 mb-4">Premium: ₹{plan.premium_amount}</p>
                    <div className="bg-blue-50 p-3 rounded mb-4">
                      <p className="text-lg font-bold text-blue-600">₹{plan.payout_amount}</p>
                      <p className="text-sm text-gray-600">Payout amount</p>
                    </div>
                    <button
                      onClick={() => handleSubscribe(plan.id)}
                      className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    >
                      Subscribe Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Claims Tab */}
          {activeTab === 'claims' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Claims</h2>
              {loading ? (
                <p className="text-gray-600">Loading claims...</p>
              ) : claims.length > 0 ? (
                <div className="space-y-3">
                  {claims.map((claim) => (
                    <div key={claim.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-800">Claim #{claim.id}</p>
                          <p className="text-sm text-gray-600">Amount: ₹{claim.claim_amount}</p>
                          <p className="text-sm text-gray-600">Status: {claim.status}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          claim.status === 'PAID' ? 'bg-green-100 text-green-800' :
                          claim.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {claim.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No claims yet.</p>
              )}
            </div>
          )}

          {/* Payouts Tab */}
          {activeTab === 'payouts' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment History</h2>
              <p className="text-gray-600">Your approved claims will show here as payouts.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WorkerPortal
