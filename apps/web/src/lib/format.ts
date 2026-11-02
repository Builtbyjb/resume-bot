export const mediumDate = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeZone: "UTC",
});

/** Only allow http(s) links, since some URLs come from scraped job boards. */
export function safeUrl(url: string) {
    try {
        const { protocol } = new URL(url);
        return protocol === "http:" || protocol === "https:" ? url : null;
    } catch {
        return null;
    }
}
