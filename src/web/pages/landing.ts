import { html } from "hono/html";
import Layout from "./layout";
import {
    hero,
    container,
    actions,
    btn,
    btnPrimary,
    section,
    grid,
    card,
} from "../styles/style";

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
        text: "Generates a resume and cover letter customised to each job description.",
    },
];

export default function LandingPage() {
    return Layout({
        title: "Resume Bot",
        description: "Automatic resume application using AI",
        content: html`
            <section class="${hero}">
                <div class="${container}">
                    <h1>Land your next job on <em>autopilot</em></h1>
                    <p>
                        An AI assistant that finds jobs, writes tailored resumes
                        and submits applications for you.
                    </p>
                    <div class="${actions}">
                        <a href="/login" class="${btn} ${btnPrimary}">
                            Sign In
                        </a>
                    </div>
                </div>
            </section>

            <section class="${section}">
                <div class="${container}">
                    <div class="${grid}">
                        ${features.map(
                            (f) => html`
                                <div class="${card}">
                                    <h3>${f.title}</h3>
                                    <p>${f.text}</p>
                                </div>
                            `,
                        )}
                    </div>
                </div>
            </section>
        `,
    });
}
