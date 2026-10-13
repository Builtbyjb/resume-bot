/**
 * Feature flags. Flip a feature to "live" and redeploy to launch it.
 * - "coming_soon": sidebar shows a "Soon" badge and the page renders as a non-interactive preview.
 */
export type FeatureStatus = "live" | "coming_soon";

export const features = {
    feedback: "coming_soon",
    billing: "coming_soon",
} satisfies Record<string, FeatureStatus>;

export type Feature = keyof typeof features;

export const isComingSoon = (feature: Feature) =>
    (features[feature] as FeatureStatus) === "coming_soon";
