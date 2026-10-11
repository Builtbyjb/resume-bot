import { css, Style } from "hono/css";

export const globalStyle = css`
    :-hono-global {
        :root {
            --bg: #1f1f1f;
            --border: #e6e8ee;
            --text: #ffffff;
            --muted: #e6e8ee;
            --accent: #3b82f6;
        }
        *,
        *::before,
        *::after {
            box-sizing: border-box;
            margin: 0;
        }

        html {
            color-scheme: dark;
            scroll-behavior: smooth;
        }

        body {
            background: var(--bg);
            color: var(--text);
            font-family: "Space Mono", monospace;
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
        }

        a {
            color: inherit;
            text-decoration: none;
        }

        h1,
        h2,
        h3 {
            font-family: "Space Grotesk", sans-serif;
            line-height: 1.15;
            letter-spacing: -0.02em;
        }

        input {
            font: inherit;
        }
    }
`;

export const container = css`
    width: 100%;
    max-width: 1080px;
    margin: 0 auto;
    padding: 0 1.5rem;
`;

export const btn = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.7rem 1.4rem;
    border-radius: 10px;
    border: 1px solid var(--border);
    cursor: pointer;
    color: var(--text);
    background: transparent;
    transition:
        transform 0.15s,
        border-color 0.15s,
        box-shadow 0.15s;
    &:hover {
        border-color: var(--muted);
        transform: translateY(-1px);
    }
`;

export const btnPrimary = css`
    color: #333;
    cursor: pointer;
    background: #e6e8ee;
`;

export const card = css`
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 1.75rem;
`;

export const header = css`
    /* border-bottom: 1px solid var(--border) */
    position: sticky;
    top: 0;
    z-index: 10;
`;

export const nav = css`
    display: flex;
    background: var(--bg);
    align-items: center;
    justify-content: space-between;
    height: 64px;
    opacity: 0.9;
`;

export const footer = css`
    /* border-top: 1px solid var(--border); */
    padding: 2rem 0;
    color: var(--muted);
    font-size: 0.875rem;
    text-align: center;
`;

export const hero = css`
    text-align: center;
    padding: 7rem 0 5rem;
    h1 {
        font-size: clamp(2.5rem, 7vw, 4.5rem);
        max-width: 14ch;
        margin: 0 auto 1.25rem;
    }
    h1 em {
        font-family: "Space Mono", monospace;
    }
    p {
        color: var(--muted);
        font-size: 1.15rem;
        max-width: 52ch;
        margin: 0 auto 2rem;
    }
`;

export const actions = css`
    display: flex;
    gap: 0.75rem;
    justify-content: center;
    flex-wrap: wrap;
`;

export const section = css`
    padding: 4rem 0;
    h2 {
        font-size: 2rem;
        text-align: center;
        margin-bottom: 2.5rem;
    }
`;

export const grid = css`
    display: grid;
    gap: 1.25rem;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    h3 {
        font-size: 1.15rem;
        margin-bottom: 0.5rem;
    }
    p {
        color: var(--muted);
        font-size: 0.95rem;
    }
`;

export const wrap = css`
    display: flex;
    justify-content: center;
    padding: 5rem 1.5rem;
`;

export const form = css`
    width: 100%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    h1 {
        font-size: 1.6rem;
    }
    p {
        color: var(--muted);
        font-size: 0.95rem;
    }
    label {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        font-size: 0.875rem;
        color: var(--muted);
    }
    input {
        padding: 0.7rem 0.9rem;
        border-radius: 10px;
        border: 1px solid var(--border);
        background: var(--bg);
        color: var(--text);
        outline: none;
        transition: border-color 0.15s;
        &:focus {
            border-color: var(--accent);
        }
    }
`;
