import { css, keyframes } from "hono/css";

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
    font-family: "Space Mono", "Monospace";
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
    color: #fff;
    cursor: pointer;
    background: var(--accent);
    border: none;
`;

export const card = css`
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
        color: var(--accent);
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

export const shell = css`
    display: flex;
    min-height: 100vh;
    @media (max-width: 720px) {
        flex-direction: column;
    }
`;

export const sidebar = css`
    width: 240px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 1.5rem 1rem;
    border-right: 1px solid rgba(230, 232, 238, 0.12);
    position: sticky;
    top: 0;
    height: 100vh;
    @media (max-width: 720px) {
        position: static;
        width: 100%;
        height: auto;
        gap: 1rem;
        border-right: none;
        border-bottom: 1px solid rgba(230, 232, 238, 0.12);
    }
`;

export const sidebarBrand = css`
    font-family: "Space Mono", monospace;
    font-style: italic;
    font-weight: 700;
    font-size: 1.1rem;
    padding: 0 0.5rem;
`;

export const sidebarNav = css`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex: 1;
    @media (max-width: 720px) {
        flex-direction: row;
        flex-wrap: wrap;
    }
`;

export const sidebarLink = css`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.6rem 0.9rem;
    border-radius: 10px;
    color: var(--muted);
    font-size: 0.95rem;
    transition:
        background 0.15s,
        color 0.15s;
    svg {
        width: 18px;
        height: 18px;
        flex-shrink: 0;
    }
    &:hover {
        background: rgba(230, 232, 238, 0.08);
        color: var(--text);
    }
    &.active {
        background: var(--accent);
        color: #fff;
    }
`;

export const sidebarFooter = css`
    padding: 0 0.5rem;
    color: var(--muted);
    font-size: 0.75rem;
    @media (max-width: 720px) {
        display: none;
    }
`;

export const main = css`
    flex: 1;
    min-width: 0;
    padding: 2.5rem;
    @media (max-width: 720px) {
        padding: 1.5rem;
    }
`;

export const wrap = css`
    display: flex;
    justify-content: center;
    padding: 5rem 2rem 1.5rem;
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

/* ---------- Jobs page ---------- */

export const pageHeader = css`
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1.75rem;
    h1 {
        font-size: 2rem;
    }
    p {
        color: var(--muted);
        opacity: 0.7;
        font-size: 0.875rem;
    }
`;

export const tableWrap = css`
    border: 1px solid rgba(230, 232, 238, 0.12);
    border-radius: 12px;
    overflow-x: auto;
`;

export const table = css`
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;
    th {
        text-align: left;
        font-weight: 400;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: var(--muted);
        opacity: 0.7;
        padding: 0.8rem 1.1rem;
        border-bottom: 1px solid rgba(230, 232, 238, 0.12);
        white-space: nowrap;
    }
    td {
        padding: 0.95rem 1.1rem;
        border-bottom: 1px solid rgba(230, 232, 238, 0.08);
        white-space: nowrap;
    }
    tbody tr {
        cursor: pointer;
        outline: none;
        transition: background 0.15s;
        &:last-child td {
            border-bottom: none;
        }
        &:hover {
            background: rgba(230, 232, 238, 0.05);
        }
        &:focus-visible {
            box-shadow: inset 2px 0 0 var(--accent);
            background: rgba(230, 232, 238, 0.05);
        }
        &.selected {
            background: rgba(59, 130, 246, 0.12);
            box-shadow: inset 2px 0 0 var(--accent);
        }
    }
`;

export const jobTitleCell = css`
    font-family: "Space Grotesk", sans-serif;
    font-weight: 500;
    font-size: 0.975rem;
`;

export const mutedCell = css`
    color: var(--muted);
    opacity: 0.75;
`;

export const statusBadge = css`
    --badge: #a1a1aa;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.15rem 0.6rem;
    border-radius: 999px;
    font-size: 0.75rem;
    color: var(--badge);
    background: color-mix(in srgb, var(--badge) 14%, transparent);
    border: 1px solid color-mix(in srgb, var(--badge) 35%, transparent);
    white-space: nowrap;
    &::before {
        content: "";
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: currentColor;
    }
    &[data-status="applied"] {
        --badge: #60a5fa;
    }
    &[data-status="interviewing"] {
        --badge: #a78bfa;
    }
    &[data-status="offer"] {
        --badge: #4ade80;
    }
    &[data-status="rejected"] {
        --badge: #f87171;
    }
    &[data-status="failed"] {
        --badge: #fb923c;
    }
    /* Feedback statuses */
    &[data-status="new"] {
        --badge: #fbbf24;
    }
    &[data-status="under_review"] {
        --badge: #60a5fa;
    }
    &[data-status="planned"] {
        --badge: #a78bfa;
    }
    &[data-status="resolved"] {
        --badge: #4ade80;
    }
`;

export const emptyState = css`
    border: 1px dashed rgba(230, 232, 238, 0.2);
    border-radius: 12px;
    padding: 4rem 1.5rem;
    text-align: center;
    color: var(--muted);
    h2 {
        font-size: 1.25rem;
        color: var(--text);
        margin-bottom: 0.5rem;
    }
    p {
        opacity: 0.7;
        font-size: 0.9rem;
    }
`;

const drawerSlideIn = keyframes`
    from {
        transform: translateX(100%);
    }
    to {
        transform: translateX(0);
    }
`;

const backdropFadeIn = keyframes`
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
`;

export const drawer = css`
    position: fixed;
    inset: 0 0 0 auto;
    margin: 0;
    width: min(500px, 100vw);
    max-width: 100vw;
    height: 100%;
    max-height: none;
    padding: 0;
    border: none;
    border-left: 1px solid rgba(230, 232, 238, 0.12);
    background: var(--bg);
    color: var(--text);
    &[open] {
        display: flex;
        flex-direction: column;
        animation: ${drawerSlideIn} 0.22s ease-out;
    }
    &::backdrop {
        background: rgba(0, 0, 0, 0.55);
        animation: ${backdropFadeIn} 0.22s ease-out;
    }
    @media (prefers-reduced-motion: reduce) {
        &[open],
        &::backdrop {
            animation: none;
        }
    }
`;

export const drawerBar = css`
    display: flex;
    justify-content: flex-end;
    padding: 0.75rem 0.75rem 0;
    form {
        display: contents;
    }
`;

export const iconButton = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    border: none;
    background: transparent;
    color: var(--muted);
    cursor: pointer;
    transition:
        background 0.15s,
        color 0.15s;
    svg {
        width: 18px;
        height: 18px;
    }
    &:hover,
    &:focus-visible {
        background: rgba(230, 232, 238, 0.08);
        color: var(--text);
        outline: none;
    }
`;

export const drawerBody = css`
    flex: 1;
    overflow-y: auto;
    padding: 0.25rem 1.75rem 2rem;
`;

export const jobDetail = css`
    display: flex;
    flex-direction: column;
    gap: 1.75rem;
    header {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }
    header p {
        color: var(--muted);
        opacity: 0.75;
        font-size: 0.9rem;
    }
    h2 {
        font-size: 1.6rem;
    }
    h3 {
        font-size: 0.75rem;
        font-family: "Space Mono", monospace;
        font-weight: 400;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: var(--muted);
        opacity: 0.7;
        margin-bottom: 0.75rem;
    }
    dl {
        display: grid;
        grid-template-columns: max-content 1fr;
        gap: 0.6rem 1.5rem;
        font-size: 0.9rem;
    }
    dt {
        color: var(--muted);
        opacity: 0.7;
    }
    dd a {
        color: var(--accent);
        &:hover {
            text-decoration: underline;
        }
    }
    section > p {
        font-size: 0.9rem;
        color: var(--muted);
        white-space: pre-line;
    }
`;

export const artifactList = css`
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    a {
        display: flex;
        align-items: center;
        gap: 0.9rem;
        padding: 0.8rem 1rem;
        border: 1px solid rgba(230, 232, 238, 0.12);
        border-radius: 12px;
        transition:
            border-color 0.15s,
            background 0.15s;
        &:hover,
        &:focus-visible {
            border-color: var(--accent);
            background: rgba(59, 130, 246, 0.08);
            outline: none;
        }
    }
    svg {
        width: 20px;
        height: 20px;
        flex-shrink: 0;
        color: var(--muted);
    }
    span {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
    }
    strong {
        font-weight: 400;
        font-size: 0.9rem;
    }
    small {
        color: var(--muted);
        opacity: 0.6;
        font-size: 0.75rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
`;

/* ---------- Settings page ---------- */

export const settingsLayout = css`
    max-width: 760px;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

export const settingsCard = css`
    border: 1px solid rgba(230, 232, 238, 0.12);
    border-radius: 14px;
    > header {
        padding: 1.25rem 1.5rem;
    }
    > header h2 {
        font-size: 1.15rem;
        margin-bottom: 0.25rem;
    }
    > header p {
        color: var(--muted);
        opacity: 0.7;
        font-size: 0.85rem;
    }
    &[data-variant="danger"] {
        border-color: rgba(248, 113, 113, 0.35);
    }
    &[data-variant="danger"] > header h2 {
        color: #f87171;
    }
`;

export const settingRow = css`
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 0.75rem 2rem;
    padding: 1.1rem 1.5rem;
    border-top: 1px solid rgba(230, 232, 238, 0.08);
    @media (max-width: 640px) {
        grid-template-columns: 1fr;
    }
`;

export const settingLabel = css`
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    strong {
        font-weight: 400;
        font-size: 0.95rem;
    }
    small {
        color: var(--muted);
        opacity: 0.65;
        font-size: 0.8rem;
        line-height: 1.5;
    }
`;

export const controlGroup = css`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    color: var(--muted);
    font-size: 0.85rem;
`;

export const fieldInput = css`
    font: inherit;
    font-size: 0.9rem;
    padding: 0.5rem 0.75rem;
    border-radius: 10px;
    border: 1px solid rgba(230, 232, 238, 0.25);
    background: var(--bg);
    color: var(--text);
    outline: none;
    transition: border-color 0.15s;
    &[type="number"] {
        width: 6rem;
    }
    &:focus {
        border-color: var(--accent);
    }
    &:user-invalid {
        border-color: #f87171;
    }
`;

export const switchInput = css`
    appearance: none;
    position: relative;
    flex-shrink: 0;
    width: 42px;
    height: 24px;
    margin: 0;
    border-radius: 999px;
    background: rgba(230, 232, 238, 0.2);
    cursor: pointer;
    transition: background 0.2s;
    &::before {
        content: "";
        position: absolute;
        top: 3px;
        left: 3px;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: #fff;
        transition: transform 0.2s;
    }
    &:checked {
        background: var(--accent);
    }
    &:checked::before {
        transform: translateX(18px);
    }
    &:focus-visible {
        outline: 2px solid var(--accent);
        outline-offset: 2px;
    }
`;

export const botStatus = css`
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    font-size: 0.8rem;
    color: #a1a1aa;
    &::before {
        content: "";
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: currentColor;
    }
    &[data-state="running"] {
        color: #4ade80;
    }
`;

export const chipPicker = css`
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    label {
        position: relative;
        cursor: pointer;
    }
    input {
        position: absolute;
        opacity: 0;
        inset: 0;
        margin: 0;
        cursor: pointer;
    }
    span {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 2.9rem;
        padding: 0.4rem 0.6rem;
        border-radius: 8px;
        border: 1px solid rgba(230, 232, 238, 0.25);
        font-size: 0.8rem;
        color: var(--muted);
        transition:
            background 0.15s,
            border-color 0.15s,
            color 0.15s;
    }
    input:checked + span {
        background: var(--accent);
        border-color: var(--accent);
        color: #fff;
    }
    input:focus-visible + span {
        outline: 2px solid var(--accent);
        outline-offset: 2px;
    }
`;

export const linkButton = css`
    font: inherit;
    font-size: 0.8rem;
    padding: 0;
    border: none;
    background: none;
    color: var(--accent);
    cursor: pointer;
    &:hover {
        text-decoration: underline;
    }
    &[hidden] {
        display: none;
    }
`;

export const radioList = css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 0.6rem;
    padding: 1.1rem 1.5rem 1.4rem;
    border-top: 1px solid rgba(230, 232, 238, 0.08);
    label {
        display: flex;
        align-items: flex-start;
        gap: 0.7rem;
        padding: 0.8rem 1rem;
        border: 1px solid rgba(230, 232, 238, 0.15);
        border-radius: 12px;
        cursor: pointer;
        transition:
            border-color 0.15s,
            background 0.15s;
        &:has(input:checked) {
            border-color: var(--accent);
            background: rgba(59, 130, 246, 0.08);
        }
        &:has(input:focus-visible) {
            outline: 2px solid var(--accent);
            outline-offset: 2px;
        }
    }
    input {
        accent-color: var(--accent);
        margin: 0.3rem 0 0;
    }
    &[data-flush] {
        padding: 0;
        border-top: none;
    }
`;

export const btnDanger = css`
    font-size: 0.875rem;
    padding: 0.55rem 1.1rem;
    color: #f87171;
    border-color: rgba(248, 113, 113, 0.5);
    white-space: nowrap;
    &:hover {
        border-color: #f87171;
        background: rgba(248, 113, 113, 0.1);
    }
    &[data-variant="solid"] {
        color: #fff;
        background: #dc2626;
        border-color: #dc2626;
    }
    &:disabled {
        opacity: 0.45;
        cursor: not-allowed;
        transform: none;
    }
`;

export const saveBar = css`
    position: sticky;
    bottom: 1rem;
    z-index: 5;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.75rem 1rem;
    padding: 0.75rem 0.75rem 0.75rem 1.25rem;
    border: 1px solid rgba(230, 232, 238, 0.18);
    border-radius: 14px;
    background: #2a2a2a;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45);
    font-size: 0.875rem;
    &[hidden] {
        display: none;
    }
    div {
        display: flex;
        gap: 0.5rem;
    }
    button {
        font-size: 0.875rem;
        padding: 0.5rem 1rem;
    }
    button:disabled {
        opacity: 0.6;
        cursor: progress;
        transform: none;
    }
`;

export const confirmDialog = css`
    width: min(440px, calc(100vw - 2rem));
    padding: 1.5rem;
    border: 1px solid rgba(230, 232, 238, 0.15);
    border-radius: 16px;
    background: var(--bg);
    color: var(--text);
    &[open] {
        animation: ${backdropFadeIn} 0.15s ease-out;
    }
    &::backdrop {
        background: rgba(0, 0, 0, 0.6);
    }
    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    h2 {
        font-size: 1.2rem;
    }
    p {
        color: var(--muted);
        font-size: 0.875rem;
    }
    label {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        font-size: 0.85rem;
        color: var(--muted);
    }
    [role="alert"] {
        color: #f87171;
        font-size: 0.85rem;
    }
    [role="alert"]:empty {
        display: none;
    }
    footer {
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
    }
    footer button {
        font-size: 0.875rem;
        padding: 0.55rem 1.1rem;
    }
`;

export const toast = css`
    position: fixed;
    right: 1.5rem;
    bottom: 1.5rem;
    z-index: 20;
    padding: 0.7rem 1.1rem;
    border-radius: 10px;
    border: 1px solid rgba(74, 222, 128, 0.4);
    background: #1f2a22;
    color: #4ade80;
    font-size: 0.875rem;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45);
    &[data-variant="error"] {
        border-color: rgba(248, 113, 113, 0.4);
        background: #2a1f1f;
        color: #f87171;
    }
    &:empty {
        display: none;
    }
`;

/* ---------- Profile page ---------- */

export const srOnly = css`
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
`;

export const profileLayout = css`
    display: grid;
    grid-template-columns: 220px minmax(0, 760px);
    align-items: start;
    gap: 2.5rem;
    @media (max-width: 1100px) {
        grid-template-columns: minmax(0, 760px);
        gap: 1.5rem;
    }
`;

export const profileNav = css`
    position: sticky;
    top: 2.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    ol {
        list-style: none;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 0.15rem;
    }
    a {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        padding: 0.45rem 0.75rem;
        border-radius: 8px;
        font-size: 0.85rem;
        color: var(--muted);
        opacity: 0.75;
        transition:
            background 0.15s,
            opacity 0.15s;
        &:hover {
            background: rgba(230, 232, 238, 0.06);
            opacity: 1;
        }
        &[aria-current="true"] {
            background: rgba(230, 232, 238, 0.08);
            color: var(--text);
            opacity: 1;
        }
    }
    @media (max-width: 1100px) {
        position: static;
        ol {
            flex-direction: row;
            overflow-x: auto;
            padding-bottom: 0.25rem;
        }
        a {
            white-space: nowrap;
        }
    }
`;

export const statusDot = css`
    flex-shrink: 0;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 1.5px solid rgba(230, 232, 238, 0.35);
    &[data-status="complete"] {
        border-color: #4ade80;
        background: #4ade80
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%231f1f1f' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 12l5 5 9-10'/%3E%3C/svg%3E")
            center / 9px no-repeat;
    }
    &[data-status="missing"] {
        border-color: #fbbf24;
        background: radial-gradient(circle, #fbbf24 0 3px, transparent 3.5px);
    }
`;

export const completeness = css`
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    padding: 1rem;
    border: 1px solid rgba(230, 232, 238, 0.12);
    border-radius: 12px;
    div:first-child {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        font-size: 0.8rem;
        color: var(--muted);
    }
    strong {
        font-family: "Space Grotesk", sans-serif;
        font-size: 1.4rem;
        color: var(--text);
    }
    [role="progressbar"] {
        --value: 0%;
        height: 6px;
        border-radius: 999px;
        background: rgba(230, 232, 238, 0.12);
        overflow: hidden;
        &::before {
            content: "";
            display: block;
            width: var(--value);
            height: 100%;
            border-radius: inherit;
            background: var(--accent);
            transition: width 0.3s;
        }
    }
    p {
        font-size: 0.75rem;
        line-height: 1.5;
        color: var(--muted);
        opacity: 0.75;
    }
    &[data-missing="true"] p {
        color: #fbbf24;
        opacity: 1;
    }
`;

export const profileSection = css`
    scroll-margin-top: 1.5rem;
`;

export const requiredLegend = css`
    font-size: 0.8rem;
    color: var(--muted);
    opacity: 0.7;
    margin-top: -0.75rem;
    span {
        color: #fbbf24;
    }
`;

export const cardBody = css`
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    padding: 1.25rem 1.5rem 1.5rem;
    border-top: 1px solid rgba(230, 232, 238, 0.08);
`;

export const fieldGrid = css`
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem 1.25rem;
    @media (max-width: 640px) {
        grid-template-columns: minmax(0, 1fr);
    }
`;

export const field = css`
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    min-width: 0;
    > span:first-child {
        font-size: 0.8rem;
        color: var(--muted);
    }
    &:has([required], [data-required]) > span:first-child::after {
        content: " *";
        color: #fbbf24;
    }
    > input,
    > select,
    > textarea {
        width: 100%;
    }
    textarea {
        min-height: 5.5rem;
        resize: vertical;
        line-height: 1.5;
    }
    input[readonly] {
        opacity: 0.6;
        cursor: not-allowed;
    }
    small {
        font-size: 0.75rem;
        color: var(--muted);
        opacity: 0.6;
        line-height: 1.5;
    }
    &[data-span="full"] {
        grid-column: 1 / -1;
    }
`;

export const checkField = css`
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
    color: var(--muted);
    cursor: pointer;
    input {
        accent-color: var(--accent);
        width: 16px;
        height: 16px;
        margin: 0;
    }
`;

export const subheading = css`
    font-size: 0.75rem;
    font-family: "Space Mono", monospace;
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--muted);
    opacity: 0.7;
`;

export const entryList = css`
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    &:not(:has([data-entry]))::before {
        content: attr(data-empty-text);
        padding: 1.25rem;
        border: 1px dashed rgba(230, 232, 238, 0.18);
        border-radius: 12px;
        text-align: center;
        font-size: 0.85rem;
        color: var(--muted);
        opacity: 0.7;
    }
`;

export const entryCard = css`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.1rem 1.1rem 0.9rem;
    border: 1px solid rgba(230, 232, 238, 0.12);
    border-radius: 12px;
    background: rgba(230, 232, 238, 0.02);
    > footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
    }
    &[data-layout="inline"] {
        flex-direction: row;
        align-items: flex-end;
        padding: 0.9rem 1.1rem;
        > div {
            flex: 1;
        }
    }
`;

export const dateRange = css`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
`;

export const removeButton = css`
    font: inherit;
    font-size: 0.8rem;
    padding: 0.35rem 0.6rem;
    margin-left: auto;
    border: none;
    border-radius: 8px;
    background: none;
    color: var(--muted);
    opacity: 0.7;
    cursor: pointer;
    transition:
        background 0.15s,
        color 0.15s,
        opacity 0.15s;
    &:hover,
    &:focus-visible {
        color: #f87171;
        background: rgba(248, 113, 113, 0.1);
        opacity: 1;
        outline: none;
    }
`;

export const addButton = css`
    font: inherit;
    font-size: 0.85rem;
    align-self: flex-start;
    padding: 0.5rem 0.9rem;
    border: 1px dashed rgba(230, 232, 238, 0.3);
    border-radius: 10px;
    background: none;
    color: var(--muted);
    cursor: pointer;
    transition:
        border-color 0.15s,
        color 0.15s;
    &:hover,
    &:focus-visible {
        border-color: var(--accent);
        color: var(--text);
        outline: none;
    }
`;

export const tagInput = css`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.4rem;
    min-height: 2.6rem;
    padding: 0.35rem 0.45rem;
    border: 1px solid rgba(230, 232, 238, 0.25);
    border-radius: 10px;
    cursor: text;
    transition: border-color 0.15s;
    &:focus-within {
        border-color: var(--accent);
    }
    ul {
        display: contents;
        list-style: none;
    }
    li {
        display: inline-flex;
        align-items: center;
        gap: 0.2rem;
        padding: 0.15rem 0.2rem 0.15rem 0.6rem;
        border-radius: 7px;
        background: rgba(59, 130, 246, 0.16);
        color: #bfdbfe;
        font-size: 0.8rem;
        max-width: 100%;
    }
    li span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    li button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        padding: 0;
        border: none;
        border-radius: 5px;
        background: none;
        color: inherit;
        font-size: 1rem;
        line-height: 1;
        cursor: pointer;
        &:hover,
        &:focus-visible {
            background: rgba(59, 130, 246, 0.3);
            outline: none;
        }
    }
    input {
        flex: 1;
        min-width: 9rem;
        padding: 0.3rem 0.35rem;
        border: none;
        background: none;
        color: var(--text);
        font: inherit;
        font-size: 0.9rem;
        outline: none;
    }
`;

export const segmented = css`
    display: inline-flex;
    align-self: flex-start;
    border: 1px solid rgba(230, 232, 238, 0.25);
    border-radius: 10px;
    overflow: hidden;
    label {
        position: relative;
        cursor: pointer;
    }
    label + label {
        border-left: 1px solid rgba(230, 232, 238, 0.25);
    }
    input {
        position: absolute;
        inset: 0;
        margin: 0;
        opacity: 0;
        cursor: pointer;
    }
    span {
        display: block;
        padding: 0.45rem 1.1rem;
        font-size: 0.85rem;
        color: var(--muted);
        transition:
            background 0.15s,
            color 0.15s;
    }
    input:checked + span {
        background: var(--accent);
        color: #fff;
    }
    input:focus-visible + span {
        outline: 2px solid var(--accent);
        outline-offset: -2px;
    }
`;

export const questionRow = css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.75rem 1.5rem;
    > span {
        flex: 1;
        min-width: 14rem;
        font-size: 0.9rem;
    }
    &:has([data-required]) > span::after {
        content: " *";
        color: #fbbf24;
    }
`;

export const dropzone = css`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.35rem;
    padding: 2rem 1.5rem;
    border: 1.5px dashed rgba(230, 232, 238, 0.25);
    border-radius: 12px;
    text-align: center;
    cursor: pointer;
    transition:
        border-color 0.15s,
        background 0.15s;
    &[hidden] {
        display: none;
    }
    svg {
        width: 28px;
        height: 28px;
        color: var(--muted);
        margin-bottom: 0.25rem;
    }
    strong {
        font-weight: 400;
        font-size: 0.95rem;
    }
    small {
        font-size: 0.8rem;
        color: var(--muted);
        opacity: 0.65;
    }
    input {
        position: absolute;
        inset: 0;
        opacity: 0;
        cursor: pointer;
    }
    &:hover,
    &:has(input:focus-visible),
    &[data-dragging="true"] {
        border-color: var(--accent);
        background: rgba(59, 130, 246, 0.06);
    }
    &[aria-busy="true"] {
        opacity: 0.6;
        pointer-events: none;
    }
`;

export const resumeFile = css`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.9rem;
    padding: 0.9rem 1rem;
    border: 1px solid rgba(230, 232, 238, 0.12);
    border-radius: 12px;
    &[hidden] {
        display: none;
    }
    > svg {
        width: 24px;
        height: 24px;
        flex-shrink: 0;
        color: var(--muted);
    }
    > span {
        flex: 1;
        min-width: 10rem;
        display: flex;
        flex-direction: column;
    }
    a {
        font-size: 0.9rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        &:hover {
            color: var(--accent);
        }
    }
    small {
        font-size: 0.75rem;
        color: var(--muted);
        opacity: 0.6;
    }
    > div {
        display: flex;
        gap: 0.25rem;
    }
    label {
        font-size: 0.8rem;
        padding: 0.35rem 0.6rem;
        border-radius: 8px;
        color: var(--muted);
        cursor: pointer;
        &:hover {
            color: var(--text);
            background: rgba(230, 232, 238, 0.08);
        }
    }
    button {
        margin-left: 0;
    }
`;

/* ---------- Feedback page ---------- */

export const formFooter = css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.75rem 1.5rem;
    small {
        font-size: 0.75rem;
        color: var(--muted);
        opacity: 0.6;
    }
    button:disabled {
        opacity: 0.6;
        cursor: progress;
        transform: none;
    }
`;

export const charCount = css`
    align-self: flex-end;
    &[data-near-limit="true"] {
        color: #fbbf24;
        opacity: 1;
    }
`;

export const feedbackItem = css`
    border: 1px solid rgba(230, 232, 238, 0.12);
    border-radius: 12px;
    transition: border-color 0.15s;
    &[open] {
        border-color: rgba(230, 232, 238, 0.22);
    }
    summary {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.9rem 1.1rem;
        cursor: pointer;
        list-style: none;
        border-radius: inherit;
        &::-webkit-details-marker {
            display: none;
        }
        &::before {
            content: "";
            flex-shrink: 0;
            width: 7px;
            height: 7px;
            border-right: 1.5px solid var(--muted);
            border-bottom: 1.5px solid var(--muted);
            transform: rotate(-45deg);
            transition: transform 0.15s;
            opacity: 0.6;
        }
        &:focus-visible {
            outline: 2px solid var(--accent);
            outline-offset: 2px;
        }
    }
    &[open] summary::before {
        transform: rotate(45deg);
    }
    summary > span {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 0.15rem;
    }
    summary strong {
        font-weight: 400;
        font-size: 0.95rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    summary small {
        font-size: 0.75rem;
        color: var(--muted);
        opacity: 0.65;
    }
    > p {
        padding: 0 1.1rem 1rem 2.6rem;
        font-size: 0.875rem;
        color: var(--muted);
        white-space: pre-line;
        overflow-wrap: anywhere;
    }
`;

/* ---------- Coming soon ---------- */

export const soonBadge = css`
    display: inline-flex;
    align-items: center;
    padding: 0.1rem 0.5rem;
    border-radius: 999px;
    border: 1px solid rgba(251, 191, 36, 0.4);
    background: rgba(251, 191, 36, 0.12);
    color: #fbbf24;
    font-size: 0.65rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    white-space: nowrap;
`;

export const sidebarSoon = css`
    margin-left: auto;
    .active & {
        border-color: rgba(255, 255, 255, 0.5);
        background: rgba(255, 255, 255, 0.15);
        color: #fff;
    }
`;

export const comingSoon = css`
    position: relative;
`;

export const comingSoonBanner = css`
    position: sticky;
    top: 1.5rem;
    z-index: 3;
    max-width: 520px;
    margin: 0 auto 1.5rem;
    padding: 1.5rem 1.75rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.6rem;
    text-align: center;
    border: 1px solid rgba(230, 232, 238, 0.18);
    border-radius: 16px;
    background: #2a2a2a;
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
    h2 {
        font-size: 1.3rem;
    }
    p {
        font-size: 0.875rem;
        color: var(--muted);
        opacity: 0.8;
    }
`;

export const comingSoonPreview = css`
    opacity: 0.35;
    filter: grayscale(0.4);
    user-select: none;
    pointer-events: none;
    mask-image: linear-gradient(to bottom, #000 60%, transparent);
`;

/* ---------- Billing page ---------- */

export const notice = css`
    --notice: #60a5fa;
    padding: 0.85rem 1.1rem;
    border: 1px solid color-mix(in srgb, var(--notice) 40%, transparent);
    border-radius: 12px;
    background: color-mix(in srgb, var(--notice) 10%, transparent);
    color: var(--notice);
    font-size: 0.875rem;
    &[data-variant="success"] {
        --notice: #4ade80;
    }
    &[data-variant="warning"] {
        --notice: #fbbf24;
    }
    &[data-variant="danger"] {
        --notice: #f87171;
    }
`;

export const balanceHero = css`
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem 2rem;
    > div {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
    }
    strong {
        font-family: "Space Grotesk", sans-serif;
        font-size: 3rem;
        font-weight: 600;
        line-height: 1;
    }
    small {
        font-size: 0.8rem;
        color: var(--muted);
        opacity: 0.7;
    }
`;

export const statList = css`
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.75rem;
    @media (max-width: 640px) {
        grid-template-columns: minmax(0, 1fr);
    }
    > div {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
        padding: 0.85rem 1rem;
        border: 1px solid rgba(230, 232, 238, 0.1);
        border-radius: 12px;
    }
    dt {
        font-size: 0.75rem;
        color: var(--muted);
        opacity: 0.7;
    }
    dd {
        font-family: "Space Grotesk", sans-serif;
        font-size: 1.25rem;
    }
`;

export const packGrid = css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
    gap: 0.9rem;
`;

export const packCard = css`
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    padding: 1.4rem 1.25rem 1.25rem;
    border: 1px solid rgba(230, 232, 238, 0.15);
    border-radius: 14px;
    h3 {
        font-size: 1.05rem;
    }
    > strong {
        font-family: "Space Grotesk", sans-serif;
        font-size: 2rem;
        font-weight: 600;
        line-height: 1.1;
    }
    small {
        font-size: 0.8rem;
        color: var(--muted);
        opacity: 0.7;
    }
    [data-savings] {
        color: #4ade80;
        opacity: 1;
    }
    button {
        margin-top: auto;
        font-size: 0.875rem;
        padding: 0.6rem 1rem;
    }
    > :last-child {
        margin-top: 0.9rem;
    }
    &[data-popular] {
        border-color: var(--accent);
        background: rgba(59, 130, 246, 0.06);
    }
    &[data-popular]::before {
        content: "Most popular";
        position: absolute;
        top: -0.65rem;
        left: 1.25rem;
        padding: 0.05rem 0.55rem;
        border-radius: 999px;
        background: var(--accent);
        color: #fff;
        font-size: 0.7rem;
    }
`;

export const plainFieldset = css`
    border: none;
    padding: 0;
    margin: 0;
    min-width: 0;
    &:disabled {
        opacity: 0.5;
    }
`;

export const cardBrand = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 3.25rem;
    padding: 0.3rem 0.5rem;
    border: 1px solid rgba(230, 232, 238, 0.25);
    border-radius: 6px;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
`;

export const paymentRow = css`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.9rem;
    > span:has(strong) {
        flex: 1;
        min-width: 10rem;
        display: flex;
        flex-direction: column;
    }
    strong {
        font-weight: 400;
        font-size: 0.95rem;
    }
    small {
        font-size: 0.75rem;
        color: var(--muted);
        opacity: 0.65;
    }
    button {
        font-size: 0.85rem;
        padding: 0.5rem 1rem;
    }
`;
