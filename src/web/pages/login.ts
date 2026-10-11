import { html } from "hono/html";
import { css } from "hono/css";
import Layout from "./layout";
import { btn, btnPrimary, card, wrap, form } from "../style";

export default function LoginPage() {
    const h1Style = css`
        font-family: "Space Mono";
        font-style: italic;
    `;

    return Layout({
        title: "Sign in - Resume Bot",
        description: "Sign in to Resume Bot",
        content: html`
            <div class="${wrap}">
                <form method="post" action="/login" class="${card} ${form}">
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
                        Sign in
                    </button>
                </form>
            </div>
        `,
    });
}
