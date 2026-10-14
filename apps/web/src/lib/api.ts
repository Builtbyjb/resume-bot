export class ApiError extends Error {
    readonly status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}

type RequestOptions = {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: unknown;
    /** Skip the global "session expired" handling, e.g. for the sign-in endpoints. */
    skipAuthRedirect?: boolean;
};

let onUnauthorized: (() => void) | null = null;

/** Called whenever the API rejects the session, so the app can send the user back to sign in. */
export function setUnauthorizedHandler(handler: () => void) {
    onUnauthorized = handler;
}

export async function api<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
    const { method = "GET", body, skipAuthRedirect = false } = options;
    const isFormData = body instanceof FormData;

    const response = await fetch(`/api/v1${path}`, {
        method,
        credentials: "same-origin",
        headers: body !== undefined && !isFormData ? { "Content-Type": "application/json" } : {},
        body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
    });

    if (response.status === 401 && !skipAuthRedirect) onUnauthorized?.();

    if (!response.ok) {
        const data = await response.json().catch(() => null);
        const message =
            typeof data?.error === "string" ? data.error : `Request failed: ${response.status}`;
        throw new ApiError(response.status, message);
    }

    return response.json().catch(() => undefined) as Promise<T>;
}
