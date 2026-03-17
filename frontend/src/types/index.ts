export interface Worker {
  id?: number
  user_id: string
  name: string
  phone: string
  email: string
  zone: string
  platform: string
  active?: boolean
  created_at?: string
  updated_at?: string
}

export interface InsurancePlan {
  id: number
  name: string
  duration_days: number
  premium_amount: number
  payout_amount: number
  active: boolean
}

export interface Subscription {
  id?: number
  worker_id: number
  plan_id: number
  status: string
  premium_paid: number
  activation_date: string
  expiry_date: string
  created_at?: string
  updated_at?: string
}

export interface Claim {
  id?: number
  worker_id: number
  subscription_id: number
  disruption_event_id?: number
  status: 'PENDING' | 'VERIFIED' | 'APPROVED' | 'REJECTED' | 'PAID'
  claim_amount: number
  estimated_income_loss: number
  fraud_score?: number
  fraud_checks?: Record<string, any>
  verified_by?: string
  verification_notes?: string
  created_at?: string
  updated_at?: string
}

export interface Payout {
  id?: number
  claim_id: number
  amount: number
  currency: string
  payment_status: 'INITIATED' | 'COMPLETED' | 'FAILED'
  razorpay_transfer_id?: string
  razorpay_order_id?: string
  recipient_phone: string
  recipient_account?: string
  notes?: Record<string, any>
  created_at?: string
  completed_at?: string
}

export interface RiskAssessment {
  zone: string
  risk_score: number
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH'
  triggered: boolean
  triggering_factors: string[]
}

export interface DashboardStats {
  total_workers: number
  active_subscriptions: number
  total_claims: number
  total_payouts: number
  pending_claims: number
  fraud_detected: number
  average_payout_time: number
}
