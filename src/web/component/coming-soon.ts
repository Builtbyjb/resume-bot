import { html } from "hono/html";
import type { HtmlEscapedString } from "hono/utils/html";
import { isComingSoon, type Feature } from "@/features";
import { comingSoon, comingSoonBanner, comingSoonPreview, soonBadge } from "../styles/style";

type Props = {
    feature: Feature;
    title: string;
    description: string;
    content: HtmlEscapedString | Promise<HtmlEscapedString>;
};

/** Renders `content` as-is when the feature is live, otherwise as a dimmed, inert preview. */
export default function ComingSoon(props: Props) {
    if (!isComingSoon(props.feature)) return props.content;

    return html`
        <div class="${comingSoon}">
            <div class="${comingSoonBanner}" role="note" aria-labelledby="coming-soon-title">
                <span class="${soonBadge}">Coming soon</span>
                <h2 id="coming-soon-title">${props.title}</h2>
                <p>${props.description}</p>
            </div>
            <div class="${comingSoonPreview}" inert aria-hidden="true">${props.content}</div>
        </div>
    `;
}
