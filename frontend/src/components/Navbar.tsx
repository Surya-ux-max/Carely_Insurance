import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaShieldAlt, FaBars, FaTimes } from 'react-icons/fa'
import { useAuth } from '../stores'

const Navbar: React.FC = () => {
  const { user, logout } = useAuth()
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
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold hover:opacity-80 transition-opacity">
            <div className="p-2 bg-white bg-opacity-20 rounded-xl">
              <FaShieldAlt size={24} />
            </div>
            <span>GigShield</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-semibold transition-all duration-300 relative pb-2 ${
                  isActive(link.path)
                    ? 'text-white'
                    : 'text-blue-100 hover:text-white'
                }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full"></div>
                )}
              </Link>
            ))}
          </div>

          {/* User Section */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="hidden sm:flex items-center gap-3">
                <div className="px-4 py-2 bg-white bg-opacity-15 rounded-lg">
                  <span className="text-sm font-semibold">{user.name}</span>
                </div>
                <button
                  onClick={() => logout()}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button className="px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 shadow-md">
                Login
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-all"
            >
              {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-white border-opacity-20 pt-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg transition-all ${
                  isActive(link.path)
                    ? 'bg-white bg-opacity-20 font-semibold'
                    : 'hover:bg-white hover:bg-opacity-10'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <button
                onClick={() => {
                  logout()
                  setMobileMenuOpen(false)
                }}
                className="w-full text-left px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-all font-semibold"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
