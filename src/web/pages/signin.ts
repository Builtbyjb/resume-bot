import { html } from "hono/html";
import { css } from "hono/css";
import { btn, btnPrimary, card, wrap, form } from "../style";
import GuestLayout from "../layouts/guest-layout";

export default function SigninPage() {
    const h1Style = css`
        font-family: "Space Mono";
        font-style: italic;
    `;

    return GuestLayout({
        title: "Sign in - Job Bot",
        description: "Sign in to Job Bot",
        content: html`
            <div class="${wrap}">
                <form id="signin-form" class="${card} ${form}">
                    <h1 class=${h1Style}>Welcome back</h1>
                    <label>
                        Email
                        <input type="email" name="email" required />
                    </label>
                    <button type="submit" class="${btn} ${btnPrimary}">Sign In</button>
                </form>
            </div>
            <!-- OTP form -->
            <div id="otp-div" class="${wrap}" style="display: none">
                <form id="otp-form" class="${card} ${form}">
                    <label>
                        OTP - One Time Password
                        <input type="text" name="otp" required />
                    </label>
                    <button type="submit" class="${btn} ${btnPrimary}">Submit</button>
                </form>
                <p></p>
            </div>
        `,
    });
}
