import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaHeartbeat, FaBars, FaTimes } from 'react-icons/fa'

const Navbar: React.FC = () => {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path: string) => location.pathname === path

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/worker', label: 'Worker' },
    { path: '/admin', label: 'Admin' },
    { path: '/claims', label: 'Claims' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-red-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center shadow-md group-hover:bg-red-700 transition-colors">
              <FaHeartbeat className="text-white text-lg" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xl font-bold text-red-600 tracking-tight">Carely</span>
              <span className="text-[10px] text-gray-400 font-medium tracking-wide">Insurance that cares</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-red-50 hover:text-red-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            {mobileMenuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-red-50 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? 'bg-red-600 text-white'
                    : 'text-gray-600 hover:bg-red-50 hover:text-red-600'
                }`}
              >
                {link.label}
              </Link>
            ))}

          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
