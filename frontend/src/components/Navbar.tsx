import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaHeartbeat, FaBars, FaTimes, FaMotorcycle, FaChartBar, FaClipboardList } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

const Navbar: React.FC = () => {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()

  const isActive = (path: string) => location.pathname === path

  const links = [
    { path: '/worker', label: t('nav_worker'), icon: FaMotorcycle,    desc: t('wp_subtitle').split('.')[0]  },
    { path: '/admin',  label: t('nav_admin'),  icon: FaChartBar,      desc: t('ad_title')      },
    { path: '/claims', label: t('nav_claims'), icon: FaClipboardList, desc: t('cp_title')  },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center shadow-md group-hover:bg-red-700 transition-colors">
              <FaHeartbeat className="text-white text-lg" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xl font-bold text-red-600 tracking-tight">Carely</span>
              <span className="text-[10px] text-gray-400 font-medium tracking-wide">{t('nav_tagline')}</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1.5">
            {links.map(link => {
              const active = isActive(link.path)
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`group flex items-center gap-2.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    active
                      ? 'bg-red-600 text-white shadow-md shadow-red-200'
                      : 'text-gray-600 hover:bg-red-50 hover:text-red-600'
                  }`}
                >
                  <link.icon className={`text-xs flex-shrink-0 ${
                    active ? 'text-red-200' : 'text-red-400 group-hover:text-red-500'
                  }`} />
                  <span>{link.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            {open ? <FaTimes size={18} /> : <FaBars size={18} />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-4 pt-2 border-t border-red-50 space-y-1">
            {links.map(link => {
              const active = isActive(link.path)
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? 'bg-red-600 text-white'
                      : 'text-gray-600 hover:bg-red-50 hover:text-red-600'
                  }`}
                >
                  <link.icon className={`text-sm ${ active ? 'text-red-200' : 'text-red-400'}`} />
                  <div>
                    <p className="leading-none">{link.label}</p>
                    <p className={`text-[10px] mt-0.5 ${ active ? 'text-red-200' : 'text-gray-400'}`}>{link.desc}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
