import { api, ApiError } from "./api";

export type User = { email: string };

export const SESSION_EXPIRED_MESSAGE =
    "Your session has expired. You have been signed out. Please sign in again to continue.";

const USER_DATA_KEY = "userData";

/** Returns null when there is no valid session. */
export async function fetchCurrentUser(): Promise<User | null> {
    try {
        return await api<User>("/me", { skipAuthRedirect: true });
    } catch (error) {
        if (error instanceof ApiError && error.status === 401) return null;
        throw error;
    }
}

export async function requestOtp(email: string) {
    await api("/signin", { method: "POST", body: { email }, skipAuthRedirect: true });
}

export async function verifyOtp(otp: string) {
    const result = await api<{ userData: User }>("/otp", {
        method: "POST",
        body: { otp },
        skipAuthRedirect: true,
    });
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(result.userData));
    return result.userData;
}

export async function signout() {
    try {
        await api("/signout", { method: "POST", skipAuthRedirect: true });
    } finally {
        clearUserData();
    }
}

export function clearUserData() {
    localStorage.removeItem(USER_DATA_KEY);
}
