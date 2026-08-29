import { OpenOrder } from "contracts/order.js";
import { Payment } from "contracts/payment.js";

export class CheckoutService {
    async Checkout(order: OpenOrder): Promise<Payment> {
        // Mock implementation of the checkout process
        await new Promise((resolve) => setTimeout(resolve, 5000));

        // return {
        //     kind: "failure",
        //     reason: "Payment failed due to insufficient funds.",
        //     code: 402
        // }
        
        return {
            kind: "success",
            transactionId: `txn_${crypto.randomUUID()}`,
            amount: order.totalPrice.amount,
            currency: order.totalPrice.currency,
            paidAt: new Date()
        };
    }
}
