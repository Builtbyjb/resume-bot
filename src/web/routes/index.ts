import { Hono } from "hono";
import LandingPage from "../pages/landing";
import SigninPage from "../pages/signin";
import JobsPage from "../pages/jobs";
import { mockJobs } from "../data/mock-jobs";
import { mockSettings } from "../data/mock-settings";
import { mockProfile } from "../data/mock-profile";
import { mockFeedback } from "../data/mock-feedback";
import FeedbackPage from "../pages/feedback";
import BillingPage, { type CheckoutResult } from "../pages/billing";
import { mockBilling } from "../data/mock-billing";
import { authMiddleware } from "@/api/middleware/auth";
import ProfilePage from "../pages/profile";
import SettingsPage from "../pages/settings";

const webRoutes = new Hono();

const authMiddlewareOptions = {
    redirectTo: "/signin",
    alert: "Your session has expired. You have been signed out. Please sign in again to continue.",
};

webRoutes.get("/", (c) => {
    return c.html(LandingPage());
});

webRoutes.get("/signin", (c) => {
    return c.html(SigninPage());
});

webRoutes.get("/jobs", authMiddleware(authMiddlewareOptions), (c) => {
    // TODO: replace with the user's jobs from D1 once the jobs table exists
    return c.html(JobsPage({ jobs: mockJobs }));
});

webRoutes.get("/profile", authMiddleware(authMiddlewareOptions), (c) => {
    // TODO: replace with the user's profile from D1 once the profile tables exist
    return c.html(ProfilePage({ profile: mockProfile, email: c.get("jwtPayload").email }));
});

webRoutes.get("/settings", authMiddleware(authMiddlewareOptions), (c) => {
    // TODO: replace with the user's settings from D1 once the settings table exists
    return c.html(SettingsPage({ settings: mockSettings, email: c.get("jwtPayload").email }));
});

// Stripe Checkout redirects back here with ?checkout=success or ?checkout=cancelled.
webRoutes.get("/billing", authMiddleware(authMiddlewareOptions), (c) => {
    const result = c.req.query("checkout");
    const checkout: CheckoutResult | undefined =
        result === "success" || result === "cancelled" ? result : undefined;
    // TODO: replace with the user's balance from D1 and payment method from Stripe
    return c.html(BillingPage({ billing: mockBilling, checkout }));
});

// `?type=issue` preselects "Report an issue", so other pages can link straight to a bug report.
webRoutes.get("/feedback", authMiddleware(authMiddlewareOptions), (c) => {
    const initialType = c.req.query("type") === "issue" ? "issue" : "suggestion";
    // TODO: replace with the user's feedback from D1 once the feedback table exists
    return c.html(FeedbackPage({ feedback: mockFeedback, initialType }));
});

export default webRoutes;
