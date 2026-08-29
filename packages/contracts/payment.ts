export type PaymentSuccess = {
    kind: "success";
    transactionId: string;
    amount: number;
    currency: string;
    paidAt: Date;
}

export type PaymentFailure = {
    kind: "failure";
    reason: string;
    code: number;
}

export type Payment = PaymentSuccess | PaymentFailure;