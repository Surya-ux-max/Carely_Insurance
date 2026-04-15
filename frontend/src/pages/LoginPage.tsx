import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaShieldAlt, FaMotorcycle, FaUserShield, FaArrowRight, FaEye, FaEyeSlash } from 'react-icons/fa'
import { useAuth } from '../stores'
import { useTranslation } from 'react-i18next'

type Tab = 'worker' | 'admin'

export default function LoginPage() {
  const navigate    = useNavigate()
  const { setUser } = useAuth()
  const { t }       = useTranslation()

  const [tab,      setTab]      = useState<Tab>('worker')
  const [error,    setError]    = useState('')
  const [showPass, setShowPass] = useState(false)

  const [username,  setUsername]  = useState('')
  const [password,  setPassword]  = useState('')
  const [adminUser, setAdminUser] = useState('')
  const [adminPass, setAdminPass] = useState('')

  const handleWorkerLogin = () => {
    setError('')
    if (username === 'worker123' && password === 'carely@worker') {
      setUser({ id: 1, user_id: 'W-001', name: 'Suryaprakash S', phone: '9876543210', email: 'worker@carely.com', zone: 'Chennai Central', platform: 'Swiggy' }, 'worker')
      navigate('/worker')
    } else {
      setError(t('login_invalid'))
    }
  }

  const handleAdminLogin = () => {
    setError('')
    if (adminUser === 'admin123' && adminPass === 'carely@admin') {
      setUser({ id: 0, user_id: 'admin', name: 'Admin', phone: '', email: 'admin@carely.com', zone: '', platform: '' }, 'admin')
      navigate('/admin')
    } else {
      setError(t('login_invalid'))
    }
  }

  const tabs: [Tab, React.ElementType, string][] = [
    ['worker', FaMotorcycle, t('login_worker')],
    ['admin',  FaUserShield, t('login_admin')],
  ]

  return (
    <div className="min-h-screen bg-white flex">

      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-red-600 flex-col justify-between p-14 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500 rounded-full -translate-y-1/2 translate-x-1/2 opacity-30" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-red-800 rounded-full translate-y-1/2 -translate-x-1/3 opacity-20" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <FaShieldAlt className="text-white text-lg" />
            </div>
            <span className="text-white text-2xl font-black tracking-tight">Carely</span>
          </div>

          <h2 className="text-5xl font-black text-white leading-tight tracking-tight mb-6">
            {t('login_hero_title').split('\n').map((line, i) => (
              <React.Fragment key={i}>{line}{i < 2 && <br />}</React.Fragment>
            ))}
          </h2>
          <p className="text-red-200 text-lg font-light leading-relaxed max-w-sm">
            {t('login_hero_desc')}
          </p>
        </div>

        <div className="relative z-10 space-y-4">
          {[
            { icon: FaMotorcycle, title: t('login_gig_title'),   desc: t('login_gig_desc')   },
            { icon: FaUserShield, title: t('login_admin_title'), desc: t('login_admin_desc') },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 bg-white/10 rounded-2xl px-5 py-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <item.icon className="text-white text-base" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">{item.title}</p>
                <p className="text-red-200 text-xs font-light">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <FaShieldAlt className="text-red-600 text-2xl" />
            <span className="text-gray-900 text-2xl font-black">Carely</span>
          </div>

          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">{t('login_welcome')}</h1>
          <p className="text-gray-400 text-sm mb-8">{t('login_subtitle')}</p>

          {/* Role tabs */}
          <div className="flex bg-gray-100 rounded-2xl p-1 mb-8">
            {tabs.map(([tabId, Icon, label]) => (
              <button
                key={tabId}
                onClick={() => { setTab(tabId); setError('') }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                  tab === tabId ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="text-xs" /> {label}
              </button>
            ))}
          </div>

          {/* ── WORKER PANEL ── */}
          {tab === 'worker' && (
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                <p className="text-gray-400 text-[11px] font-semibold mb-1">{t('login_demo')}</p>
                <p className="text-gray-700 text-xs font-mono">Username: <span className="text-red-600 font-bold">worker123</span> &nbsp;·&nbsp; Password: <span className="text-red-600 font-bold">carely@worker</span></p>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t('login_username')}</label>
                <input
                  type="text"
                  placeholder="worker123"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleWorkerLogin()}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t('login_password')}</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="carely@worker"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleWorkerLogin()}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50 transition-all"
                  />
                  <button onClick={() => setShowPass(s => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPass ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                  </button>
                </div>
              </div>
              {error && <p className="text-red-600 text-xs font-semibold bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>}
              <button onClick={handleWorkerLogin} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md shadow-red-100">
                {t('login_signin')} <FaArrowRight className="text-xs" />
              </button>
            </div>
          )}

          {/* ── ADMIN PANEL ── */}
          {tab === 'admin' && (
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                <p className="text-gray-400 text-[11px] font-semibold mb-1">{t('login_demo')}</p>
                <p className="text-gray-700 text-xs font-mono">Username: <span className="text-red-600 font-bold">admin123</span> &nbsp;·&nbsp; Password: <span className="text-red-600 font-bold">carely@admin</span></p>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t('login_username')}</label>
                <input
                  type="text"
                  placeholder="admin123"
                  value={adminUser}
                  onChange={e => setAdminUser(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAdminLogin()}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t('login_password')}</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="carely@admin"
                    value={adminPass}
                    onChange={e => setAdminPass(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAdminLogin()}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50 transition-all"
                  />
                  <button onClick={() => setShowPass(s => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPass ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                  </button>
                </div>
              </div>
              {error && <p className="text-red-600 text-xs font-semibold bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>}
              <button onClick={handleAdminLogin} className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md">
                {t('login_access')} <FaArrowRight className="text-xs" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
