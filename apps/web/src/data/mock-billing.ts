import type { Billing } from "@resume-bot/shared";

export const mockBilling: Billing = {
    balance: 86,
    usage: { periodStart: new Date("2026-10-01T00:00:00Z"), used: 34 },
    autoRecharge: { enabled: true, threshold: 10, packId: "pack_100" },
    paymentMethod: { brand: "visa", last4: "4242", expMonth: 8, expYear: 2028 },
    packs: [
        { id: "pack_25", credits: 25, price: 900, currency: "usd" },
        { id: "pack_100", credits: 100, price: 2900, currency: "usd", popular: true },
        { id: "pack_300", credits: 300, price: 6900, currency: "usd" },
    ],
};
