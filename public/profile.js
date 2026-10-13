/* Profile page */
const profileForm = document.getElementById("profile-form");

if (profileForm) {
    const navLinks = new Map(
        [...document.querySelectorAll("[data-nav-link]")].map((link) => [
            link.dataset.navLink,
            link,
        ]),
    );
    const meter = document.querySelector("[data-completeness]");
    const statusLabels = {
        complete: "complete",
        missing: "missing required info",
        empty: "not started",
    };

    // Sections inside the form are replaced on "Discard", so always query them fresh.
    const getSections = () => [...document.querySelectorAll("[data-profile-section]")];
    const field = (root, name) => root.querySelector(`[data-field="${name}"]`);
    const fieldValue = (root, name) => field(root, name)?.value.trim() ?? "";
    const orNull = (value) => value || null;

    const readEntries = (list, read) =>
        [...profileForm.querySelectorAll(`[data-list="${list}"] > [data-entry]`)].map((entry) => ({
            id: entry.dataset.entryId,
            ...read(entry),
        }));

    const readProfile = () => {
        const data = new FormData(profileForm);
        const text = (name) => String(data.get(name) ?? "").trim();
        const yesNo = (name) => ({ yes: true, no: false })[data.get(name)] ?? null;

        return {
            firstName: text("firstName"),
            lastName: text("lastName"),
            phone: text("phone"),
            location: text("location"),
            links: {
                linkedin: text("linkedin"),
                github: text("github"),
                portfolio: text("portfolio"),
            },
            headline: text("headline"),
            summary: text("summary"),
            experience: readEntries("experience", (entry) => {
                const current = field(entry, "current").checked;
                return {
                    title: fieldValue(entry, "title"),
                    company: fieldValue(entry, "company"),
                    location: fieldValue(entry, "location"),
                    startDate: fieldValue(entry, "startDate"),
                    endDate: current ? null : orNull(fieldValue(entry, "endDate")),
                    current,
                    achievements: fieldValue(entry, "achievements")
                        .split("\n")
                        .map((line) => line.trim())
                        .filter(Boolean),
                };
            }),
            education: readEntries("education", (entry) => ({
                school: fieldValue(entry, "school"),
                degree: fieldValue(entry, "degree"),
                field: fieldValue(entry, "field"),
                startDate: orNull(fieldValue(entry, "startDate")),
                endDate: orNull(fieldValue(entry, "endDate")),
                notes: fieldValue(entry, "notes"),
            })),
            skills: data.getAll("skills"),
            languages: readEntries("languages", (entry) => ({
                name: fieldValue(entry, "name"),
                proficiency: fieldValue(entry, "proficiency"),
            })),
            projects: readEntries("projects", (entry) => ({
                name: fieldValue(entry, "name"),
                url: fieldValue(entry, "url"),
                description: fieldValue(entry, "description"),
            })),
            certifications: readEntries("certifications", (entry) => ({
                name: fieldValue(entry, "name"),
                issuer: fieldValue(entry, "issuer"),
                issuedOn: orNull(fieldValue(entry, "issuedOn")),
                url: fieldValue(entry, "url"),
            })),
            preferences: {
                titles: data.getAll("titles"),
                locations: data.getAll("locations"),
                workModes: data.getAll("workModes"),
                minSalary: {
                    amount: text("minSalaryAmount") ? Number(text("minSalaryAmount")) : null,
                    currency: text("minSalaryCurrency"),
                    period: text("minSalaryPeriod"),
                },
                excludedCompanies: data.getAll("excludedCompanies"),
                jobBoards: data.getAll("jobBoards"),
            },
            application: {
                workAuthorized: yesNo("workAuthorized"),
                needsSponsorship: yesNo("needsSponsorship"),
                willingToRelocate: yesNo("willingToRelocate"),
                noticePeriod: text("noticePeriod"),
                earliestStart: orNull(text("earliestStart")),
            },
            writing: { tone: text("tone"), instructions: text("instructions") },
        };
    };

    let savedProfile = JSON.stringify(readProfile());
    let savedMarkup = profileForm.innerHTML;
    const isDirty = () => JSON.stringify(readProfile()) !== savedProfile;

    /* Completeness: driven entirely by `data-required` markers in the markup */
    const isFilled = (el) => {
        if (el.matches("[data-tags]")) return Boolean(el.querySelector('input[type="hidden"]'));
        if (el.matches('[role="group"], [role="radiogroup"]')) {
            return Boolean(el.querySelector("input:checked"));
        }
        return el.value.trim() !== "";
    };

    const hasContent = (section) =>
        Boolean(
            section.querySelector(
                '[data-entry], [data-tags] input[type="hidden"], [data-resume-file]:not([hidden])',
            ),
        ) ||
        [
            ...section.querySelectorAll(
                "input:not([type=hidden], [type=file], [readonly]), textarea",
            ),
        ].some((el) =>
            el.type === "checkbox" || el.type === "radio" ? el.checked : el.value.trim(),
        );

    const sectionStatus = (section) => {
        const required = [...section.querySelectorAll("[data-required]")];
        if (required.length) return required.every(isFilled) ? "complete" : "missing";
        return hasContent(section) ? "complete" : "empty";
    };

    const updateCompleteness = () => {
        const sections = getSections();
        const missing = [];
        let complete = 0;

        for (const section of sections) {
            const status = sectionStatus(section);
            if (status === "complete") complete += 1;
            if (status === "missing") missing.push(section.dataset.title);

            const link = navLinks.get(section.id);
            link.querySelector("[data-status]").dataset.status = status;
            link.querySelector("[data-status-label]").textContent = `(${statusLabels[status]})`;
        }

        const percent = Math.round((complete / sections.length) * 100);
        const bar = meter.querySelector("[data-completeness-bar]");
        bar.style.setProperty("--value", `${percent}%`);
        bar.setAttribute("aria-valuenow", String(percent));
        meter.querySelector("[data-completeness-value]").textContent = `${percent}%`;
        meter.dataset.missing = String(missing.length > 0);
        meter.querySelector("[data-completeness-text]").textContent = missing.length
            ? `Required info missing in: ${missing.join(", ")}.`
            : percent === 100
              ? "Your profile is complete."
              : "All required info is filled in. Optional sections make applications stronger.";
    };

    const updateValidity = () => {
        for (const entry of profileForm.querySelectorAll("[data-entry]")) {
            const start = field(entry, "startDate");
            const end = field(entry, "endDate");
            if (!start || !end) continue;
            const backwards = !end.disabled && start.value && end.value && end.value < start.value;
            end.setCustomValidity(backwards ? "End date can't be before the start date." : "");
        }
    };

    const sync = () => {
        updateValidity();
        updateCompleteness();
        profileForm.querySelector("[data-save-bar]").hidden = !isDirty();
    };

    /* Active section in the nav */
    const setActiveLink = (id) => {
        navLinks.forEach((link, key) => {
            if (key === id) link.setAttribute("aria-current", "true");
            else link.removeAttribute("aria-current");
        });
    };

    const sectionObserver = new IntersectionObserver(
        (entries) => {
            const visible = entries.find((entry) => entry.isIntersecting);
            if (visible) setActiveLink(visible.target.id);
        },
        { rootMargin: "-20% 0px -70% 0px" },
    );

    const observeSections = () => {
        sectionObserver.disconnect();
        getSections().forEach((section) => sectionObserver.observe(section));
    };

    /* Tag inputs */
    const addTags = (container, raw) => {
        const list = container.querySelector("[data-tag-list]");
        const existing = new Set(
            [...list.querySelectorAll("input")].map((i) => i.value.toLowerCase()),
        );

        for (const part of raw.split(",")) {
            const value = part.trim().slice(0, 60);
            if (!value || existing.has(value.toLowerCase())) continue;
            existing.add(value.toLowerCase());

            const input = document.createElement("input");
            input.type = "hidden";
            input.name = container.dataset.tags;
            input.value = value;

            const label = document.createElement("span");
            label.textContent = value;

            const remove = document.createElement("button");
            remove.type = "button";
            remove.textContent = "×";
            remove.dataset.removeTag = "";
            remove.setAttribute("aria-label", `Remove ${value}`);

            const item = document.createElement("li");
            item.append(input, label, remove);
            list.append(item);
        }
    };

    const commitTagEntry = (input) => {
        if (!input.value.trim()) return;
        addTags(input.closest("[data-tags]"), input.value);
        input.value = "";
    };

    profileForm.addEventListener("keydown", (e) => {
        if (!e.target.matches("[data-tag-entry]") || e.isComposing) return;
        const input = e.target;

        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            commitTagEntry(input);
            sync();
        } else if (e.key === "Backspace" && input.value === "") {
            input.closest("[data-tags]").querySelector("[data-tag-list] li:last-child")?.remove();
            sync();
        }
    });

    profileForm.addEventListener("focusout", (e) => {
        if (e.target.matches("[data-tag-entry]") && e.target.value.trim()) {
            commitTagEntry(e.target);
            sync();
        }
    });

    profileForm.addEventListener("input", (e) => {
        // Pasting "React, Vue, Svelte" adds every complete item and keeps the last one editable.
        if (e.target.matches("[data-tag-entry]") && e.target.value.includes(",")) {
            const parts = e.target.value.split(",");
            const rest = parts.pop();
            addTags(e.target.closest("[data-tags]"), parts.join(","));
            e.target.value = rest.trimStart();
        }
        sync();
    });

    profileForm.addEventListener("change", (e) => {
        if (e.target.matches('[data-field="current"]')) {
            field(e.target.closest("[data-entry]"), "endDate").disabled = e.target.checked;
        }
        sync();
    });

    /* Buttons: add/remove entries, remove tags, discard */
    profileForm.addEventListener("click", (e) => {
        const addEntry = e.target.closest("[data-add-entry]");
        if (addEntry) {
            const name = addEntry.dataset.addEntry;
            const list = profileForm.querySelector(`[data-list="${name}"]`);
            const template = profileForm.querySelector(`template[data-template="${name}"]`);
            list.append(template.content.cloneNode(true));

            const entry = list.lastElementChild;
            entry.dataset.entryId = crypto.randomUUID();
            entry.querySelector("input, select, textarea")?.focus();
            sync();
            return;
        }

        const removeEntry = e.target.closest("[data-remove-entry]");
        if (removeEntry) {
            const entry = removeEntry.closest("[data-entry]");
            const listName = entry.parentElement.dataset.list;
            entry.remove();
            profileForm.querySelector(`[data-add-entry="${listName}"]`)?.focus();
            sync();
            return;
        }

        const removeTag = e.target.closest("[data-remove-tag]");
        if (removeTag) {
            const container = removeTag.closest("[data-tags]");
            removeTag.closest("li").remove();
            container.querySelector("[data-tag-entry]").focus();
            sync();
            return;
        }

        if (e.target.closest("[data-discard]")) {
            profileForm.innerHTML = savedMarkup;
            observeSections();
            sync();
            return;
        }

        // Clicking the empty space inside a tag input focuses its text field.
        if (e.target.matches("[data-tags]")) e.target.querySelector("[data-tag-entry]").focus();
    });

    /* Save */
    profileForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        profileForm.querySelectorAll("[data-tag-entry]").forEach(commitTagEntry);
        updateValidity();
        if (!profileForm.reportValidity()) return;

        const saveButton = profileForm.querySelector('[data-save-bar] [type="submit"]');
        const profile = readProfile();
        saveButton.disabled = true;
        saveButton.textContent = "Saving…";

        let saved = false;
        try {
            const response = await fetch("/api/v1/profile", {
                method: "PUT",
                credentials: "same-origin",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(profile),
            });
            if (!response.ok) throw new Error(`Saving profile failed: ${response.status}`);
            saved = true;
        } catch {
            showToast("Couldn't save your profile. Please try again.", "error");
        }

        saveButton.disabled = false;
        saveButton.textContent = "Save changes";
        if (!saved) return;

        savedProfile = JSON.stringify(profile);
        commitFormDefaults(profileForm);
        sync();
        savedMarkup = profileForm.innerHTML;
        showToast("Profile saved");
    });

    window.addEventListener("beforeunload", (e) => {
        if (isDirty()) e.preventDefault();
    });

    /* Resume upload (outside the form: uploads immediately, not via Save) */
    const resumeSection = document.getElementById("resume");
    const resumeInput = resumeSection.querySelector("[data-resume-input]");
    const resumeFile = resumeSection.querySelector("[data-resume-file]");
    const resumeDropzone = resumeSection.querySelector("[data-resume-dropzone]");
    const MAX_RESUME_BYTES = 5 * 1024 * 1024;

    const showResume = (resume) => {
        resumeFile.hidden = !resume;
        resumeDropzone.hidden = Boolean(resume);
        if (resume) {
            const link = resumeFile.querySelector("[data-resume-link]");
            link.href = resume.url;
            link.download = resume.fileName;
            link.textContent = resume.fileName;
            const uploaded = new Date(resume.uploadedAt).toLocaleDateString(undefined, {
                dateStyle: "medium",
            });
            resumeFile.querySelector("[data-resume-date]").textContent = `Uploaded ${uploaded}`;
        }
        updateCompleteness();
    };

    resumeInput.addEventListener("change", async () => {
        const file = resumeInput.files[0];
        resumeInput.value = "";
        if (!file) return;

        const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
        if (!isPdf) return showToast("Please choose a PDF file.", "error");
        if (file.size > MAX_RESUME_BYTES)
            return showToast("That file is larger than 5 MB.", "error");

        const body = new FormData();
        body.append("resume", file);
        resumeDropzone.setAttribute("aria-busy", "true");
        showToast("Uploading resume…");

        try {
            const response = await fetch("/api/v1/profile/resume", {
                method: "POST",
                credentials: "same-origin",
                body,
            });
            if (!response.ok) throw new Error(`Upload failed: ${response.status}`);
            showResume(await response.json());
            showToast("Resume uploaded");
        } catch {
            showToast("Couldn't upload your resume. Please try again.", "error");
        } finally {
            resumeDropzone.removeAttribute("aria-busy");
        }
    });

    resumeInput.addEventListener("dragenter", () => (resumeDropzone.dataset.dragging = "true"));
    for (const type of ["dragleave", "drop"]) {
        resumeInput.addEventListener(type, () => delete resumeDropzone.dataset.dragging);
    }

    resumeSection.querySelector("[data-resume-remove]").addEventListener("click", async () => {
        if (!confirm("Remove your uploaded resume?")) return;
        try {
            const response = await fetch("/api/v1/profile/resume", {
                method: "DELETE",
                credentials: "same-origin",
            });
            if (!response.ok) throw new Error(`Delete failed: ${response.status}`);
            showResume(null);
            showToast("Resume removed");
        } catch {
            showToast("Couldn't remove your resume. Please try again.", "error");
        }
    });

    observeSections();
    sync();
}
