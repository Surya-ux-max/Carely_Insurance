import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import WorkerPortal from './pages/WorkerPortal'
import AdminDashboard from './pages/AdminDashboard'
import ClaimsPage from './pages/ClaimsPage'
import './App.css'

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/worker" element={<WorkerPortal />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/claims" element={<ClaimsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
