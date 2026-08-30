import type { Price } from "./price.js";
import type { Product } from "./product.js";
import type { Payment } from "./payment.js";

export type OpenOrder = {
    kind: "open";
    id: string;
    deviceId: string;
    items: OrderItem[];
    totalPrice: Price;
    createdAt: Date;
}

export type PaidOrder = Omit<OpenOrder, "kind"> & {
    kind: "paid";
    paidAt: Date;
    payment: Payment;
}

export type AbandonedOrder = Omit<OpenOrder, "kind"> & {
    kind: "abandoned";
    abandonedAt: Date;
}

export type Order = OpenOrder | PaidOrder | AbandonedOrder;

export type OrderItem = {
    id: string;
    product: OrderProduct;
    quantity: number;
};

export type OrderProduct = Omit<Product, "imageUrl">;

export const replaceItemInOrder = (order: OpenOrder, orderItem: OrderItem): OpenOrder => {
    const existingItemIndex = order.items.findIndex(item => item.product.id === orderItem.product.id);
    if (existingItemIndex !== -1) {
        const updatedItems = [
            ...order.items.slice(0, existingItemIndex),
            orderItem,
            ...order.items.slice(existingItemIndex + 1)
        ];

        return {
            ...order,
            items: updatedItems
        };
    } else {
        return {
            ...order,
            items: [...order.items, orderItem]
        };
    }
}

export const create = (): OpenOrder => {
    return {
        kind: "open",
        id: `order-${crypto.randomUUID()}`,
        deviceId: "",
        items: [],
        totalPrice: { amount: "0.00", currency: "USD" },
        createdAt: new Date()
    };
}

export const addItemToOrder = (order: OpenOrder, orderItem: OrderItem): OpenOrder => {
    const existingItemIndex = order.items.findIndex(item => item.product.id === orderItem.product.id);
    if (existingItemIndex !== -1) {
        const existingItem = order.items[existingItemIndex];
        const updatedItem: OrderItem = {
            ...existingItem,
            quantity: existingItem.quantity + orderItem.quantity,
        };
        const updatedItems = [
            ...order.items.slice(0, existingItemIndex),
            updatedItem,
            ...order.items.slice(existingItemIndex + 1)
        ];

        return {
            ...order,
            items: updatedItems
        };
    } else {
        return {
            ...order,
            items: [...order.items, orderItem]
        };
    }
}

export const computeTotalPrice = (order: OpenOrder): OpenOrder => {
    const totalAmount = order.items.reduce((sum, item) => {
        const itemTotal = parseFloat(item.product.price.amount) * item.quantity;
        return sum + itemTotal;
    }, 0);

    return {
        ...order,
        totalPrice: {
            amount: totalAmount.toFixed(2),
            currency: "USD"
        }
    };
}