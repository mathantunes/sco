import type { AppDatabase } from "../database.js";
import type { OpenOrder, PaidOrder } from "contracts/order.js";
import type { PaymentSuccess } from "contracts/payment.js";

export class OrderService {
    constructor(private readonly database: AppDatabase) {}

    async abandonOrderForDevice(deviceId: string): Promise<void> {
        this.database.prepare(`
            UPDATE orders
            SET kind = 'abandoned', abandoned_at = ?
            WHERE device_id = ? AND kind = 'open'
        `).run(new Date().toISOString(), deviceId);
    }
    async createOrder(deviceId: string, storeId: string): Promise<OpenOrder> {
        const order: OpenOrder = {
            kind: "open",
            id: `order-${crypto.randomUUID()}`,
            deviceId,
            items: [],
            totalPrice: { amount: "0.00", currency: "USD" },
            createdAt: new Date(),
        };

        this.database.prepare(`
            INSERT INTO orders (id, device_id, store_id, kind, total_amount, currency, created_at)
            VALUES (?, ?, ?, 'open', '0.00', ?, ?)
        `).run(order.id, deviceId, storeId, order.totalPrice.currency, order.createdAt.toISOString());

        return order;
    }

    async getOpenOrderForDevice(deviceId: string): Promise<OpenOrder | null> {
        const row = this.database.prepare(`
            SELECT id, kind, device_id, total_amount, currency, created_at
            FROM orders
            WHERE device_id = ? AND kind = 'open'
            LIMIT 1
        `).get(deviceId) as OrderRow | undefined;

        if (!row) return null;
        return this.readOpenOrder(row);
    }

    async updateOrder(orderId: string, updatedOrder: OpenOrder): Promise<OpenOrder> {
        const update = this.database.prepare(`
            UPDATE orders
            SET total_amount = ?, currency = ?
            WHERE id = ? AND kind = 'open'
        `);
        const insertItem = this.database.prepare(`
            INSERT INTO order_items (
                order_id, id, product_id, product_name, product_price_amount,
                product_price_currency, quantity
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        const deleteItems = this.database.prepare('DELETE FROM order_items WHERE order_id = ?');

        this.database.exec('BEGIN');
        try {
            update.run(updatedOrder.totalPrice.amount, updatedOrder.totalPrice.currency, orderId);
            deleteItems.run(orderId);
            for (const item of updatedOrder.items) {
                insertItem.run(
                    orderId,
                    item.id,
                    item.product.id,
                    item.product.name,
                    item.product.price.amount,
                    item.product.price.currency,
                    item.quantity,
                );
            }
            this.database.exec('COMMIT');
        } catch (error) {
            this.database.exec('ROLLBACK');
            throw error;
        }

        return updatedOrder;
    }

    async markOrderAsPaid(order: OpenOrder, paymentDetails: PaymentSuccess): Promise<PaidOrder> {
        const paidAt = paymentDetails.paidAt.toISOString();
        this.database.exec('BEGIN');
        try {
            this.database.prepare(`
                UPDATE orders
                SET kind = 'paid', paid_at = ?, total_amount = ?, currency = ?
                WHERE id = ? AND kind = 'open'
            `).run(paidAt, paymentDetails.amount, paymentDetails.currency, order.id);
            this.database.prepare(`
                INSERT INTO payments (order_id, transaction_id, amount, currency, paid_at)
                VALUES (?, ?, ?, ?, ?)
            `).run(order.id, paymentDetails.transactionId, paymentDetails.amount, paymentDetails.currency, paidAt);
            this.database.exec('COMMIT');
        } catch (error) {
            this.database.exec('ROLLBACK');
            throw error;
        }

        return {
            ...order,
            kind: "paid",
            paidAt: paymentDetails.paidAt,
            payment: paymentDetails,
        };
    }

    private readOpenOrder(row: OrderRow): OpenOrder {
        const itemRows = this.database.prepare(`
                 SELECT id, product_id, product_name, product_price_amount,
                     product_price_currency, quantity
            FROM order_items
            WHERE order_id = ?
            ORDER BY rowid
        `).all(row.id) as ItemRow[];

        return {
            kind: 'open',
            id: row.id,
            deviceId: row.device_id,
            items: itemRows.map((item) => ({
                id: item.id,
                product: {
                    id: item.product_id,
                    name: item.product_name,
                    price: {
                        amount: item.product_price_amount,
                        currency: item.product_price_currency as 'USD',
                    },
                },
                quantity: item.quantity,
            })),
            totalPrice: { amount: row.total_amount, currency: row.currency as 'USD' },
            createdAt: new Date(row.created_at),
        };
    }
}

type OrderRow = {
    id: string;
    kind: 'open';
    device_id: string;
    total_amount: string;
    currency: string;
    created_at: string;
};

type ItemRow = {
    id: string;
    product_id: string;
    product_name: string;
    product_price_amount: string;
    product_price_currency: string;
    quantity: number;
};