/* Settings page */
const settingsForm = document.getElementById("settings-form");

if (settingsForm) {
    const fields = settingsForm.elements;
    const saveBar = settingsForm.querySelector("[data-save-bar]");
    const saveButton = saveBar.querySelector('[type="submit"]');
    const botStatus = settingsForm.querySelector("[data-bot-status]");
    const timezoneButton = settingsForm.querySelector("[data-use-browser-timezone]");
    const dayInputs = [...settingsForm.querySelectorAll('input[name="activeDays"]')];
    const intervalLimits = JSON.parse(fields.intervalUnit.dataset.limits);
    const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const readSettings = () => {
        const data = new FormData(settingsForm);
        return {
            enabled: data.has("enabled"),
            jobsPerRun: Number(data.get("jobsPerRun")),
            interval: { value: Number(data.get("intervalValue")), unit: data.get("intervalUnit") },
            dailyCap: Number(data.get("dailyCap")),
            activeHours: { start: data.get("activeStart"), end: data.get("activeEnd") },
            activeDays: data.getAll("activeDays"),
            timezone: data.get("timezone"),
            reviewBeforeApplying: data.has("reviewBeforeApplying"),
            generateCoverLetters: data.has("generateCoverLetters"),
            notifications: data.get("notifications"),
        };
    };

    let savedSettings = JSON.stringify(readSettings());
    let allowLeave = false;
    const isDirty = () => JSON.stringify(readSettings()) !== savedSettings;

    const updateValidity = () => {
        const limits = intervalLimits[fields.intervalUnit.value];
        fields.intervalValue.min = limits.min;
        fields.intervalValue.max = limits.max;

        const sameHours = fields.activeStart.value === fields.activeEnd.value;
        fields.activeEnd.setCustomValidity(
            sameHours ? "Start and end time can't be the same." : "",
        );

        const anyDay = dayInputs.some((input) => input.checked);
        dayInputs[0].setCustomValidity(anyDay ? "" : "Pick at least one day.");
    };

    const updateTimezoneButton = () => {
        const available = [...fields.timezone.options].some((o) => o.value === browserTimezone);
        timezoneButton.hidden = !available || fields.timezone.value === browserTimezone;
        timezoneButton.textContent = `Use ${browserTimezone.replaceAll("_", " ")}`;
    };

    // Reflects the saved state, not the unsaved toggle position.
    const setBotStatus = (running) => {
        botStatus.dataset.state = running ? "running" : "paused";
        botStatus.textContent = running ? "Running" : "Paused";
    };

    const sync = () => {
        updateValidity();
        updateTimezoneButton();
        saveBar.hidden = !isDirty();
    };

    settingsForm.addEventListener("input", sync);
    settingsForm.addEventListener("change", sync);

    timezoneButton.addEventListener("click", () => {
        fields.timezone.value = browserTimezone;
        sync();
    });

    settingsForm.querySelector("[data-discard]").addEventListener("click", () => {
        settingsForm.reset();
        sync();
    });

    settingsForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        updateValidity();
        if (!settingsForm.reportValidity()) return;

        const settings = readSettings();
        saveButton.disabled = true;
        saveButton.textContent = "Saving…";

        try {
            const response = await fetch("/api/v1/settings", {
                method: "PUT",
                credentials: "same-origin",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
            });
            if (!response.ok) throw new Error(`Saving settings failed: ${response.status}`);

            savedSettings = JSON.stringify(settings);
            commitFormDefaults(settingsForm);
            setBotStatus(settings.enabled);
            sync();
            showToast("Settings saved");
        } catch {
            showToast("Couldn't save your settings. Please try again.", "error");
        } finally {
            saveButton.disabled = false;
            saveButton.textContent = "Save changes";
        }
    });

    window.addEventListener("beforeunload", (e) => {
        if (!allowLeave && isDirty()) e.preventDefault();
    });

    /* Danger zone */
    document.querySelectorAll("[data-open-dialog]").forEach((button) => {
        button.addEventListener("click", () => {
            document.getElementById(button.dataset.openDialog)?.showModal();
        });
    });

    document.querySelectorAll("dialog[data-endpoint]").forEach((dialog) => {
        const form = dialog.querySelector("form");
        const confirmButton = form.querySelector('[type="submit"]');
        const confirmLabel = confirmButton.textContent.trim();
        const confirmInput = form.querySelector("[data-confirm-text]");
        const alertBox = form.querySelector('[role="alert"]');

        confirmInput?.addEventListener("input", () => {
            confirmButton.disabled = confirmInput.value.trim() !== confirmInput.dataset.confirmText;
        });

        form.querySelector("[data-close-dialog]").addEventListener("click", () => dialog.close());

        dialog.addEventListener("close", () => {
            form.reset();
            alertBox.textContent = "";
            confirmButton.textContent = confirmLabel;
            confirmButton.disabled = Boolean(confirmInput);
        });

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (confirmButton.disabled) return;

            confirmButton.disabled = true;
            confirmButton.textContent = "Working…";
            alertBox.textContent = "";

            try {
                const response = await fetch(dialog.dataset.endpoint, {
                    method: dialog.dataset.method,
                    credentials: "same-origin",
                });
                if (!response.ok) throw new Error(`Request failed: ${response.status}`);

                allowLeave = true;
                window.location.href = dialog.dataset.redirect;
            } catch {
                alertBox.textContent = "Something went wrong. Please try again.";
                confirmButton.disabled = false;
                confirmButton.textContent = confirmLabel;
            }
        });
    });

    sync();
}
