import { createFileRoute } from "@tanstack/react-router";
import * as z from "zod";
import { mockBilling } from "@/data/mock-billing";
import { BillingPage } from "@/features/billing/billing-page";

// Stripe Checkout redirects back here with ?checkout=success or ?checkout=cancelled.
const searchSchema = z.object({
    checkout: z.enum(["success", "cancelled"]).optional().catch(undefined),
});

export const Route = createFileRoute("/_auth/billing")({
    validateSearch: searchSchema,
    head: () => ({
        meta: [
            { title: "Billing - Job Bot" },
            { name: "description", content: "Credits, auto-recharge and payment details" },
        ],
    }),
    // TODO: replace with the user's balance from the API and payment method from Stripe
    loader: () => ({ billing: mockBilling }),
    component: BillingRoute,
});

function BillingRoute() {
    const { billing } = Route.useLoaderData();
    const { checkout } = Route.useSearch();
    return <BillingPage billing={billing} checkout={checkout} />;
}
