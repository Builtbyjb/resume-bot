import { html } from "hono/html";
import type { HtmlEscapedString } from "hono/utils/html";
import AuthLayout from "../layouts/auth-layout";
import {
    settingsLimits,
    type BotSettings,
    type IntervalUnit,
    type NotificationMode,
    type Weekday,
} from "../types/settings";
import {
    btn,
    btnPrimary,
    btnDanger,
    pageHeader,
    settingsLayout,
    settingsCard,
    settingRow,
    settingLabel,
    controlGroup,
    fieldInput,
    switchInput,
    botStatus,
    chipPicker,
    linkButton,
    radioList,
    saveBar,
    confirmDialog,
    toast,
} from "../styles/style";

type Props = {
    settings: BotSettings;
    email: string;
};

type Content = HtmlEscapedString | Promise<HtmlEscapedString>;

const weekdays: { value: Weekday; label: string }[] = [
    { value: "mon", label: "Mon" },
    { value: "tue", label: "Tue" },
    { value: "wed", label: "Wed" },
    { value: "thu", label: "Thu" },
    { value: "fri", label: "Fri" },
    { value: "sat", label: "Sat" },
    { value: "sun", label: "Sun" },
];

const intervalUnits: { value: IntervalUnit; label: string }[] = [
    { value: "minutes", label: "minutes" },
    { value: "hours", label: "hours" },
    { value: "days", label: "days" },
];

const notificationOptions: { value: NotificationMode; label: string; description: string }[] = [
    {
        value: "every",
        label: "Every application",
        description: "An email each time the bot applies to a job.",
    },
    { value: "digest", label: "Daily digest", description: "One summary email per day." },
    {
        value: "failures",
        label: "Failures only",
        description: "Only when the bot can't submit an application.",
    },
    { value: "off", label: "Off", description: "No emails from the bot." },
];

const checked = (value: boolean) => (value ? "checked" : "");
const selected = (value: boolean) => (value ? "selected" : "");

function timezones(current: string) {
    const zones = Intl.supportedValuesOf("timeZone");
    return zones.includes(current) ? zones : [current, ...zones];
}

function Card(props: {
    title: string;
    description: Content | string;
    children: Content;
    danger?: boolean;
}) {
    return html`
        <section class="${settingsCard}" ${props.danger ? html`data-variant="danger"` : ""}>
            <header>
                <h2>${props.title}</h2>
                <p>${props.description}</p>
            </header>
            ${props.children}
        </section>
    `;
}

function FieldRow(props: { id: string; label: string; description: string; control: Content }) {
    return html`
        <div class="${settingRow}">
            <label for="${props.id}" class="${settingLabel}">
                <strong>${props.label}</strong>
                <small>${props.description}</small>
            </label>
            ${props.control}
        </div>
    `;
}

function SwitchRow(props: { name: string; label: string; description: string; checked: boolean }) {
    const id = `setting-${props.name}`;
    return FieldRow({
        id,
        label: props.label,
        description: props.description,
        control: html`<input
            type="checkbox"
            role="switch"
            id="${id}"
            name="${props.name}"
            class="${switchInput}"
            ${checked(props.checked)}
        />`,
    });
}

function SettingsForm({ settings, email }: Props) {
    const intervalRange = settingsLimits.interval[settings.interval.unit];

    return html`
        <form id="settings-form" class="${settingsLayout}" autocomplete="off" novalidate>
            ${Card({
                title: "Bot",
                description: html`<span
                    class="${botStatus}"
                    data-bot-status
                    data-state="${settings.enabled ? "running" : "paused"}"
                    >${settings.enabled ? "Running" : "Paused"}</span
                >`,
                children: SwitchRow({
                    name: "enabled",
                    label: "Run the bot",
                    description:
                        "When paused, the bot stops searching for and applying to jobs. Your settings are kept.",
                    checked: settings.enabled,
                }),
            })}
            ${Card({
                title: "Schedule",
                description: "How often the bot runs and how much it does each time.",
                children: html`
                    ${FieldRow({
                        id: "setting-jobsPerRun",
                        label: "Jobs per run",
                        description: "Maximum applications the bot submits each time it runs.",
                        control: html`<input
                            type="number"
                            id="setting-jobsPerRun"
                            name="jobsPerRun"
                            class="${fieldInput}"
                            value="${settings.jobsPerRun}"
                            min="${settingsLimits.jobsPerRun.min}"
                            max="${settingsLimits.jobsPerRun.max}"
                            step="1"
                            required
                        />`,
                    })}
                    ${FieldRow({
                        id: "setting-intervalValue",
                        label: "Run every",
                        description: `Time between runs. Minimum ${settingsLimits.interval.minutes.min} minutes.`,
                        control: html`<div class="${controlGroup}">
                            <input
                                type="number"
                                id="setting-intervalValue"
                                name="intervalValue"
                                class="${fieldInput}"
                                value="${settings.interval.value}"
                                min="${intervalRange.min}"
                                max="${intervalRange.max}"
                                step="1"
                                required
                            />
                            <select
                                name="intervalUnit"
                                class="${fieldInput}"
                                aria-label="Interval unit"
                                data-limits="${JSON.stringify(settingsLimits.interval)}"
                            >
                                ${intervalUnits.map(
                                    (unit) =>
                                        html`<option
                                            value="${unit.value}"
                                            ${selected(unit.value === settings.interval.unit)}
                                        >
                                            ${unit.label}
                                        </option>`,
                                )}
                            </select>
                        </div>`,
                    })}
                    ${FieldRow({
                        id: "setting-dailyCap",
                        label: "Daily limit",
                        description:
                            "Hard ceiling on applications per day, no matter how often the bot runs.",
                        control: html`<input
                            type="number"
                            id="setting-dailyCap"
                            name="dailyCap"
                            class="${fieldInput}"
                            value="${settings.dailyCap}"
                            min="${settingsLimits.dailyCap.min}"
                            max="${settingsLimits.dailyCap.max}"
                            step="1"
                            required
                        />`,
                    })}
                `,
            })}
            ${Card({
                title: "Active hours",
                description: "The bot only runs inside this window.",
                children: html`
                    ${FieldRow({
                        id: "setting-activeStart",
                        label: "Hours",
                        description: "Overnight windows like 22:00 – 06:00 are supported.",
                        control: html`<div class="${controlGroup}">
                            <input
                                type="time"
                                id="setting-activeStart"
                                name="activeStart"
                                class="${fieldInput}"
                                value="${settings.activeHours.start}"
                                aria-label="Start time"
                                required
                            />
                            <span>to</span>
                            <input
                                type="time"
                                name="activeEnd"
                                class="${fieldInput}"
                                value="${settings.activeHours.end}"
                                aria-label="End time"
                                required
                            />
                        </div>`,
                    })}
                    <div class="${settingRow}">
                        <div class="${settingLabel}" id="setting-days-label">
                            <strong>Days</strong>
                            <small>Pick at least one day.</small>
                        </div>
                        <div
                            class="${chipPicker}"
                            role="group"
                            aria-labelledby="setting-days-label"
                        >
                            ${weekdays.map(
                                (day) => html`
                                    <label>
                                        <input
                                            type="checkbox"
                                            name="activeDays"
                                            value="${day.value}"
                                            ${checked(settings.activeDays.includes(day.value))}
                                        />
                                        <span>${day.label}</span>
                                    </label>
                                `,
                            )}
                        </div>
                    </div>
                    <div class="${settingRow}">
                        <label for="setting-timezone" class="${settingLabel}">
                            <strong>Timezone</strong>
                            <small>
                                Active hours use this timezone.
                                <button
                                    type="button"
                                    class="${linkButton}"
                                    data-use-browser-timezone
                                    hidden
                                ></button>
                            </small>
                        </label>
                        <select
                            id="setting-timezone"
                            name="timezone"
                            class="${fieldInput}"
                            required
                        >
                            ${timezones(settings.timezone).map(
                                (zone) =>
                                    html`<option
                                        value="${zone}"
                                        ${selected(zone === settings.timezone)}
                                    >
                                        ${zone.replaceAll("_", " ")}
                                    </option>`,
                            )}
                        </select>
                    </div>
                `,
            })}
            ${Card({
                title: "Applications",
                description: "Control what the bot does for each job it finds.",
                children: html`
                    ${SwitchRow({
                        name: "reviewBeforeApplying",
                        label: "Review before applying",
                        description:
                            "The bot prepares each application and marks it Queued. Nothing is submitted until you approve it.",
                        checked: settings.reviewBeforeApplying,
                    })}
                    ${SwitchRow({
                        name: "generateCoverLetters",
                        label: "Generate cover letters",
                        description: "Write a tailored cover letter for each application.",
                        checked: settings.generateCoverLetters,
                    })}
                `,
            })}
            ${Card({
                title: "Email notifications",
                description: html`Emails are sent to <strong>${email}</strong>.`,
                children: html`
                    <div class="${radioList}" role="radiogroup" aria-label="Email notifications">
                        ${notificationOptions.map(
                            (option) => html`
                                <label>
                                    <input
                                        type="radio"
                                        name="notifications"
                                        value="${option.value}"
                                        ${checked(option.value === settings.notifications)}
                                    />
                                    <span class="${settingLabel}">
                                        <strong>${option.label}</strong>
                                        <small>${option.description}</small>
                                    </span>
                                </label>
                            `,
                        )}
                    </div>
                `,
            })}

            <div class="${saveBar}" data-save-bar hidden>
                <span>You have unsaved changes</span>
                <div>
                    <button type="button" class="${btn}" data-discard>Discard</button>
                    <button type="submit" class="${btn} ${btnPrimary}">Save changes</button>
                </div>
            </div>
        </form>
    `;
}

function DangerZone() {
    return html`
        ${Card({
            title: "Danger zone",
            description: "These actions are permanent and can't be undone.",
            danger: true,
            children: html`
                <div class="${settingRow}">
                    <div class="${settingLabel}">
                        <strong>Clear job history</strong>
                        <small
                            >Delete every tracked job and all generated resumes and cover
                            letters.</small
                        >
                    </div>
                    <button
                        type="button"
                        class="${btn} ${btnDanger}"
                        data-open-dialog="clear-history-dialog"
                    >
                        Clear history
                    </button>
                </div>
                <div class="${settingRow}">
                    <div class="${settingLabel}">
                        <strong>Delete account</strong>
                        <small>Stop the bot, delete your account and sign out.</small>
                    </div>
                    <button
                        type="button"
                        class="${btn} ${btnDanger}"
                        data-open-dialog="delete-account-dialog"
                    >
                        Delete account
                    </button>
                </div>
            `,
        })}

        <dialog
            id="clear-history-dialog"
            class="${confirmDialog}"
            aria-labelledby="clear-history-title"
            data-endpoint="/api/v1/jobs"
            data-method="DELETE"
            data-redirect="/jobs"
        >
            <form>
                <h2 id="clear-history-title">Clear job history?</h2>
                <p>
                    All tracked jobs, resumes and cover letters will be permanently deleted. Your
                    settings and profile stay as they are.
                </p>
                <p role="alert"></p>
                <footer>
                    <button type="button" class="${btn}" data-close-dialog>Cancel</button>
                    <button type="submit" class="${btn} ${btnDanger}" data-variant="solid">
                        Clear history
                    </button>
                </footer>
            </form>
        </dialog>

        <dialog
            id="delete-account-dialog"
            class="${confirmDialog}"
            aria-labelledby="delete-account-title"
            data-endpoint="/api/v1/profile"
            data-method="DELETE"
            data-redirect="/"
        >
            <form>
                <h2 id="delete-account-title">Delete your account?</h2>
                <p>
                    The bot will stop immediately and your account, job history and documents will
                    be deleted. You'll be signed out.
                </p>
                <label>
                    Type DELETE to confirm
                    <input
                        type="text"
                        class="${fieldInput}"
                        data-confirm-text="DELETE"
                        autocomplete="off"
                        spellcheck="false"
                    />
                </label>
                <p role="alert"></p>
                <footer>
                    <button type="button" class="${btn}" data-close-dialog>Cancel</button>
                    <button type="submit" class="${btn} ${btnDanger}" data-variant="solid" disabled>
                        Delete account
                    </button>
                </footer>
            </form>
        </dialog>
    `;
}

export default function SettingsPage(props: Props) {
    return AuthLayout({
        title: "Settings - Job Bot",
        description: "Control how the bot searches for and applies to jobs",
        activePath: "/settings",
        scriptPath: "/settings.js",
        content: html`
            <header class="${pageHeader}">
                <h1>Settings</h1>
            </header>
            <div class="${settingsLayout}">${SettingsForm(props)} ${DangerZone()}</div>
            <div class="${toast}" role="status" aria-live="polite" data-toast></div>
        `,
    });
}
