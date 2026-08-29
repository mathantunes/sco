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