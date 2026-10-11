import { html } from "hono/html";
import { css, Style } from "hono/css";
import { globalStyle, header, container, nav, footer } from "../style";
import { HtmlEscapedString } from "hono/utils/html";

type LayoutProps = {
    title: string;
    description: string;
    content: HtmlEscapedString | Promise<HtmlEscapedString>;
};

export default function Layout(props: LayoutProps) {
    const logo = css`
        font-family: "Space Mono";
        font-style: italic;
        font-weight: 700;
    `;

    return html`
        <!doctype html>
        <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossorigin
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap"
                    rel="stylesheet"
                />
                <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
                <meta name="color-scheme" content="dark" />
                <meta name="description" content="${props.description}" />
                <title>${props.title}</title>
                ${Style()}
            </head>
            <body class="${globalStyle}">
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
                        &copy; ${new Date().getFullYear()} ACorp
                    </div>
                </footer>
            </body>
        </html>
    `;
}
