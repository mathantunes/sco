import { createContext } from 'react'
import type { Menu } from 'contracts/menu'
import type { OpenOrder, PaidOrder } from 'contracts/order'

export type SessionState = {
  deviceId: string
  menu: Menu[]
  order: OpenOrder | PaidOrder | null
  isLoading: boolean
  error: string | null
  paymentStatus: 'idle' | 'pending' | 'success' | 'error'
}

export type SessionActions = {
  startSession: () => Promise<void>
  addItem: (productId: string, quantity?: number) => Promise<void>
  updateItemQuantity: (itemId: string, quantity: number) => Promise<void>
  checkout: () => Promise<void>
  dismissPayment: () => void
  resetSession: () => void
  clearError: () => void
}

export type SessionContextValue = SessionState & SessionActions

export const SessionContext = createContext<SessionContextValue | null>(null)
