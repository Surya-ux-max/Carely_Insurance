import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaHeartbeat, FaBars, FaTimes, FaMotorcycle, FaUserShield, FaSignOutAlt } from 'react-icons/fa'
import { useAuth } from '../stores'

const Navbar: React.FC = () => {
  const location  = useLocation()
  const navigate  = useNavigate()
  const { user, role, isAuthenticated, logout } = useAuth()
  const [open, setOpen] = useState(false)

  const isActive = (path: string) => location.pathname === path

  // Hide navbar entirely on login page
  if (location.pathname === '/login') return null

  const workerLinks = [
    { path: '/',       label: 'Home'   },
    { path: '/worker', label: 'Portal' },
  ]
  const adminLinks = [
    { path: '/',       label: 'Home'    },
    { path: '/admin',  label: 'Dashboard' },
    { path: '/claims', label: 'Claims'  },
  ]
  const publicLinks = [
    { path: '/',       label: 'Home'   },
    { path: '/login',  label: 'Login'  },
  ]

  const links = !isAuthenticated ? publicLinks : role === 'admin' ? adminLinks : workerLinks

  const handleLogout = () => {
    logout()
    navigate('/login')
    setOpen(false)
  }

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
            {links.map(link => (
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

          {/* Right — user info + logout */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-xl">
                  {role === 'admin'
                    ? <FaUserShield className="text-red-600 text-xs" />
                    : <FaMotorcycle className="text-red-600 text-xs" />
                  }
                  <span className="text-sm font-semibold text-gray-700">{user.name}</span>
                  <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full uppercase">
                    {role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-600 border border-red-200 hover:border-red-600 rounded-xl text-red-600 hover:text-white text-xs font-bold transition-all"
                >
                  <FaSignOutAlt className="text-[10px]" /> Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl shadow-sm shadow-red-100 transition-all"
              >
                Login
              </Link>
            )}
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
            {links.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? 'bg-red-600 text-white'
                    : 'text-gray-600 hover:bg-red-50 hover:text-red-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 transition-all"
              >
                <FaSignOutAlt className="text-xs" /> Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
