/* Feedback page */
const feedbackForm = document.getElementById("feedback-form");

if (feedbackForm) {
    const fields = feedbackForm.elements;
    const submitButton = feedbackForm.querySelector('[type="submit"]');
    const charCount = feedbackForm.querySelector("[data-char-count]");
    const feedbackList = document.querySelector("[data-feedback-list]");
    const itemTemplate = document.querySelector("template[data-feedback-template]");

    const selectedType = () => [...fields.namedItem("type")].find((radio) => radio.checked);

    const updatePlaceholders = () => {
        const type = selectedType();
        if (!type) return;
        fields.title.placeholder = type.dataset.titlePlaceholder;
        fields.description.placeholder = type.dataset.descriptionPlaceholder;
    };

    const updateCharCount = () => {
        const { value, maxLength } = fields.description;
        charCount.textContent = `${value.length} / ${maxLength}`;
        charCount.dataset.nearLimit = String(value.length >= maxLength * 0.9);
    };

    const hasDraft = () => Boolean(fields.title.value.trim() || fields.description.value.trim());

    const addToHistory = (item) => {
        const fragment = itemTemplate.content.cloneNode(true);
        const slot = (name) => fragment.querySelector(`[data-slot="${name}"]`);
        const createdAt = new Date(item.createdAt);

        slot("title").textContent = item.title;
        slot("type").textContent = item.typeLabel;
        slot("date").dateTime = createdAt.toISOString();
        slot("date").textContent = createdAt.toLocaleDateString(undefined, { dateStyle: "medium" });
        slot("description").textContent = item.description;

        feedbackList.prepend(fragment);
    };

    feedbackForm.addEventListener("change", (e) => {
        if (e.target.name === "type") updatePlaceholders();
    });

    fields.description.addEventListener("input", updateCharCount);

    feedbackForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!feedbackForm.reportValidity()) return;

        const type = selectedType();
        const feedback = {
            type: type.value,
            title: fields.title.value.trim(),
            description: fields.description.value.trim(),
        };

        submitButton.disabled = true;
        submitButton.textContent = "Sending…";

        try {
            const response = await fetch("/api/v1/feedback", {
                method: "POST",
                credentials: "same-origin",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(feedback),
            });

            if (response.status === 429) {
                showToast(
                    "You're sending feedback too quickly. Please wait a minute and try again.",
                    "error",
                );
                return;
            }
            if (!response.ok) throw new Error(`Sending feedback failed: ${response.status}`);

            const created = await response.json().catch(() => ({}));
            addToHistory({
                ...feedback,
                createdAt: new Date().toISOString(),
                ...created,
                typeLabel: type.dataset.label,
            });

            fields.title.value = "";
            fields.description.value = "";
            updateCharCount();
            showToast("Thanks! Your feedback was sent.");
        } catch {
            showToast("Couldn't send your feedback. Please try again.", "error");
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = "Send feedback";
        }
    });

    window.addEventListener("beforeunload", (e) => {
        if (hasDraft()) e.preventDefault();
    });

    updatePlaceholders();
    updateCharCount();
}
