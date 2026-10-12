import { TokenPayload } from "../lib/types";
import { otpTemplate } from "../templates/utils";
import { verify, sign } from "hono/jwt";

export const TEMP_TOKEN_MAX_AGE = 600; // 10mins in secs
export const ACCESS_TOKEN_MAX_AGE = 1000; // 30mins in secs
export const REFRESH_TOKEN_MAX_AGE = 7_776_000; // 90 days in secs

export function generateOTP(): string {
    const bytes = new Uint8Array(4);
    crypto.getRandomValues(bytes);
    return Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}

export async function sendOTPEmail(
    senderEmail: string,
    email: string,
    otp: string,
    sendFn: (email: {
        to: string;
        from: string;
        subject: string;
        text: string;
        html?: string;
    }) => Promise<any>,
): Promise<null | Error> {
    const htmlBody = fillTemplate(otpTemplate, { OTP_CODE: otp });

    await sendFn({
        from: `ACorp JobBot <${senderEmail}>`,
        to: email,
        subject: "Your OTP Code",
        html: htmlBody,
        text: `Your one time passcode (OTP) is: ${otp}`,
    });

    return Promise.resolve(null);
}

function fillTemplate(template: string, variables: Record<string, string>): string {
    return Object.entries(variables).reduce(
        (html, [key, value]) => html.replaceAll(`{{${key}}`, value),
        template,
    );
}

export function getTempTokenExp() {
    return Math.floor(Date.now() / 1000) + TEMP_TOKEN_MAX_AGE;
}

export function getAccessTokenExp() {
    return Math.floor(Date.now() / 1000) + ACCESS_TOKEN_MAX_AGE;
}

export function getRefreshTokenExp() {
    return Math.floor(Date.now() / 1000) + REFRESH_TOKEN_MAX_AGE;
}

export async function signJWTToken(secret: string, payload: TokenPayload): Promise<string> {
    return await sign(payload, secret);
}

export function getTokenFromHeader(authHeader: string): string {
    const authHeaderPrefix = "Bearer ";
    return authHeader.slice(authHeaderPrefix.length);
}

export async function verifyJWTToken(secret: string, token: string): Promise<TokenPayload | Error> {
    try {
        return (await verify(token, secret, "HS256")) as TokenPayload;
    } catch {
        return new Error("Error verifying token");
    }
}
