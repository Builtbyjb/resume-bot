import { html } from "hono/html";
import { HtmlEscapedString } from "hono/utils/html";
import { css } from "hono/css";
import RootLayout from "./root-layout";
import { header, container, nav, footer } from "../style";

type Props = {
    title: string;
    description: string;
    content: HtmlEscapedString | Promise<HtmlEscapedString>;
};

export default function GuestLayout(props: Props) {
    const logo = css`
        font-family: "Space Mono";
        font-style: italic;
        font-weight: 700;
    `;

    return RootLayout({
        title: props.title,
        description: props.description,
        content: html`
            <header class="${header}">
                <nav class="${container} ${nav}">
                    <a href="/">
                        <div>
                            <p class=${logo}>JobBot</p>
                        </div>
                    </a>
                </nav>
            </header>
            <main>${props.content}</main>
            <footer class="${footer}">
                <div class="${container}">
                    &copy; ${new Date().getFullYear()} ACorp. All rights reserved.
                </div>
            </footer>
        `,
    });
}
