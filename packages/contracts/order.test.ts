import { describe, expect, it } from "vitest";
import {
    addItemToOrder,
    computeTotalPrice,
    create,
    replaceItemInOrder,
    type OpenOrder,
    type OrderItem
} from "./order.js";

const createOrder = (items: OrderItem[] = []): OpenOrder => ({
    kind: "open",
    id: "order-1",
    deviceId: "device-1",
    items,
    totalPrice: { amount: "0.00", currency: "USD" },
    createdAt: new Date("2026-01-01T00:00:00.000Z")
});

const createItem = (id: string, amount: string, quantity: number): OrderItem => ({
    id: `item-${id}`,
    product: {
        id,
        name: `Product ${id}`,
        price: { amount, currency: "USD" }
    },
    quantity
});

describe("order helpers", () => {
    it("create returns a new empty open order with USD zero total", () => {
        const order = create();

        expect(order.kind).toBe("open");
        expect(order.id).toMatch(/^order-[0-9a-f-]+$/);
        expect(order.deviceId).toBe("");
        expect(order.items).toEqual([]);
        expect(order.totalPrice).toEqual({ amount: "0.00", currency: "USD" });
        expect(order.createdAt).toBeInstanceOf(Date);
    });

    it("addItemToOrder appends a new product without mutating the order", () => {
        const order = createOrder();
        const item = createItem("coffee", "2.50", 1);

        const updatedOrder = addItemToOrder(order, item);

        expect(updatedOrder.items).toEqual([item]);
        expect(order.items).toEqual([]);
    });

    it("addItemToOrder combines quantities for an existing product", () => {
        const existingItem = createItem("coffee", "2.50", 2);
        const order = createOrder([existingItem, createItem("tea", "1.75", 1)]);
        const addedItem = createItem("coffee", "2.50", 3);

        const updatedOrder = addItemToOrder(order, addedItem);

        expect(updatedOrder.items[0].quantity).toBe(5);
        expect(updatedOrder.items[0].id).toBe(existingItem.id);
        expect(updatedOrder.items[1]).toEqual(order.items[1]);
        expect(order.items[0].quantity).toBe(2);
    });

    it("replaceItemInOrder replaces an existing product while preserving its position", () => {
        const firstItem = createItem("coffee", "2.50", 1);
        const secondItem = createItem("tea", "1.75", 1);
        const order = createOrder([firstItem, secondItem]);
        const replacement = createItem("coffee", "2.50", 4);

        const updatedOrder = replaceItemInOrder(order, replacement);

        expect(updatedOrder.items).toEqual([replacement, secondItem]);
        expect(order.items).toEqual([firstItem, secondItem]);
    });

    it("replaceItemInOrder appends a product that is not already in the order", () => {
        const order = createOrder([createItem("coffee", "2.50", 1)]);
        const item = createItem("tea", "1.75", 2);

        expect(replaceItemInOrder(order, item).items).toEqual([order.items[0], item]);
    });

    it("computeTotalPrice sums item prices by quantity and returns two decimals", () => {
        const order = createOrder([
            createItem("coffee", "2.50", 2),
            createItem("tea", "1.75", 3)
        ]);

        const updatedOrder = computeTotalPrice(order);

        expect(updatedOrder.totalPrice).toEqual({ amount: "10.25", currency: "USD" });
        expect(order.totalPrice).toEqual({ amount: "0.00", currency: "USD" });
    });

    it("computeTotalPrice returns zero for an order with no items", () => {
        expect(computeTotalPrice(createOrder()).totalPrice).toEqual({
            amount: "0.00",
            currency: "USD"
        });
    });
});