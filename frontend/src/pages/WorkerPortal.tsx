import React, { useEffect, useState } from 'react'
import {
  FaShieldAlt, FaClipboard, FaCheckCircle, FaRupeeSign,
  FaCalendarAlt, FaMapMarkerAlt, FaMobileAlt, FaBolt,
  FaChartLine, FaClock, FaArrowRight, FaExclamationTriangle,
  FaWifi, FaCloudRain, FaThermometerHalf, FaMotorcycle
} from 'react-icons/fa'
import { useData, useAuth, loadWorkerData } from '../stores'
import { apiClient } from '../api/client'
import type { InsurancePlan, Subscription } from '../types'

const PLANS: InsurancePlan[] = [
  { id: 1, name: 'DAILY',   duration_days: 1,  premium_amount: 5,   payout_amount: 200, active: true },
  { id: 2, name: 'WEEKLY',  duration_days: 7,  premium_amount: 25,  payout_amount: 500, active: true },
  { id: 3, name: 'MONTHLY', duration_days: 30, premium_amount: 120, payout_amount: 2000, active: true },
]

const TABS = [
  { id: 'overview', label: 'Overview',  icon: FaChartLine  },
  { id: 'plans',    label: 'Plans',     icon: FaShieldAlt  },
  { id: 'claims',   label: 'Claims',    icon: FaClipboard  },
  { id: 'payouts',  label: 'Payouts',   icon: FaRupeeSign  },
]

/* ── Status badge ── */
const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    PAID:     'bg-green-100 text-green-700 border-green-200',
    APPROVED: 'bg-blue-100 text-blue-700 border-blue-200',
    VERIFIED: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    PENDING:  'bg-gray-100 text-gray-600 border-gray-200',
    REJECTED: 'bg-red-100 text-red-700 border-red-200',
  }
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${map[status] || map.PENDING}`}>
      {status}
    </span>
  )
}

const MOCK_USER = { id: 1, name: 'Suryaprakash S', platform: 'Swiggy', zone: 'Chennai Central' }

const WorkerPortal: React.FC = () => {
  const { user: authUser } = useAuth()
  const user = authUser?.id ? { id: authUser.id, name: authUser.name, platform: authUser.platform, zone: authUser.zone } : MOCK_USER
  const { claims, loading } = useData()
  const [activeTab, setActiveTab]       = useState('overview')
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [subscribing, setSubscribing]   = useState<number | null>(null)

  useEffect(() => {
    loadWorkerData(user.id)
    fetchSub()
  }, [])

  const fetchSub = async () => {
    try { setSubscription(await apiClient.getSubscription(user.id)) } catch {}
  }

  const handleSubscribe = async (planId: number) => {
    setSubscribing(planId)
    try {
      await apiClient.createSubscription(user.id, planId)
      await fetchSub()
      await loadWorkerData(user.id)
    } catch (e) { alert('Failed: ' + (e as Error).message) }
    finally { setSubscribing(null) }
  }

  const daysLeft = subscription
    ? Math.max(0, Math.ceil((new Date(subscription.expiry_date).getTime() - Date.now()) / 86400000))
    : 0

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ════════════════════════════════
          HERO SECTION
      ════════════════════════════════ */}
      <section className="relative bg-white overflow-hidden border-b border-gray-100">
        {/* bg decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-50 rounded-full -translate-y-1/3 translate-x-1/3 opacity-60" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-red-50 rounded-full translate-y-1/2 -translate-x-1/3 opacity-40" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[520px]">

            {/* Left — worker info */}
            <div className="py-12">
              {/* status pill */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-100 rounded-full mb-8">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-semibold text-gray-700">Active Gig Worker</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-3">
                Hey, {user.name.split(' ')[0]} 👋
              </h1>
              <p className="text-gray-400 text-lg font-light mb-8">
                Your income is protected. Here's your coverage dashboard.
              </p>

              {/* worker meta */}
              <div className="flex flex-wrap gap-4 mb-10">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl">
                  <FaMobileAlt className="text-red-500 text-sm" />
                  <span className="text-sm font-semibold text-gray-700">{user.platform}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl">
                  <FaMapMarkerAlt className="text-red-500 text-sm" />
                  <span className="text-sm font-semibold text-gray-700">{user.zone}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl">
                  <FaShieldAlt className="text-red-500 text-sm" />
                  <span className="text-sm font-semibold text-gray-700">
                    {subscription ? `Covered · ${daysLeft}d left` : 'Not Covered'}
                  </span>
                </div>
              </div>

              {/* quick stats */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Total Claims',   value: claims.length,                                    icon: FaClipboard  },
                  { label: 'Paid Out',       value: `₹${claims.filter(c => c.status === 'PAID').reduce((a, c) => a + c.claim_amount, 0)}`, icon: FaRupeeSign },
                  { label: 'Coverage Days',  value: subscription ? `${daysLeft}d` : '—',              icon: FaClock      },
                ].map((s, i) => (
                  <div key={i} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                    <s.icon className="text-red-500 text-base mb-2" />
                    <p className="text-xl font-black text-gray-900">{s.value}</p>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — floating info cards */}
            <div className="relative h-[480px] lg:h-[520px] hidden lg:flex items-center justify-center">
              {/* centre shield */}
              <div className="absolute w-36 h-36 bg-gradient-to-br from-red-600 to-red-700 rounded-3xl shadow-2xl shadow-red-200 flex flex-col items-center justify-center gap-1 rotate-3">
                <FaShieldAlt className="text-white text-4xl" />
                <span className="text-white text-xs font-black tracking-widest">CARELY</span>
              </div>

              {/* card — payout */}
              <div className="absolute top-8 right-8 bg-white rounded-2xl shadow-xl border border-gray-100 px-5 py-4 flex items-center gap-3 animate-float" style={{ animationDelay: '0s', animationDuration: '3s' }}>
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                  <FaRupeeSign className="text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Instant Payout</p>
                  <p className="text-lg font-black text-gray-900">₹450 <span className="text-green-500 text-xs font-bold">PAID</span></p>
                </div>
              </div>

              {/* card — coverage */}
              <div className="absolute top-24 left-4 bg-white rounded-2xl shadow-xl border border-gray-100 px-5 py-4 flex items-center gap-3 animate-float" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }}>
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                  <FaShieldAlt className="text-red-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Coverage</p>
                  <p className="text-sm font-black text-gray-900">Active · 24/7</p>
                </div>
              </div>

              {/* card — disruption alert */}
              <div className="absolute bottom-28 right-6 bg-white rounded-2xl shadow-xl border border-orange-100 px-5 py-4 flex items-center gap-3 animate-float" style={{ animationDelay: '1s', animationDuration: '4s' }}>
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                  <FaCloudRain className="text-orange-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Disruption Detected</p>
                  <p className="text-sm font-black text-gray-900">Heavy Rain · Zone 4</p>
                </div>
              </div>

              {/* card — claim time */}
              <div className="absolute bottom-16 left-6 bg-white rounded-2xl shadow-xl border border-gray-100 px-5 py-4 flex items-center gap-3 animate-float" style={{ animationDelay: '1.5s', animationDuration: '3.2s' }}>
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <FaClock className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Claim Processed</p>
                  <p className="text-sm font-black text-gray-900">In 2 minutes</p>
                </div>
              </div>

              {/* card — AI score */}
              <div className="absolute top-1/2 right-2 -translate-y-1/2 bg-white rounded-2xl shadow-xl border border-purple-100 px-5 py-4 flex items-center gap-3 animate-float" style={{ animationDelay: '0.8s', animationDuration: '3.8s' }}>
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                  <FaChartLine className="text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Risk Score</p>
                  <p className="text-sm font-black text-gray-900">0.82 · HIGH</p>
                </div>
              </div>

              {/* card — platform */}
              <div className="absolute top-1/2 left-0 -translate-y-1/2 bg-white rounded-2xl shadow-xl border border-gray-100 px-5 py-4 flex items-center gap-3 animate-float" style={{ animationDelay: '2s', animationDuration: '2.9s' }}>
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                  <FaMotorcycle className="text-red-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Platform</p>
                  <p className="text-sm font-black text-gray-900">Online · Active</p>
                </div>
              </div>

              {/* bottom badge */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/90 backdrop-blur border border-red-100 rounded-full px-4 py-2 shadow-md whitespace-nowrap">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-xs font-semibold text-gray-600">Protected by Carely · AI-Powered</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          COVERAGE ALERT BANNER
      ════════════════════════════════ */}
      {!subscription && (
        <div className="bg-red-600 py-4 px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <FaExclamationTriangle className="text-red-200 text-lg flex-shrink-0" />
              <p className="text-white text-sm font-semibold">You have no active coverage. Subscribe to a plan to get protected instantly.</p>
            </div>
            <button onClick={() => setActiveTab('plans')} className="btn-white text-sm px-5 py-2 rounded-xl flex-shrink-0">
              View Plans <FaArrowRight />
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════════════
          MAIN CONTENT
      ════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">

        {/* Tab bar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-1.5 flex gap-1 mb-8">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-red-600 text-white shadow-md shadow-red-200'
                  : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
              }`}
            >
              <tab.icon className="text-xs" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {activeTab === 'overview' && (
          <div className="animate-fade-in space-y-6">

            {/* Coverage card */}
            {subscription ? (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-6">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <p className="text-red-200 text-sm font-medium mb-1">Active Coverage</p>
                      <h2 className="text-3xl font-black text-white">Plan #{subscription.plan_id}</h2>
                    </div>
                    <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-white text-sm font-semibold">ACTIVE</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-gray-100">
                  {[
                    { label: 'Premium Paid',  value: `₹${subscription.premium_paid}`,                              icon: FaRupeeSign    },
                    { label: 'Valid Until',   value: new Date(subscription.expiry_date).toLocaleDateString('en-IN'), icon: FaCalendarAlt  },
                    { label: 'Days Left',     value: `${daysLeft} days`,                                            icon: FaClock        },
                    { label: 'Status',        value: subscription.status,                                           icon: FaCheckCircle  },
                  ].map((item, i) => (
                    <div key={i} className="p-6">
                      <item.icon className="text-red-400 text-base mb-2" />
                      <p className="text-lg font-black text-gray-900">{item.value}</p>
                      <p className="text-xs text-gray-400 font-medium mt-0.5">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border-2 border-dashed border-red-200 p-10 text-center">
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FaShieldAlt className="text-red-400 text-2xl" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">No Active Coverage</h3>
                <p className="text-gray-400 text-sm mb-6 max-w-xs mx-auto">Subscribe to a plan to start getting protected against income disruptions.</p>
                <button onClick={() => setActiveTab('plans')} className="btn-primary px-8 py-3 rounded-2xl">
                  Browse Plans <FaArrowRight />
                </button>
              </div>
            )}

            {/* Recent claims */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black text-gray-900">Recent Claims</h3>
                <button onClick={() => setActiveTab('claims')} className="text-red-600 text-sm font-semibold hover:underline flex items-center gap-1">
                  View all <FaArrowRight className="text-xs" />
                </button>
              </div>
              {claims.length > 0 ? (
                <div className="space-y-3">
                  {claims.slice(0, 3).map(claim => (
                    <div key={claim.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-red-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                          <FaBolt className="text-red-600 text-sm" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">Claim #{claim.id}</p>
                          <p className="text-xs text-gray-400">₹{claim.claim_amount} · {claim.created_at ? new Date(claim.created_at).toLocaleDateString('en-IN') : 'Recent'}</p>
                        </div>
                      </div>
                      <StatusBadge status={claim.status} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <FaClipboard className="text-gray-200 text-4xl mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">No claims yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── PLANS ── */}
        {activeTab === 'plans' && (
          <div className="animate-fade-in">
            <div className="mb-8">
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">Choose Your Plan</h2>
              <p className="text-gray-400 mt-2">Flexible coverage that fits your work schedule and budget.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PLANS.map((plan, i) => {
                const popular = i === 1
                const features = [
                  `${plan.duration_days} day${plan.duration_days > 1 ? 's' : ''} coverage`,
                  `₹${plan.payout_amount} max payout`,
                  'Instant claim processing',
                  'AI fraud protection',
                  popular ? 'Priority support' : null,
                  popular ? 'Zone-adaptive triggers' : null,
                ].filter(Boolean) as string[]

                return (
                  <div key={plan.id} className={`relative rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-2 ${
                    popular
                      ? 'bg-red-600 shadow-2xl shadow-red-200'
                      : 'bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-red-100'
                  }`}>
                    {popular && (
                      <div className="absolute top-0 inset-x-0 flex justify-center">
                        <div className="bg-white text-red-600 text-xs font-black px-5 py-1.5 rounded-b-xl shadow-sm">
                          MOST POPULAR
                        </div>
                      </div>
                    )}
                    <div className="p-8 pt-10">
                      <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${popular ? 'text-red-200' : 'text-gray-400'}`}>
                        {plan.name}
                      </p>
                      <div className="flex items-end gap-1 mb-1">
                        <span className={`text-5xl font-black tracking-tight ${popular ? 'text-white' : 'text-gray-900'}`}>
                          ₹{plan.premium_amount}
                        </span>
                        <span className={`text-sm mb-2 ${popular ? 'text-red-200' : 'text-gray-400'}`}>
                          /{plan.duration_days === 1 ? 'day' : plan.duration_days === 7 ? 'week' : 'month'}
                        </span>
                      </div>
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold mb-6 ${popular ? 'bg-white/20 text-white' : 'bg-red-50 text-red-600'}`}>
                        <FaRupeeSign className="text-[10px]" />
                        Up to ₹{plan.payout_amount} payout
                      </div>

                      <ul className="space-y-3 mb-8">
                        {features.map((f, fi) => (
                          <li key={fi} className="flex items-center gap-2.5">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${popular ? 'bg-white/20' : 'bg-red-50'}`}>
                              <FaCheckCircle className={`text-[10px] ${popular ? 'text-white' : 'text-red-600'}`} />
                            </div>
                            <span className={`text-sm ${popular ? 'text-red-100' : 'text-gray-500'}`}>{f}</span>
                          </li>
                        ))}
                      </ul>

                      <button
                        onClick={() => handleSubscribe(plan.id)}
                        disabled={subscribing === plan.id}
                        className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                          popular
                            ? 'bg-white text-red-600 hover:bg-red-50 shadow-lg'
                            : 'bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-100'
                        } disabled:opacity-60`}
                      >
                        {subscribing === plan.id ? (
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>Subscribe Now <FaArrowRight className="text-xs" /></>
                        )}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* guarantee strip */}
            <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-6 flex flex-wrap items-center justify-center gap-8">
              {[
                { icon: FaBolt,      text: 'Instant activation'    },
                { icon: FaShieldAlt, text: 'No hidden charges'     },
                { icon: FaClock,     text: 'Cancel anytime'        },
                { icon: FaCheckCircle, text: 'Auto-claim on trigger' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                  <item.icon className="text-red-500" />
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CLAIMS ── */}
        {activeTab === 'claims' && (
          <div className="animate-fade-in">
            <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Your Claims</h2>
                <p className="text-gray-400 mt-1">{claims.length} total claims on record</p>
              </div>
              <div className="flex gap-3">
                {['ALL', 'PAID', 'PENDING', 'REJECTED'].map(s => (
                  <button key={s} className="px-4 py-2 rounded-xl text-xs font-bold border border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-600 transition-all">
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-24">
                <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" />
              </div>
            ) : claims.length > 0 ? (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Claim</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {claims.map(claim => (
                      <tr key={claim.id} className="hover:bg-red-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center">
                              <FaBolt className="text-red-600 text-xs" />
                            </div>
                            <span className="font-bold text-gray-900 text-sm">#{claim.id}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-black text-gray-900">₹{claim.claim_amount}</td>
                        <td className="px-6 py-4 text-gray-400 text-sm">
                          {claim.created_at ? new Date(claim.created_at).toLocaleDateString('en-IN') : '—'}
                        </td>
                        <td className="px-6 py-4"><StatusBadge status={claim.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center">
                <FaClipboard className="text-gray-200 text-5xl mx-auto mb-4" />
                <h3 className="text-lg font-black text-gray-900 mb-2">No Claims Yet</h3>
                <p className="text-gray-400 text-sm">When a disruption is detected in your zone, claims will appear here automatically.</p>
              </div>
            )}
          </div>
        )}

        {/* ── PAYOUTS ── */}
        {activeTab === 'payouts' && (
          <div className="animate-fade-in">
            <div className="mb-8">
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">Payment History</h2>
              <p className="text-gray-400 mt-1">All approved claim payouts transferred to your account.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              {[
                { label: 'Total Received', value: `₹${claims.filter(c => c.status === 'PAID').reduce((a, c) => a + c.claim_amount, 0)}`, icon: FaRupeeSign,   color: 'text-green-600', bg: 'bg-green-50' },
                { label: 'Paid Claims',    value: claims.filter(c => c.status === 'PAID').length,                                         icon: FaCheckCircle, color: 'text-blue-600',  bg: 'bg-blue-50'  },
                { label: 'Avg Payout',     value: '₹450',                                                                                  icon: FaChartLine,   color: 'text-red-600',   bg: 'bg-red-50'   },
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-4">
                  <div className={`w-12 h-12 ${s.bg} rounded-2xl flex items-center justify-center`}>
                    <s.icon className={`${s.color} text-lg`} />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-gray-900">{s.value}</p>
                    <p className="text-xs text-gray-400 font-medium">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center">
              <FaCalendarAlt className="text-gray-200 text-5xl mx-auto mb-4" />
              <h3 className="text-lg font-black text-gray-900 mb-2">Payout History</h3>
              <p className="text-gray-400 text-sm max-w-xs mx-auto">Detailed payout records will appear here once claims are approved and transferred.</p>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default WorkerPortal
