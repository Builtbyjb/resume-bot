import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/billing")({
  head: () => ({
    meta: [
      { title: "Billing - Job Bot" },
      { name: "description", content: "Credits, auto-recharge and payment details" },
    ],
  }),
  // loader: () => ({ billing: mockBilling }),
  component: BillingRoute,
});

function BillingRoute() {
  return <h1>Billing</h1>;
}
