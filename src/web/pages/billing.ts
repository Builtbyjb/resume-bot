import { html } from "hono/html";
import AuthLayout from "../layouts/auth-layout";
import ComingSoon from "../component/coming-soon";
import {
    autoRechargeLimits,
    type Billing,
    type CreditPack,
    type PaymentMethod,
} from "../types/billing";
import {
    btn,
    btnPrimary,
    btnDanger,
    pageHeader,
    settingsCard,
    settingsLayout,
    settingRow,
    settingLabel,
    fieldInput,
    botStatus,
    cardBody,
    confirmDialog,
    toast,
    controlGroup,
    notice,
    balanceHero,
    statList,
    packGrid,
    packCard,
    plainFieldset,
    cardBrand,
    paymentRow,
} from "../styles/style";

export type CheckoutResult = "success" | "cancelled";

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
const dateFormat = new Intl.DateTimeFormat("en-US", {
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

function Notices({ billing, checkout }: Props) {
    const { balance, autoRecharge } = billing;
    return html`
        ${checkout === "success"
            ? html`<p class="${notice}" data-variant="success" role="status">
                  Payment received. Your credits will appear in a moment.
              </p>`
            : ""}
        ${checkout === "cancelled"
            ? html`<p class="${notice}" role="status">
                  Checkout was cancelled. You haven't been charged.
              </p>`
            : ""}
        ${balance === 0
            ? html`<p class="${notice}" data-variant="danger">
                  You're out of credits, so the bot is paused. Buy credits to start applying again.
              </p>`
            : balance <= autoRecharge.threshold && !autoRecharge.enabled
              ? html`<p class="${notice}" data-variant="warning">
                    You're running low on credits. The bot pauses when you run out, so buy more or
                    turn on auto-recharge.
                </p>`
              : ""}
    `;
}

function BalanceSection(billing: Billing) {
    const { perDay, daysLeft } = usageStats(billing);
    return html`
        <section class="${settingsCard}" aria-labelledby="balance-title">
            <header>
                <h2 id="balance-title">Credits</h2>
                <p>1 credit = 1 application, including its tailored resume and cover letter.</p>
            </header>
            <div class="${cardBody}">
                <div class="${balanceHero}">
                    <div>
                        <strong>${billing.balance}</strong>
                        <small>credits available</small>
                    </div>
                    <a href="#packs" class="${btn} ${btnPrimary}">Buy credits</a>
                </div>
                <dl class="${statList}">
                    <div>
                        <dt>Used since ${dateFormat.format(billing.usage.periodStart)}</dt>
                        <dd>${billing.usage.used}</dd>
                    </div>
                    <div>
                        <dt>Average per day</dt>
                        <dd>${perDay.toFixed(1)}</dd>
                    </div>
                    <div>
                        <dt>Lasts about</dt>
                        <dd>
                            ${daysLeft === null
                                ? "—"
                                : `${daysLeft} ${daysLeft === 1 ? "day" : "days"}`}
                        </dd>
                    </div>
                </dl>
            </div>
        </section>
    `;
}

function PackCard(pack: CreditPack, basePerCredit: number) {
    const perCredit = pack.price / pack.credits;
    const savings = Math.round((1 - perCredit / basePerCredit) * 100);
    return html`
        <div class="${packCard}" ${pack.popular ? "data-popular" : ""}>
            <h3>${pack.credits} credits</h3>
            <strong>${money(pack.price, pack.currency)}</strong>
            <small>${money(perCredit, pack.currency)} per application</small>
            ${savings > 0
                ? html`<small data-savings>Save ${savings}%</small>`
                : html`<small>&nbsp;</small>`}
            <button
                type="button"
                class="${btn} ${pack.popular ? btnPrimary : ""}"
                data-stripe-redirect="/api/v1/billing/checkout"
                data-pack-id="${pack.id}"
            >
                Buy ${pack.credits} credits
            </button>
        </div>
    `;
}

function PacksSection(packs: CreditPack[]) {
    const basePerCredit = Math.max(...packs.map((p) => p.price / p.credits));
    return html`
        <section id="packs" class="${settingsCard}" aria-labelledby="packs-title">
            <header>
                <h2 id="packs-title">Buy credits</h2>
                <p>Bigger packs cost less per application. You'll pay securely on Stripe.</p>
            </header>
            <div class="${cardBody}">
                <div class="${packGrid}">${packs.map((pack) => PackCard(pack, basePerCredit))}</div>
            </div>
        </section>
    `;
}

function AutoRechargeSection(billing: Billing) {
    const { autoRecharge, paymentMethod, packs } = billing;
    const pack = packs.find((p) => p.id === autoRecharge.packId) ?? packs[0];
    const card = paymentMethod
        ? `${brandLabels[paymentMethod.brand]} •••• ${paymentMethod.last4}`
        : null;

    return html`
        <section class="${settingsCard}" aria-labelledby="auto-recharge-title">
            <header>
                <h2 id="auto-recharge-title">Auto-recharge</h2>
                <p>
                    <span
                        class="${botStatus}"
                        data-state="${autoRecharge.enabled ? "running" : "paused"}"
                    >
                        ${autoRecharge.enabled ? "On" : "Off"}
                    </span>
                    ${autoRecharge.enabled && card
                        ? ` When your balance drops below ${autoRecharge.threshold} credits, we'll buy ${pack.credits} credits (${money(pack.price, pack.currency)}) with your ${card}.`
                        : " Automatically buy credits when your balance runs low, so the bot never pauses."}
                </p>
            </header>
            <form id="auto-recharge-form" novalidate>
                <fieldset class="${plainFieldset}" ${paymentMethod ? "" : "disabled"}>
                    <div class="${settingRow}">
                        <label for="recharge-threshold" class="${settingLabel}">
                            <strong>Recharge when balance falls below</strong>
                            <small>Number of credits.</small>
                        </label>
                        <input
                            type="number"
                            id="recharge-threshold"
                            name="threshold"
                            class="${fieldInput}"
                            value="${autoRecharge.threshold}"
                            min="${autoRechargeLimits.threshold.min}"
                            max="${autoRechargeLimits.threshold.max}"
                            step="1"
                            required
                        />
                    </div>
                    <div class="${settingRow}">
                        <label for="recharge-pack" class="${settingLabel}">
                            <strong>Credits to buy</strong>
                            <small>Charged to your saved payment method.</small>
                        </label>
                        <select id="recharge-pack" name="packId" class="${fieldInput}">
                            ${packs.map(
                                (p) =>
                                    html`<option
                                        value="${p.id}"
                                        ${p.id === pack.id ? "selected" : ""}
                                    >
                                        ${p.credits} credits · ${money(p.price, p.currency)}
                                    </option>`,
                            )}
                        </select>
                    </div>
                    <div class="${settingRow}">
                        <p class="${settingLabel}">
                            <small>
                                ${paymentMethod
                                    ? "You can turn this off at any time."
                                    : "Buy a credit pack first to save a payment method."}
                            </small>
                        </p>
                        <div class="${controlGroup}">
                            ${autoRecharge.enabled
                                ? html`
                                      <button
                                          type="button"
                                          class="${btn} ${btnDanger}"
                                          data-open-turn-off
                                      >
                                          Turn off
                                      </button>
                                      <button type="submit" class="${btn} ${btnPrimary}">
                                          Save changes
                                      </button>
                                  `
                                : html`<button type="submit" class="${btn} ${btnPrimary}">
                                      Turn on auto-recharge
                                  </button>`}
                        </div>
                    </div>
                </fieldset>
            </form>
        </section>

        <dialog
            id="turn-off-auto-recharge-dialog"
            class="${confirmDialog}"
            aria-labelledby="turn-off-title"
        >
            <form>
                <h2 id="turn-off-title">Turn off auto-recharge?</h2>
                <p>
                    The bot will pause when your balance reaches 0 credits. You can turn
                    auto-recharge back on at any time.
                </p>
                <p role="alert"></p>
                <footer>
                    <button type="button" class="${btn}" data-close-dialog>Keep it on</button>
                    <button type="submit" class="${btn} ${btnDanger}" data-variant="solid">
                        Turn off
                    </button>
                </footer>
            </form>
        </dialog>
    `;
}

function PaymentSection(paymentMethod: PaymentMethod | null) {
    return html`
        <section class="${settingsCard}" aria-labelledby="payment-title">
            <header>
                <h2 id="payment-title">Payment method</h2>
                <p>Managed securely by Stripe. We never see or store your full card number.</p>
            </header>
            <div class="${cardBody}">
                ${paymentMethod
                    ? html`
                          <div class="${paymentRow}">
                              <span class="${cardBrand}">${brandLabels[paymentMethod.brand]}</span>
                              <span>
                                  <strong>•••• ${paymentMethod.last4}</strong>
                                  <small>
                                      Expires
                                      ${String(paymentMethod.expMonth).padStart(
                                          2,
                                          "0",
                                      )}/${paymentMethod.expYear}
                                  </small>
                              </span>
                              <button
                                  type="button"
                                  class="${btn}"
                                  data-stripe-redirect="/api/v1/billing/portal"
                              >
                                  Update
                              </button>
                          </div>
                      `
                    : html`<p class="${settingLabel}">
                          <small
                              >No payment method saved yet. One is saved when you buy
                              credits.</small
                          >
                      </p>`}
                <div class="${paymentRow}">
                    <span>
                        <strong>Receipts</strong>
                        <small>Download receipts for past purchases.</small>
                    </span>
                    <button
                        type="button"
                        class="${btn}"
                        data-stripe-redirect="/api/v1/billing/portal"
                    >
                        View receipts
                    </button>
                </div>
            </div>
        </section>
    `;
}

export default function BillingPage(props: Props) {
    const { billing } = props;
    return AuthLayout({
        title: "Billing - Job Bot",
        description: "Credits, auto-recharge and payment details",
        scriptPath: "/billing.js",
        activePath: "/billing",
        content: html`
            <header class="${pageHeader}">
                <h1>Billing</h1>
            </header>
            ${ComingSoon({
                feature: "billing",
                title: "Billing is coming soon",
                description:
                    "Pay-as-you-go credits are on the way. Here's a preview of how they'll work.",
                content: html`<div class="${settingsLayout}" data-billing>
                    ${Notices(props)} ${BalanceSection(billing)} ${PacksSection(billing.packs)}
                    ${AutoRechargeSection(billing)} ${PaymentSection(billing.paymentMethod)}
                </div>`,
            })}
            <div class="${toast}" role="status" aria-live="polite" data-toast></div>
        `,
    });
}
