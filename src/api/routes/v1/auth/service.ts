import { AuthRepository } from "./repository";
import type { Context } from "hono";
import {
    generateOTP,
    sendOTPEmail,
    signJWTToken,
    getTempTokenExp,
    getAccessTokenExp,
    getRefreshTokenExp,
    verifyJWTToken,
} from "@/api/helpers";
import { BaseTokenPayload, TokenPayload } from "@/api/lib/types";
import { AuthContext } from "./middleware";
import { getCookie } from "hono/cookie";

export class AuthService {
    private readonly repo: AuthRepository;

    constructor(authRepository: AuthRepository) {
        this.repo = authRepository;
    }

    public async signin(c: Context<AuthContext>, email: string): Promise<string | Error> {
        // Save user credentials if not exist
        let user = await this.repo.findUserByEmail(email);
        if (!user) user = await this.repo.createUser(email);

        const otp = generateOTP();

        const error = await sendOTPEmail(c.env.OTP_EMAIL, user.email, otp, c.env.SEND_EMAIL.send);
        if (error) throw error;

        // Create temp token payload
        const payload = {
            userID: user.id,
            email: user.email,
            otp: otp,
            exp: getTempTokenExp(),
        } as TokenPayload;

        // Sign temp token payload
        const signResult = await signJWTToken(c.env.JWT_SECRET, payload);

        return signResult;
    }

    public async validateOTP(
        c: Context<AuthContext>,
        otp: string,
    ): Promise<{ accessToken: string; email: string } | Error> {
        const tempToken = getCookie(c, "temp_token");
        if (!tempToken) return new Error("Not Authorized");

        const verifiedPayload = await verifyJWTToken(c.env.JWT_SECRET, tempToken);
        if (verifiedPayload instanceof Error) throw verifiedPayload;

        if (!verifiedPayload.otp) return new Error("OTP not found");
        if (verifiedPayload.otp !== otp) return new Error("Invalid OTP");

        const basePayload = {
            userID: verifiedPayload.userID,
            email: verifiedPayload.email,
        } as BaseTokenPayload;

        const accessPayload = {
            ...basePayload,
            exp: getAccessTokenExp(),
        } as TokenPayload;

        // Generate access token
        const accessToken = await signJWTToken(c.env.JWT_SECRET, accessPayload);

        const refreshPayload = {
            ...basePayload,
            exp: getRefreshTokenExp(),
        };

        // Generate refresh token
        const refreshToken = await signJWTToken(c.env.JWT_SECRET, refreshPayload);

        // Store refresh token in KV store
        await c.env.KV.put(`${verifiedPayload.userID}:refresh_token`, refreshToken);

        return { accessToken, email: verifiedPayload.email };
    }

    public async signout(c: Context<AuthContext>) {
        const accessToken = getCookie(c, "access_token");
        if (!accessToken) throw new Error("Not authorized");

        const verifiedPayload = await verifyJWTToken(c.env.JWT_SECRET, accessToken);
        if (verifiedPayload instanceof Error) throw verifiedPayload;

        await c.env.KV.delete(`${verifiedPayload.userID}:refresh_token`);
    }
}
