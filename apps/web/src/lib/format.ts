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

/** Reads the first message out of TanStack Form / Standard Schema errors. */
export function firstError(errors: unknown[]): string | null {
    for (const error of errors) {
        if (typeof error === "string" && error) return error;
        if (error && typeof error === "object" && "message" in error) {
            return String(error.message);
        }
    }
    return null;
}
