import axios, { AxiosInstance } from 'axios'
import type { Worker, Claim, Subscription } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

class APIClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  // Worker endpoints
  async createWorker(data: Partial<Worker>) {
    const response = await this.client.post('/workers', data)
    return response.data
  }

  async getWorker(id: number) {
    const response = await this.client.get(`/workers/${id}`)
    return response.data
  }

  async listWorkers(zone?: string) {
    const response = await this.client.get('/workers', {
      params: { zone },
    })
    return response.data
  }

  // Subscription endpoints
  async createSubscription(workerId: number, planId: number) {
    const response = await this.client.post('/subscriptions', {
      worker_id: workerId,
      plan_id: planId,
    })
    return response.data
  }

  async getSubscription(workerId: number) {
    const response = await this.client.get(`/subscriptions/worker/${workerId}`)
    return response.data
  }

  async checkCoverage(workerId: number) {
    const response = await this.client.get(`/subscriptions/worker/${workerId}/coverage`)
    return response.data
  }

  // Claim endpoints
  async createClaim(data: Partial<Claim>) {
    const response = await this.client.post('/claims', data)
    return response.data
  }

  async getClaim(id: number) {
    const response = await this.client.get(`/claims/${id}`)
    return response.data
  }

  async listClaims(workerId: number) {
    const response = await this.client.get(`/claims/worker/${workerId}`)
    return response.data
  }

  async verifyClaim(id: number) {
    const response = await this.client.post(`/claims/${id}/verify`)
    return response.data
  }

  async approveClaim(id: number) {
    const response = await this.client.post(`/claims/${id}/approve`)
    return response.data
  }

  // Payout endpoints
  async createPayout(claimId: number, recipientPhone: string, amount: number) {
    const response = await this.client.post('/payouts', {
      claim_id: claimId,
      recipient_phone: recipientPhone,
      amount,
    })
    return response.data
  }

  async getPayout(id: number) {
    const response = await this.client.get(`/payouts/${id}`)
    return response.data
  }

  async completePayout(id: number, razorpayTransferId: string) {
    const response = await this.client.post(`/payouts/${id}/complete`, {
      razorpay_transfer_id: razorpayTransferId,
    })
    return response.data
  }

  // Risk Assessment
  async assessRisk(data: Record<string, any>) {
    const response = await this.client.post('/risk/assess', data)
    return response.data
  }

  // Health check
  async health() {
    const response = await this.client.get('/health')
    return response.data
  }
}

export const apiClient = new APIClient()
