import { useState, type ReactNode } from "react";
import { revalidateLogic, useStore } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import {
    botSettingsSchema,
    settingsLimits,
    type BotSettings,
    type IntervalUnit,
    type NotificationMode,
    type Weekday,
} from "@resume-bot/shared";
import { Button } from "@/components/ui/button";
import { Card, PageHeader, SettingLabel, SettingRow, stackClass } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { StateIndicator } from "@/components/ui/status-badge";
import { useToast } from "@/components/ui/toast-context";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import { api } from "@/lib/api";
import { clearUserData } from "@/lib/auth";
import { useAppForm } from "@/lib/form";

type Props = {
    settings: BotSettings;
    email: string;
};

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

const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

function timezoneOptions(current: string) {
    const zones = Intl.supportedValuesOf("timeZone");
    return (zones.includes(current) ? zones : [current, ...zones]).map((zone) => ({
        value: zone,
        label: zone.replaceAll("_", " "),
    }));
}

const controlGroupClass = "flex flex-wrap items-center gap-2 text-[0.85rem] text-muted";

/** A setting control plus its validation message. */
function Control({ children }: { children: ReactNode }) {
    return <div className="flex flex-col gap-1">{children}</div>;
}

export function SettingsPage({ settings, email }: Props) {
    const showToast = useToast();
    const [saved, setSaved] = useState(settings);
    const [timezones] = useState(() => timezoneOptions(settings.timezone));

    const form = useAppForm({
        defaultValues: saved,
        validationLogic: revalidateLogic(),
        validators: { onDynamic: botSettingsSchema },
        onSubmitInvalid: () =>
            requestAnimationFrame(() =>
                document.querySelector<HTMLElement>("#settings-form [aria-invalid='true']")?.focus(),
            ),
        onSubmit: async ({ value, formApi }) => {
            try {
                await api("/settings", { method: "PUT", body: value });
                setSaved(value);
                formApi.reset(value);
                showToast("Settings saved");
            } catch {
                showToast("Couldn't save your settings. Please try again.", "error");
            }
        },
    });

    const values = useStore(form.store, (state) => state.values);
    const dirty = JSON.stringify(values) !== JSON.stringify(saved);
    const allowLeave = useUnsavedChanges(dirty);
    const intervalRange = settingsLimits.interval[values.interval.unit];

    return (
        <>
            <PageHeader title="Settings" />
            <div className={stackClass}>
                <form
                    id="settings-form"
                    className={stackClass}
                    autoComplete="off"
                    noValidate
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        void form.handleSubmit();
                    }}
                >
                    <Card
                        title="Bot"
                        titleId="settings-bot-title"
                        description={
                            <StateIndicator on={saved.enabled}>
                                {saved.enabled ? "Running" : "Paused"}
                            </StateIndicator>
                        }
                    >
                        <form.AppField name="enabled">
                            {(field) => (
                                <SettingRow>
                                    <SettingLabel
                                        as="label"
                                        htmlFor="setting-enabled"
                                        title="Run the bot"
                                        description="When paused, the bot stops searching for and applying to jobs. Your settings are kept."
                                    />
                                    <field.Switch id="setting-enabled" />
                                </SettingRow>
                            )}
                        </form.AppField>
                    </Card>

                    <Card
                        title="Schedule"
                        titleId="settings-schedule-title"
                        description="How often the bot runs and how much it does each time."
                    >
                        <SettingRow>
                            <SettingLabel
                                as="label"
                                htmlFor="setting-jobsPerRun"
                                title="Jobs per run"
                                description="Maximum applications the bot submits each time it runs."
                            />
                            <form.AppField name="jobsPerRun">
                                {(field) => (
                                    <Control>
                                        <field.NumberInput
                                            id="setting-jobsPerRun"
                                            min={settingsLimits.jobsPerRun.min}
                                            max={settingsLimits.jobsPerRun.max}
                                            step={1}
                                            required
                                        />
                                        <field.FieldError />
                                    </Control>
                                )}
                            </form.AppField>
                        </SettingRow>
                        <SettingRow>
                            <SettingLabel
                                as="label"
                                htmlFor="setting-intervalValue"
                                title="Run every"
                                description={`Time between runs. Minimum ${settingsLimits.interval.minutes.min} minutes.`}
                            />
                            <Control>
                                <div className={controlGroupClass}>
                                    <form.AppField name="interval.value">
                                        {(field) => (
                                            <field.NumberInput
                                                id="setting-intervalValue"
                                                min={intervalRange.min}
                                                max={intervalRange.max}
                                                step={1}
                                                required
                                            />
                                        )}
                                    </form.AppField>
                                    <form.AppField name="interval.unit">
                                        {(field) => (
                                            <field.Select
                                                aria-label="Interval unit"
                                                options={intervalUnits}
                                            />
                                        )}
                                    </form.AppField>
                                </div>
                                <form.AppField name="interval.value">
                                    {(field) => <field.FieldError />}
                                </form.AppField>
                            </Control>
                        </SettingRow>
                        <SettingRow>
                            <SettingLabel
                                as="label"
                                htmlFor="setting-dailyCap"
                                title="Daily limit"
                                description="Hard ceiling on applications per day, no matter how often the bot runs."
                            />
                            <form.AppField name="dailyCap">
                                {(field) => (
                                    <Control>
                                        <field.NumberInput
                                            id="setting-dailyCap"
                                            min={settingsLimits.dailyCap.min}
                                            max={settingsLimits.dailyCap.max}
                                            step={1}
                                            required
                                        />
                                        <field.FieldError />
                                    </Control>
                                )}
                            </form.AppField>
                        </SettingRow>
                    </Card>

                    <Card
                        title="Active hours"
                        titleId="settings-hours-title"
                        description="The bot only runs inside this window."
                    >
                        <SettingRow>
                            <SettingLabel
                                as="label"
                                htmlFor="setting-activeStart"
                                title="Hours"
                                description="Overnight windows like 22:00 – 06:00 are supported."
                            />
                            <Control>
                                <div className={controlGroupClass}>
                                    <form.AppField name="activeHours.start">
                                        {(field) => (
                                            <field.TextInput
                                                type="time"
                                                id="setting-activeStart"
                                                aria-label="Start time"
                                                required
                                            />
                                        )}
                                    </form.AppField>
                                    <span>to</span>
                                    <form.AppField name="activeHours.end">
                                        {(field) => (
                                            <field.TextInput
                                                type="time"
                                                aria-label="End time"
                                                required
                                            />
                                        )}
                                    </form.AppField>
                                </div>
                                <form.AppField name="activeHours.start">
                                    {(field) => <field.FieldError />}
                                </form.AppField>
                                <form.AppField name="activeHours.end">
                                    {(field) => <field.FieldError />}
                                </form.AppField>
                            </Control>
                        </SettingRow>
                        <SettingRow>
                            <SettingLabel
                                id="setting-days-label"
                                title="Days"
                                description="Pick at least one day."
                            />
                            <form.AppField name="activeDays">
                                {(field) => (
                                    <Control>
                                        <field.ChipGroup
                                            labelId="setting-days-label"
                                            options={weekdays}
                                        />
                                        <field.FieldError />
                                    </Control>
                                )}
                            </form.AppField>
                        </SettingRow>
                        <form.AppField name="timezone">
                            {(field) => (
                                <SettingRow>
                                    <SettingLabel
                                        as="label"
                                        htmlFor="setting-timezone"
                                        title="Timezone"
                                        description={
                                            <>
                                                Active hours use this timezone.{" "}
                                                <button
                                                    type="button"
                                                    hidden={
                                                        field.state.value === browserTimezone ||
                                                        !timezones.some(
                                                            (zone) => zone.value === browserTimezone,
                                                        )
                                                    }
                                                    onClick={() => field.handleChange(browserTimezone)}
                                                    className="cursor-pointer bg-transparent p-0 text-[0.8rem] text-accent hover:underline"
                                                >
                                                    Use {browserTimezone.replaceAll("_", " ")}
                                                </button>
                                            </>
                                        }
                                    />
                                    <Control>
                                        <field.Select
                                            id="setting-timezone"
                                            options={timezones}
                                            required
                                        />
                                        <field.FieldError />
                                    </Control>
                                </SettingRow>
                            )}
                        </form.AppField>
                    </Card>

                    <Card
                        title="Applications"
                        titleId="settings-applications-title"
                        description="Control what the bot does for each job it finds."
                    >
                        <form.AppField name="reviewBeforeApplying">
                            {(field) => (
                                <SettingRow>
                                    <SettingLabel
                                        as="label"
                                        htmlFor="setting-reviewBeforeApplying"
                                        title="Review before applying"
                                        description="The bot prepares each application and marks it Queued. Nothing is submitted until you approve it."
                                    />
                                    <field.Switch id="setting-reviewBeforeApplying" />
                                </SettingRow>
                            )}
                        </form.AppField>
                        <form.AppField name="generateCoverLetters">
                            {(field) => (
                                <SettingRow>
                                    <SettingLabel
                                        as="label"
                                        htmlFor="setting-generateCoverLetters"
                                        title="Generate cover letters"
                                        description="Write a tailored cover letter for each application."
                                    />
                                    <field.Switch id="setting-generateCoverLetters" />
                                </SettingRow>
                            )}
                        </form.AppField>
                    </Card>

                    <Card
                        title="Email notifications"
                        titleId="settings-notifications-title"
                        description={
                            <>
                                Emails are sent to <strong>{email}</strong>.
                            </>
                        }
                    >
                        <form.AppField name="notifications">
                            {(field) => (
                                <field.RadioCards
                                    ariaLabel="Email notifications"
                                    options={notificationOptions}
                                />
                            )}
                        </form.AppField>
                    </Card>

                    <form.AppForm>
                        <form.SaveBar dirty={dirty} onDiscard={() => form.reset()} />
                    </form.AppForm>
                </form>

                <DangerZone allowLeave={allowLeave} />
            </div>
        </>
    );
}

type DangerDialog = "clear-history" | "delete-account";

function DangerZone({ allowLeave }: { allowLeave: () => void }) {
    const navigate = useNavigate();
    const [openDialog, setOpenDialog] = useState<DangerDialog | null>(null);

    const clearHistory = async () => {
        await api("/jobs", { method: "DELETE" });
        allowLeave();
        await navigate({ to: "/jobs" });
    };

    const deleteAccount = async () => {
        await api("/profile", { method: "DELETE" });
        clearUserData();
        allowLeave();
        await navigate({ to: "/" });
    };

    return (
        <>
            <Card
                danger
                title="Danger zone"
                titleId="settings-danger-title"
                description="These actions are permanent and can't be undone."
            >
                <SettingRow>
                    <SettingLabel
                        title="Clear job history"
                        description="Delete every tracked job and all generated resumes and cover letters."
                    />
                    <Button
                        variant="danger"
                        size="compact"
                        onClick={() => setOpenDialog("clear-history")}
                    >
                        Clear history
                    </Button>
                </SettingRow>
                <SettingRow>
                    <SettingLabel
                        title="Delete account"
                        description="Stop the bot, delete your account and sign out."
                    />
                    <Button
                        variant="danger"
                        size="compact"
                        onClick={() => setOpenDialog("delete-account")}
                    >
                        Delete account
                    </Button>
                </SettingRow>
            </Card>

            <ConfirmDialog
                open={openDialog === "clear-history"}
                onClose={() => setOpenDialog(null)}
                titleId="clear-history-title"
                title="Clear job history?"
                description="All tracked jobs, resumes and cover letters will be permanently deleted. Your settings and profile stay as they are."
                confirmLabel="Clear history"
                onConfirm={clearHistory}
            />

            <ConfirmDialog
                open={openDialog === "delete-account"}
                onClose={() => setOpenDialog(null)}
                titleId="delete-account-title"
                title="Delete your account?"
                description="The bot will stop immediately and your account, job history and documents will be deleted. You'll be signed out."
                confirmLabel="Delete account"
                confirmText="DELETE"
                onConfirm={deleteAccount}
            />
        </>
    );
}
