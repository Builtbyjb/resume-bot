import { html } from "hono/html";
import { Style } from "hono/css";
import { globalStyle } from "../styles/style";
import { HtmlEscapedString } from "hono/utils/html";

export type LayoutProps = {
    title: string;
    description: string;
    scriptPath: string;
    content: HtmlEscapedString | Promise<HtmlEscapedString>;
};

export function RootLayout(props: LayoutProps) {
    return html`
        <!doctype html>
        <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
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
                ${props.content}
                <script src=${props.scriptPath} type="module"></script>
            </body>
        </html>
    `;
}
