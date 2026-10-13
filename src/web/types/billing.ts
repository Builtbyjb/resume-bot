export type CreditPack = {
    /** Maps to a Stripe Price once billing is live. */
    id: string;
    credits: number;
    /** In the smallest currency unit (cents). */
    price: number;
    currency: string;
    popular?: boolean;
};

export type PaymentMethod = {
    brand: "visa" | "mastercard" | "amex" | "discover" | "other";
    last4: string;
    expMonth: number;
    expYear: number;
};

export type Billing = {
    /** 1 credit = 1 application (tailored resume and cover letter included). */
    balance: number;
    usage: { periodStart: Date; used: number };
    autoRecharge: { enabled: boolean; threshold: number; packId: string };
    paymentMethod: PaymentMethod | null;
    packs: CreditPack[];
};

export const autoRechargeLimits = {
    threshold: { min: 1, max: 100 },
};
