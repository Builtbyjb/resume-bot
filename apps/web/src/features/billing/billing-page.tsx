import { useState, type CSSProperties, type ReactNode } from "react";
import { revalidateLogic } from "@tanstack/react-form";
import { useRouter } from "@tanstack/react-router";
import {
    autoRechargeLimits,
    autoRechargeSchema,
    type Billing,
    type CreditPack,
    type PaymentMethod,
} from "@resume-bot/shared";
import { Button } from "@/components/ui/button";
import {
    linkButtonClass,
    type ButtonSize,
    type ButtonVariant,
} from "@/components/ui/button-styles";
import { Card, CardBody, PageHeader, SettingLabel, SettingRow, stackClass } from "@/components/ui/card";
import { ComingSoon } from "@/components/ui/coming-soon";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { StateIndicator } from "@/components/ui/status-badge";
import { useToast } from "@/components/ui/toast-context";
import { api } from "@/lib/api";
import { cx } from "@/lib/cx";
import { useAppForm } from "@/lib/form";

type CheckoutResult = "success" | "cancelled";

type Props = {
    billing: Billing;
    /** Set when Stripe Checkout redirects back (?checkout=success|cancelled). */
    checkout?: CheckoutResult;
};

const brandLabels: Record<PaymentMethod["brand"], string> = {
    visa: "Visa",
    mastercard: "Mastercard",
    amex: "Amex",
    discover: "Discover",
    other: "Card",
};

const DAY_MS = 24 * 60 * 60 * 1000;
const shortDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
});

/** `amount` is in cents. Whole amounts drop the decimals: $29, $0.29. */
function money(amount: number, currency: string) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency.toUpperCase(),
        minimumFractionDigits: amount % 100 === 0 ? 0 : 2,
    }).format(amount / 100);
}

function usageStats(billing: Billing, now = new Date()) {
    const daysElapsed = Math.max(1, (now.getTime() - billing.usage.periodStart.getTime()) / DAY_MS);
    const perDay = billing.usage.used / daysElapsed;
    const daysLeft = perDay > 0 ? Math.floor(billing.balance / perDay) : null;
    return { perDay, daysLeft };
}

export function BillingPage({ billing, checkout }: Props) {
    return (
        <>
            <PageHeader title="Billing" />
            <ComingSoon
                feature="billing"
                title="Billing is coming soon"
                description="Pay-as-you-go credits are on the way. Here's a preview of how they'll work."
            >
                <div className={stackClass}>
                    <Notices billing={billing} checkout={checkout} />
                    <BalanceSection billing={billing} />
                    <PacksSection packs={billing.packs} />
                    <AutoRechargeSection billing={billing} />
                    <PaymentSection paymentMethod={billing.paymentMethod} />
                </div>
            </ComingSoon>
        </>
    );
}

const noticeColors = {
    info: "#60a5fa",
    success: "#4ade80",
    warning: "#fbbf24",
    danger: "#f87171",
};

function Notice({
    variant = "info",
    role,
    children,
}: {
    variant?: keyof typeof noticeColors;
    role?: "status";
    children: ReactNode;
}) {
    return (
        <p
            role={role}
            style={{ "--notice": noticeColors[variant] } as CSSProperties}
            className="rounded-xl border border-[color-mix(in_srgb,var(--notice)_40%,transparent)] bg-[color-mix(in_srgb,var(--notice)_10%,transparent)] px-[1.1rem] py-[0.85rem] text-[0.875rem] text-(--notice)"
        >
            {children}
        </p>
    );
}

function Notices({ billing, checkout }: Props) {
    const { balance, autoRecharge } = billing;
    return (
        <>
            {checkout === "success" && (
                <Notice variant="success" role="status">
                    Payment received. Your credits will appear in a moment.
                </Notice>
            )}
            {checkout === "cancelled" && (
                <Notice role="status">Checkout was cancelled. You haven't been charged.</Notice>
            )}
            {balance === 0 ? (
                <Notice variant="danger">
                    You're out of credits, so the bot is paused. Buy credits to start applying
                    again.
                </Notice>
            ) : (
                balance <= autoRecharge.threshold &&
                !autoRecharge.enabled && (
                    <Notice variant="warning">
                        You're running low on credits. The bot pauses when you run out, so buy more
                        or turn on auto-recharge.
                    </Notice>
                )
            )}
        </>
    );
}

function BalanceSection({ billing }: { billing: Billing }) {
    const { perDay, daysLeft } = usageStats(billing);
    return (
        <Card
            title="Credits"
            titleId="balance-title"
            description="1 credit = 1 application, including its tailored resume and cover letter."
        >
            <CardBody>
                <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
                    <div className="flex flex-col gap-[0.2rem]">
                        <strong className="font-grotesk text-[3rem] leading-none font-semibold">
                            {billing.balance}
                        </strong>
                        <small className="text-[0.8rem] text-muted opacity-70">
                            credits available
                        </small>
                    </div>
                    <a href="#packs" className={linkButtonClass({ variant: "primary" })}>
                        Buy credits
                    </a>
                </div>
                <dl className="grid grid-cols-3 gap-3 max-[640px]:grid-cols-1 [&_dd]:font-grotesk [&_dd]:text-[1.25rem] [&_dt]:text-[0.75rem] [&_dt]:text-muted [&_dt]:opacity-70 [&>div]:flex [&>div]:flex-col [&>div]:gap-[0.2rem] [&>div]:rounded-xl [&>div]:border [&>div]:border-muted/10 [&>div]:px-4 [&>div]:py-[0.85rem]">
                    <div>
                        <dt>Used since {shortDate.format(billing.usage.periodStart)}</dt>
                        <dd>{billing.usage.used}</dd>
                    </div>
                    <div>
                        <dt>Average per day</dt>
                        <dd>{perDay.toFixed(1)}</dd>
                    </div>
                    <div>
                        <dt>Lasts about</dt>
                        <dd>
                            {daysLeft === null ? "—" : `${daysLeft} ${daysLeft === 1 ? "day" : "days"}`}
                        </dd>
                    </div>
                </dl>
            </CardBody>
        </Card>
    );
}

/** Checkout and the Customer Portal are Stripe-hosted: the API creates a session and returns its URL. */
function StripeButton({
    endpoint,
    packId,
    variant,
    size,
    className,
    children,
}: {
    endpoint: "/billing/checkout" | "/billing/portal";
    packId?: string;
    variant?: ButtonVariant;
    size?: ButtonSize;
    className?: string;
    children: ReactNode;
}) {
    const showToast = useToast();
    const [redirecting, setRedirecting] = useState(false);

    const redirect = async () => {
        setRedirecting(true);
        try {
            const { url } = await api<{ url?: string }>(endpoint, {
                method: "POST",
                body: packId ? { packId } : {},
            });
            if (!url) throw new Error("Stripe session URL missing");
            window.location.href = url;
        } catch {
            showToast("Couldn't connect to Stripe. Please try again.", "error");
            setRedirecting(false);
        }
    };

    return (
        <Button
            variant={variant}
            size={size}
            className={className}
            disabled={redirecting}
            onClick={redirect}
        >
            {redirecting ? "Redirecting…" : children}
        </Button>
    );
}

function PackCard({ pack, basePerCredit }: { pack: CreditPack; basePerCredit: number }) {
    const perCredit = pack.price / pack.credits;
    const savings = Math.round((1 - perCredit / basePerCredit) * 100);
    const smallClass = "text-[0.8rem] text-muted opacity-70";

    return (
        <div
            className={cx(
                "relative flex flex-col gap-[0.35rem] rounded-[14px] border px-5 pt-[1.4rem] pb-5",
                pack.popular ? "border-accent bg-accent/6" : "border-muted/15",
            )}
        >
            {pack.popular && (
                <span className="absolute -top-[0.65rem] left-5 rounded-full bg-accent px-[0.55rem] py-[0.05rem] text-[0.7rem] text-white">
                    Most popular
                </span>
            )}
            <h3 className="text-[1.05rem]">{pack.credits} credits</h3>
            <strong className="font-grotesk text-[2rem] leading-[1.1] font-semibold">
                {money(pack.price, pack.currency)}
            </strong>
            <small className={smallClass}>{money(perCredit, pack.currency)} per application</small>
            {savings > 0 ? (
                <small className="text-[0.8rem] text-success">Save {savings}%</small>
            ) : (
                <small className={smallClass}>&nbsp;</small>
            )}
            <StripeButton
                endpoint="/billing/checkout"
                packId={pack.id}
                variant={pack.popular ? "primary" : "default"}
                size="pack"
                className="mt-[0.9rem]"
            >
                Buy {pack.credits} credits
            </StripeButton>
        </div>
    );
}

function PacksSection({ packs }: { packs: CreditPack[] }) {
    const basePerCredit = Math.max(...packs.map((p) => p.price / p.credits));
    return (
        <Card
            id="packs"
            title="Buy credits"
            titleId="packs-title"
            description="Bigger packs cost less per application. You'll pay securely on Stripe."
        >
            <CardBody>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-[0.9rem]">
                    {packs.map((pack) => (
                        <PackCard key={pack.id} pack={pack} basePerCredit={basePerCredit} />
                    ))}
                </div>
            </CardBody>
        </Card>
    );
}

function AutoRechargeSection({ billing }: { billing: Billing }) {
    const router = useRouter();
    const showToast = useToast();
    const [turnOffOpen, setTurnOffOpen] = useState(false);
    const { autoRecharge, paymentMethod, packs } = billing;
    const pack = packs.find((p) => p.id === autoRecharge.packId) ?? packs[0];
    const card = paymentMethod
        ? `${brandLabels[paymentMethod.brand]} •••• ${paymentMethod.last4}`
        : null;

    const save = async (value: { enabled: boolean; threshold: number; packId: string }) => {
        await api("/billing/auto-recharge", { method: "PUT", body: value });
        // The section's copy and buttons depend on the saved state, so reload it.
        await router.invalidate();
    };

    const form = useAppForm({
        defaultValues: {
            enabled: autoRecharge.enabled,
            threshold: autoRecharge.threshold,
            packId: pack.id,
        },
        validationLogic: revalidateLogic(),
        validators: { onDynamic: autoRechargeSchema },
        onSubmit: async ({ value }) => {
            try {
                await save({ ...value, enabled: true });
            } catch {
                showToast("Couldn't update auto-recharge. Please try again.", "error");
            }
        },
    });

    return (
        <>
            <Card
                title="Auto-recharge"
                titleId="auto-recharge-title"
                description={
                    <>
                        <StateIndicator on={autoRecharge.enabled}>
                            {autoRecharge.enabled ? "On" : "Off"}
                        </StateIndicator>
                        {autoRecharge.enabled && card
                            ? ` When your balance drops below ${autoRecharge.threshold} credits, we'll buy ${pack.credits} credits (${money(pack.price, pack.currency)}) with your ${card}.`
                            : " Automatically buy credits when your balance runs low, so the bot never pauses."}
                    </>
                }
            >
                <form
                    noValidate
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        void form.handleSubmit();
                    }}
                >
                    <fieldset
                        disabled={!paymentMethod}
                        className="m-0 min-w-0 border-0 p-0 disabled:opacity-50"
                    >
                        <SettingRow>
                            <SettingLabel
                                as="label"
                                htmlFor="recharge-threshold"
                                title="Recharge when balance falls below"
                                description="Number of credits."
                            />
                            <form.AppField name="threshold">
                                {(field) => (
                                    <div className="flex flex-col gap-1">
                                        <field.NumberInput
                                            id="recharge-threshold"
                                            min={autoRechargeLimits.threshold.min}
                                            max={autoRechargeLimits.threshold.max}
                                            step={1}
                                            required
                                        />
                                        <field.FieldError />
                                    </div>
                                )}
                            </form.AppField>
                        </SettingRow>
                        <SettingRow>
                            <SettingLabel
                                as="label"
                                htmlFor="recharge-pack"
                                title="Credits to buy"
                                description="Charged to your saved payment method."
                            />
                            <form.AppField name="packId">
                                {(field) => (
                                    <field.Select
                                        id="recharge-pack"
                                        options={packs.map((p) => ({
                                            value: p.id,
                                            label: `${p.credits} credits · ${money(p.price, p.currency)}`,
                                        }))}
                                    />
                                )}
                            </form.AppField>
                        </SettingRow>
                        <SettingRow>
                            <SettingLabel
                                as="p"
                                description={
                                    paymentMethod
                                        ? "You can turn this off at any time."
                                        : "Buy a credit pack first to save a payment method."
                                }
                            />
                            <form.Subscribe selector={(state) => state.isSubmitting}>
                                {(isSubmitting) => (
                                    <div className="flex flex-wrap items-center gap-2 text-[0.85rem] text-muted">
                                        {autoRecharge.enabled && (
                                            <Button
                                                variant="danger"
                                                size="compact"
                                                onClick={() => setTurnOffOpen(true)}
                                            >
                                                Turn off
                                            </Button>
                                        )}
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting
                                                ? "Saving…"
                                                : autoRecharge.enabled
                                                  ? "Save changes"
                                                  : "Turn on auto-recharge"}
                                        </Button>
                                    </div>
                                )}
                            </form.Subscribe>
                        </SettingRow>
                    </fieldset>
                </form>
            </Card>

            <ConfirmDialog
                open={turnOffOpen}
                onClose={() => setTurnOffOpen(false)}
                titleId="turn-off-title"
                title="Turn off auto-recharge?"
                description="The bot will pause when your balance reaches 0 credits. You can turn auto-recharge back on at any time."
                cancelLabel="Keep it on"
                confirmLabel="Turn off"
                workingLabel="Turning off…"
                onConfirm={async () => {
                    await save({ ...form.state.values, enabled: false });
                    setTurnOffOpen(false);
                }}
            />
        </>
    );
}

function PaymentSection({ paymentMethod }: { paymentMethod: PaymentMethod | null }) {
    const rowClass = "flex flex-wrap items-center gap-[0.9rem]";
    const detailsClass = "flex min-w-[10rem] flex-1 flex-col";

    return (
        <Card
            title="Payment method"
            titleId="payment-title"
            description="Managed securely by Stripe. We never see or store your full card number."
        >
            <CardBody>
                {paymentMethod ? (
                    <div className={rowClass}>
                        <span className="inline-flex min-w-[3.25rem] items-center justify-center rounded-md border border-muted/25 px-2 py-[0.3rem] text-[0.7rem] font-bold tracking-[0.05em] uppercase">
                            {brandLabels[paymentMethod.brand]}
                        </span>
                        <span className={detailsClass}>
                            <strong className="text-[0.95rem] font-normal">
                                •••• {paymentMethod.last4}
                            </strong>
                            <small className="text-[0.75rem] text-muted opacity-65">
                                Expires {String(paymentMethod.expMonth).padStart(2, "0")}/
                                {paymentMethod.expYear}
                            </small>
                        </span>
                        <StripeButton endpoint="/billing/portal" size="row">
                            Update
                        </StripeButton>
                    </div>
                ) : (
                    <SettingLabel
                        as="p"
                        description="No payment method saved yet. One is saved when you buy credits."
                    />
                )}
                <div className={rowClass}>
                    <span className={detailsClass}>
                        <strong className="text-[0.95rem] font-normal">Receipts</strong>
                        <small className="text-[0.75rem] text-muted opacity-65">
                            Download receipts for past purchases.
                        </small>
                    </span>
                    <StripeButton endpoint="/billing/portal" size="row">
                        View receipts
                    </StripeButton>
                </div>
            </CardBody>
        </Card>
    );
}
