import { useState, type ReactNode } from "react";
import {
    createFileRoute,
    Link,
    Outlet,
    redirect,
    useNavigate,
    type LinkProps,
} from "@tanstack/react-router";
import { SoonBadge } from "@/components/ui/coming-soon";
import {
    BillingIcon,
    FeedbackIcon,
    JobsIcon,
    ProfileIcon,
    SettingsIcon,
    SignOutIcon,
} from "@/components/ui/icons";
import { useToast } from "@/components/ui/toast-context";
import { clearUserData, fetchCurrentUser, SESSION_EXPIRED_MESSAGE, signout } from "@/lib/auth";
import { isComingSoon, type Feature } from "@/lib/features";

export const Route = createFileRoute("/_auth")({
    beforeLoad: async () => {
        const user = await fetchCurrentUser();
        if (!user) {
            clearUserData();
            alert(SESSION_EXPIRED_MESSAGE);
            throw redirect({ to: "/signin" });
        }
        return { user };
    },
    component: AuthLayout,
});

type SidebarLink = {
    to: LinkProps["to"];
    label: string;
    icon: ReactNode;
    feature?: Feature;
};

const links: SidebarLink[] = [
    { to: "/jobs", label: "Jobs", icon: <JobsIcon /> },
    { to: "/profile", label: "Profile", icon: <ProfileIcon /> },
    { to: "/settings", label: "Settings", icon: <SettingsIcon /> },
    { to: "/billing", label: "Billing", icon: <BillingIcon />, feature: "billing" },
    { to: "/feedback", label: "Feedback", icon: <FeedbackIcon />, feature: "feedback" },
];

const sidebarLinkClass =
    "group flex items-center gap-3 rounded-[10px] px-[0.9rem] py-[0.6rem] text-[0.95rem] text-muted transition-[background-color,color] duration-150 hover:bg-muted/8 hover:text-text data-[status=active]:bg-accent data-[status=active]:text-white [&_svg]:size-[18px] [&_svg]:shrink-0";

function AuthLayout() {
    return (
        <div className="flex min-h-screen max-[720px]:flex-col">
            <aside className="sticky top-0 flex h-screen w-[240px] shrink-0 flex-col gap-8 border-r border-muted/12 px-4 py-6 max-[720px]:static max-[720px]:h-auto max-[720px]:w-full max-[720px]:gap-4 max-[720px]:border-r-0 max-[720px]:border-b">
                <Link
                    to="/jobs"
                    className="px-2 font-mono text-[1.1rem] font-bold italic"
                >
                    JobBot
                </Link>
                <nav className="flex flex-1 flex-col gap-1 max-[720px]:flex-row max-[720px]:flex-wrap">
                    {links.map((link) => (
                        <Link key={link.label} to={link.to} className={sidebarLinkClass}>
                            {link.icon}
                            <span>{link.label}</span>
                            {link.feature && isComingSoon(link.feature) && (
                                <SoonBadge className="ml-auto group-data-[status=active]:border-white/50 group-data-[status=active]:bg-white/15 group-data-[status=active]:text-white" />
                            )}
                        </Link>
                    ))}
                </nav>
                <SignOutButton />
                <footer className="px-2 text-[0.75rem] text-muted max-[720px]:hidden">
                    &copy; {new Date().getFullYear()} ACorp
                </footer>
            </aside>
            <main className="min-w-0 flex-1 p-10 max-[720px]:p-6">
                <Outlet />
            </main>
        </div>
    );
}

function SignOutButton() {
    const navigate = useNavigate();
    const showToast = useToast();
    const [signingOut, setSigningOut] = useState(false);

    const handleSignOut = async () => {
        setSigningOut(true);
        try {
            await signout();
            await navigate({ to: "/signin" });
        } catch {
            showToast("Couldn't sign you out. Please try again.", "error");
            setSigningOut(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className={`${sidebarLinkClass} -mt-6 w-full cursor-pointer text-left disabled:cursor-progress disabled:opacity-60 max-[720px]:mt-0`}
        >
            <SignOutIcon />
            <span>{signingOut ? "Signing out…" : "Sign out"}</span>
        </button>
    );
}
