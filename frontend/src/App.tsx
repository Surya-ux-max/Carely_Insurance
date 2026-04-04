import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import WorkerPortal from './pages/WorkerPortal'
import AdminDashboard from './pages/AdminDashboard'
import ClaimsPage from './pages/ClaimsPage'
import { useAuth } from './stores'
import './App.css'

function ProtectedWorker({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, role } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (role === 'admin') return <Navigate to="/admin" replace />
  return <>{children}</>
}

function ProtectedAdmin({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, role } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (role === 'worker') return <Navigate to="/worker" replace />
  return <>{children}</>
}

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/"       element={<HomePage />} />
            <Route path="/login"  element={<LoginPage />} />
            <Route path="/worker" element={<ProtectedWorker><WorkerPortal /></ProtectedWorker>} />
            <Route path="/admin"  element={<ProtectedAdmin><AdminDashboard /></ProtectedAdmin>} />
            <Route path="/claims" element={<ProtectedAdmin><ClaimsPage /></ProtectedAdmin>} />
            <Route path="*"       element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
