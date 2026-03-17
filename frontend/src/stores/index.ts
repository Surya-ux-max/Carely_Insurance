import create from 'zustand'
import type { Worker, Subscription, Claim, Payout, DashboardStats } from '../types'
import { apiClient } from '../api/client'

interface AuthStore {
  user: Worker | null
  isAuthenticated: boolean
  setUser: (user: Worker | null) => void
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
  isAuthenticated: !!localStorage.getItem('user'),
  setUser: (user) => {
    set({ user, isAuthenticated: !!user })
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  },
  logout: () => {
    set({ user: null, isAuthenticated: false })
    localStorage.removeItem('user')
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
    const worker = await apiClient.getWorker(workerId)
    const subscription = await apiClient.getSubscription(workerId)
    const claims = await apiClient.listClaims(workerId)
    
    useAuth.getState().setUser(worker)
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
    // This would typically call a stats endpoint
    // For now, we'll calculate from existing data
    const stats: DashboardStats = {
      total_workers: 150,
      active_subscriptions: 120,
      total_claims: 45,
      total_payouts: 40,
      pending_claims: 5,
      fraud_detected: 3,
      average_payout_time: 2.5, // hours
    }
    store.setStats(stats)
    store.setError(null)
  } catch (error: any) {
    store.setError(error.message || 'Failed to load stats')
  } finally {
    store.setLoading(false)
  }
}
