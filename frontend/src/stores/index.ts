import create from 'zustand'
import type { Worker, Subscription, Claim, Payout, DashboardStats, Role } from '../types'
import { apiClient } from '../api/client'

interface AuthStore {
  user: Worker | null
  role: Role | null
  isAuthenticated: boolean
  setUser: (user: Worker | null, role?: Role) => void
  logout: () => void
}

interface DataStore {
  workers: Worker[]
  subscriptions: Subscription[]
  claims: Claim[]
  payouts: Payout[]
  stats: DashboardStats | null
  loading: boolean
  error: string | null
  setWorkers: (workers: Worker[]) => void
  setClaims: (claims: Claim[]) => void
  setPayouts: (payouts: Payout[]) => void
  setStats: (stats: DashboardStats) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useAuth = create<AuthStore>((set) => ({
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
  role: localStorage.getItem('role') as Role | null,
  isAuthenticated: !!localStorage.getItem('user'),
  setUser: (user, role) => {
    set({ user, role: role ?? null, isAuthenticated: !!user })
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
      if (role) localStorage.setItem('role', role)
    } else {
      localStorage.removeItem('user')
      localStorage.removeItem('role')
    }
  },
  logout: () => {
    set({ user: null, role: null, isAuthenticated: false })
    localStorage.removeItem('user')
    localStorage.removeItem('role')
  },
}))

export const useData = create<DataStore>((set) => ({
  workers: [],
  subscriptions: [],
  claims: [],
  payouts: [],
  stats: null,
  loading: false,
  error: null,
  setWorkers: (workers) => set({ workers }),
  setClaims: (claims) => set({ claims }),
  setPayouts: (payouts) => set({ payouts }),
  setStats: (stats) => set({ stats }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}))

// Async actions
export const loadWorkerData = async (workerId: number) => {
  const store = useData.getState()
  store.setLoading(true)
  try {
    const claimsData = await apiClient.listClaims(workerId)
    // backend now returns array directly
    const claims = Array.isArray(claimsData) ? claimsData : (claimsData.claims || [])
    store.setClaims(claims)
    store.setError(null)
  } catch (error: any) {
    store.setError(error.message || 'Failed to load worker data')
  } finally {
    store.setLoading(false)
  }
}

export const loadDashboardStats = async () => {
  const store = useData.getState()
  store.setLoading(true)
  try {
    const stats: DashboardStats = await apiClient.getStats()
    store.setStats(stats)
    store.setError(null)
  } catch (error: any) {
    // Fallback to mock data if API fails
    store.setStats({
      total_workers: 0,
      active_subscriptions: 0,
      total_claims: 0,
      total_payouts: 0,
      pending_claims: 0,
      fraud_detected: 0,
      average_payout_time: 2.5,
    })
    store.setError(null)
  } finally {
    store.setLoading(false)
  }
}
