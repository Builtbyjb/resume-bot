import { createFileRoute, Link } from "@tanstack/react-router";
import { cardClass, containerClass } from "@/components/layout/container";
import { linkButtonClass } from "@/components/ui/button-styles";

export const Route = createFileRoute("/_guest/")({
    head: () => ({
        meta: [
            { title: "Resume Bot" },
            { name: "description", content: "Automatic resume application using AI" },
        ],
    }),
    component: LandingPage,
});

const features = [
    {
        title: "Smart job search",
        text: "Scans job boards continuously and surfaces roles that match your skills and preferences.",
    },
    {
        title: "Auto-apply",
        text: "Fills in and submits applications for you, so you never miss a good opening.",
    },
    {
        title: "Tailored resumes",
        text: "Generates a resume and cover letter customized to each job description.",
    },
];

function LandingPage() {
    return (
        <>
            <section className="pt-28 pb-20 text-center">
                <div className={containerClass}>
                    <h1 className="mx-auto mb-5 max-w-[14ch] text-[clamp(2.5rem,7vw,4.5rem)]">
                        Land your next job on <em className="font-mono text-accent">autopilot</em>
                    </h1>
                    <p className="mx-auto mb-8 max-w-[52ch] text-[1.15rem] text-muted">
                        An AI assistant that finds jobs, writes tailored resumes and submits
                        applications for you.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <Link to="/signin" className={linkButtonClass({ variant: "primary" })}>
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-16">
                <div className={containerClass}>
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-5">
                        {features.map((feature) => (
                            <div key={feature.title} className={cardClass}>
                                <h3 className="mb-2 text-[1.15rem]">{feature.title}</h3>
                                <p className="text-[0.95rem] text-muted">{feature.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
