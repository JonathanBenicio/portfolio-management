import axios from 'axios'

// API base URL - use environment variable or default to Docker backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para adicionar token JWT em todas as requisições
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// Auth endpoints
export const authApi = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post<{ token: string; name: string; email: string }>('/auth/login', data),
}

// Portfolio endpoints
export const portfolioApi = {
  getSummary: () => api.get('/portfolio/summary'),
  getEvolution: () => api.get('/portfolio/evolution'),
  getAllocation: () => api.get('/portfolio/allocation'),
}

// Fixed Income endpoints
export const fixedIncomeApi = {
  getAll: () => api.get('/fixedincome'),
  getById: (id: number) => api.get(`/fixedincome/${id}`),
  create: (data: any) => api.post('/fixedincome', data),
  update: (id: number, data: any) => api.put(`/fixedincome/${id}`, data),
  delete: (id: number) => api.delete(`/fixedincome/${id}`),
}

// Variable Income endpoints
export const variableIncomeApi = {
  getAll: () => api.get('/variableincome'),
  create: (data: any) => api.post('/variableincome', data),
  addTransaction: (data: any) => api.post('/variableincome/transaction', data),
}

// Dividend endpoints
export const dividendApi = {
  getAll: () => api.get('/dividend'),
  getSummary: () => api.get('/dividend/summary'),
  create: (data: any) => api.post('/dividend', data),
}

// Analysis endpoints
export const analysisApi = {
  getBenchmarks: () => api.get('/analysis/benchmarks'),
  getSectors: () => api.get('/analysis/sectors'),
  getAssetPerformance: (assetId: number) => api.get(`/analysis/performance/${assetId}`),
}

// Chat endpoints
export const chatApi = {
  getConversations: () => api.get('/chat/conversations'),
  getConversation: (id: number) => api.get(`/chat/conversation/${id}`),
  sendMessage: (data: { message: string; conversationId?: number }) =>
    api.post('/chat/message', data),
}

// Import API
export const importApi = {
  uploadFile: (formData: FormData) =>
    api.post('/import/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getTemplate: () => api.get('/import/template'),
}

// Design System API
export const designSystemApi = {
  getConfig: () => api.get('/designsystem'),
  updateConfig: (data: any) => api.put('/designsystem', data),
  resetToDefault: () => api.delete('/designsystem'),
}

// Wallet endpoints
export interface AuditLog {
    id: number
    userId: number
    entityType: string
    entityId: number
    action: string
    changes: string
    timestamp: string
}

export const walletApi = {
  getAll: () => api.get<Wallet[]>('/wallet'),
  getById: (id: number) => api.get<Wallet>(`/wallet/${id}`),
  create: (data: any) => api.post<Wallet>('/wallet', data),
  update: (id: number, data: any) => api.put(`/wallet/${id}`, data),
  delete: (id: number) => api.delete(`/wallet/${id}`),
  getAnalytics: (id: number) => api.get<WalletAnalytics>(`/wallet/${id}/analytics`),
  getEvolution: (id: number) => api.get<WalletEvolution[]>(`/wallet/${id}/evolution`),
  getHistory: (id: number) => api.get<AuditLog[]>(`/wallet/${id}/history`),
}

export interface Wallet {
  id: number
  name: string
  broker: string
  ownerName: string
  color: string
}

export interface AssetSummary {
    id: number
    name: string
    type: string
    invested: number
    current: number
    profit: number
}

export interface WalletAnalytics {
    totalInvested: number
    totalCurrent: number
    totalProfit: number
    monthlyReturnPercentage: number
    assets: AssetSummary[]
}

export interface WalletEvolution {
    date: string
    totalValue: number
}

export default api
