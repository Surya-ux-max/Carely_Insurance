import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaShieldAlt, FaBars } from 'react-icons/fa'
import { useAuth } from '../stores'

const Navbar: React.FC = () => {
  const { user, logout } = useAuth()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
            <FaShieldAlt />
            GigShield
          </Link>

          <div className="hidden md:flex gap-6">
            <Link
              to="/"
              className={`hover:text-blue-100 transition ${isActive('/') ? 'border-b-2 border-white' : ''}`}
            >
              Home
            </Link>
            <Link
              to="/worker"
              className={`hover:text-blue-100 transition ${isActive('/worker') ? 'border-b-2 border-white' : ''}`}
            >
              Worker
            </Link>
            <Link
              to="/admin"
              className={`hover:text-blue-100 transition ${isActive('/admin') ? 'border-b-2 border-white' : ''}`}
            >
              Admin
            </Link>
            <Link
              to="/claims"
              className={`hover:text-blue-100 transition ${isActive('/claims') ? 'border-b-2 border-white' : ''}`}
            >
              Claims
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm">{user.name}</span>
                <button
                  onClick={() => logout()}
                  className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition">
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
