
export class ApiError extends Error {
    readonly status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}

type RequestOptions = {
    path: string,
    method: "GET" | "POST" | "PUT" | "DELETE";
    contentType?: string,
    body?: unknown;
};

export async function handleFetch(options: RequestOptions): Promise<Response | null> {
    const isFormData = options.body instanceof FormData

    const response = await fetch(`/api/v1${options.path}`, {
        method: options.method,
        credentials: "same-origin",
        headers: {
            "Content-Type": options.contentType === undefined
                ? "application/x-www-form-urlencoded" : options.contentType
        },
        body: options.body === undefined
            ? undefined : isFormData
                ? options.body as FormData : JSON.stringify(options.body)
    });

    if (response.status === 401) throw new ApiError(response.status, "Unauthorized");
    if (response.status === 404) return null
    if (!response.ok) throw new ApiError(response.status, "Request failed");

    return response
}
