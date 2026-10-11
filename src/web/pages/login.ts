import { html } from "hono/html";
import { css } from "hono/css";
import { btn, btnPrimary, card, wrap, form } from "../style";
import GuestLayout from "../layouts/guest-layout";

export default function LoginPage() {
    const h1Style = css`
        font-family: "Space Mono";
        font-style: italic;
    `;

    return GuestLayout({
        title: "Sign in - Job Bot",
        description: "Sign in to Job Bot",
        content: html`
            <div class="${wrap}">
                <form id="login-form" class="${card} ${form}">
                    <h1 class=${h1Style}>Welcome back</h1>
                    <label>
                        Email
                        <input type="email" name="email" required />
                    </label>
                    <label>
                        Password
                        <input type="password" name="password" required />
                    </label>
                    <button type="submit" class="${btn} ${btnPrimary}">
                        Sign In
                    </button>
                </form>
            </div>
        `,
    });
}
