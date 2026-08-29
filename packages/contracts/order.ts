import type { Price } from "./price.js";
import type { Product } from "./product.js";
import type { Payment } from "./payment.js";

export type OpenOrder = {
    kind: "open";
    id: string;
    items: OrderItem[];
    totalPrice: Price;
    createdAt: Date;
}

export type PaidOrder = OpenOrder & {
    kind: "paid";
    paidAt: Date;
    payment: Payment;
}

export type AbandonedOrder = OpenOrder & {
    kind: "abandoned";
    abandonedAt: Date;
}

export type Order = OpenOrder | PaidOrder | AbandonedOrder;

export type OrderItem = {
    id: string;
    product: Product;
    quantity: number;
};