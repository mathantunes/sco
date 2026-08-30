import {
    useState,
    type PropsWithChildren,
} from 'react'
import type { Menu } from 'contracts/menu'
import type { OpenOrder, PaidOrder } from 'contracts/order'
import { SessionContext, type SessionState, type SessionContextValue } from './SessionContext'

type SessionProviderProps = PropsWithChildren<{
    deviceId: string
    apiBaseUrl?: string
}>

export function SessionProvider({
    children,
    deviceId,
    apiBaseUrl = 'http://localhost:3000',
}: SessionProviderProps) {
    const [state, setState] = useState<SessionState>({
        deviceId,
        menu: [],
        order: null,
        isLoading: false,
        error: null,
        paymentStatus: 'idle',
    })

    async function request<T>(path: string, init?: RequestInit): Promise<T> {
        const headers = new Headers(init?.headers)
        if (init?.body && !headers.has('content-type')) {
            headers.set('content-type', 'application/json')
        }

        const response = await fetch(`${apiBaseUrl}${path}`, {
            ...init,
            headers,
        })

        const body = (await response.json()) as T & { error?: string }
        if (!response.ok) {
            throw new Error(body.error ?? `Request failed with status ${response.status}`)
        }
        return body
    }

    async function run(action: () => Promise<void>) {
        setState((current) => ({ ...current, isLoading: true, error: null }))
        try {
            await action()
        } catch (error) {
            setState((current) => ({
                ...current,
                error: error instanceof Error ? error.message : 'Something went wrong',
            }))
            throw error
        } finally {
            setState((current) => ({ ...current, isLoading: false }))
        }
    }

    async function startSession() {
        await run(async () => {
            const response = await request<{ order: OpenOrder; menu: Menu[] }>(
                `/sessions?deviceId=${encodeURIComponent(deviceId)}`,
                { method: 'POST' },
            )
            setState((current) => ({ ...current, order: response.order, menu: response.menu }))
        })
    }

    async function addItem(productId: string, quantity = 1) {
        await run(async () => {
            requireOpenOrder()
            const response = await request<{ order: OpenOrder }>(
                `/order/items?deviceId=${encodeURIComponent(deviceId)}`,
                {
                    method: 'POST',
                    body: JSON.stringify({ productId, quantity }),
                },
            )
            setState((current) => ({ ...current, order: response.order }))
        })
    }

    async function updateItemQuantity(itemId: string, quantity: number) {
        await run(async () => {
            requireOpenOrder()
            const response = await request<{ order: OpenOrder }>(
                `/order/items/${encodeURIComponent(itemId)}?deviceId=${encodeURIComponent(deviceId)}`,
                {
                    method: 'PUT',
                    body: JSON.stringify({ quantity }),
                },
            )
            setState((current) => ({ ...current, order: response.order }))
        })
    }

    async function checkout() {
        setState((current) => ({ ...current, paymentStatus: 'pending' }))
        try {
            await run(async () => {
                requireOpenOrder()
                const response = await request<{ order: PaidOrder }>(
                    `/checkout?deviceId=${encodeURIComponent(deviceId)}`,
                    { method: 'POST' },
                )
                setState((current) => ({ ...current, paymentStatus: 'success' }))
                // This wait gives the UI some time to show the success state before updating the order to paid
                await new Promise((resolve) => setTimeout(resolve, 1200))
                setState((current) => ({ ...current, order: response.order }))
            })
        } catch {
            setState((current) => ({ ...current, paymentStatus: 'error' }))
        }
    }

    function dismissPayment() {
        setState((current) => ({ ...current, paymentStatus: 'idle', error: null }))
    }

    function resetSession() {
        setState((current) => ({ ...current, menu: [], order: null, error: null, paymentStatus: 'idle' }))
    }

    function requireOpenOrder(): OpenOrder {
        if (!state.order || state.order.kind !== 'open') {
            throw new Error('Start a checkout session first')
        }
        return state.order
    }

    const value: SessionContextValue = {
        ...state,
        startSession,
        addItem,
        updateItemQuantity,
        checkout,
        dismissPayment,
        resetSession,
        clearError: () => setState((current) => ({ ...current, error: null })),
    }

    return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}
