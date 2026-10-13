import { HtmlEscapedString } from "hono/utils/html";
import { html } from "hono/html";
import { RootLayout, type LayoutProps } from "./root-layout";
import {
    shell,
    sidebar,
    sidebarBrand,
    sidebarNav,
    sidebarLink,
    sidebarFooter,
    main,
    soonBadge,
    sidebarSoon,
} from "../styles/style";
import { isComingSoon, type Feature } from "@/features";

type Props = LayoutProps & { activePath?: string };

type SidebarLink = {
    href: string;
    label: string;
    icon: HtmlEscapedString | Promise<HtmlEscapedString>;
    feature?: Feature;
};

const links: SidebarLink[] = [
    {
        href: "/jobs",
        label: "Jobs",
        icon: html`<svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <rect x="3" y="7" width="18" height="13" rx="2" />
            <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>`,
    },
    {
        href: "/profile",
        label: "Profile",
        icon: html`<svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
        </svg>`,
    },
    {
        href: "/settings",
        label: "Settings",
        icon: html`<svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <circle cx="12" cy="12" r="3" />
            <path
                d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
            />
        </svg>`,
    },
    {
        href: "/billing",
        label: "Billing",
        feature: "billing",
        icon: html`<svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <path d="M2 10h20" />
        </svg>`,
    },
    {
        href: "/feedback",
        label: "Feedback",
        feature: "feedback",
        icon: html`<svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>`,
    },
];

export default function AuthLayout(props: Props) {
    return RootLayout({
        title: props.title,
        description: props.description,
        scriptPath: props.scriptPath,
        content: html`
            <div class="${shell}">
                <aside class="${sidebar}">
                    <a href="/jobs" class="${sidebarBrand}">JobBot</a>
                    <nav class="${sidebarNav}">
                        ${links.map(
                            (link) => html`
                                <a
                                    href="${link.href}"
                                    class="${sidebarLink}${props.activePath === link.href
                                        ? " active"
                                        : ""}"
                                >
                                    ${link.icon}
                                    <span>${link.label}</span>
                                    ${link.feature && isComingSoon(link.feature)
                                        ? html`<span class="${soonBadge} ${sidebarSoon}"
                                              >Soon</span
                                          >`
                                        : ""}
                                </a>
                            `,
                        )}
                    </nav>
                    <footer class="${sidebarFooter}">
                        &copy; ${new Date().getFullYear()} ACorp
                    </footer>
                </aside>
                <main class="${main}">${props.content}</main>
            </div>
        `,
    });
}
