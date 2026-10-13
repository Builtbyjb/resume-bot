async function handlePost(url, body) {
    return await fetch(url, {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
}

let toastTimer;
function showToast(message, variant = "success") {
    const toast = document.querySelector("[data-toast]");
    if (!toast) return;
    toast.dataset.variant = variant;
    toast.textContent = message;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (toast.textContent = ""), 4000);
}

// Make the current values the form's defaults, so form.reset() and the serialized markup
// (innerHTML) both return to them.
function commitFormDefaults(form) {
    for (const el of form.elements) {
        if (el instanceof HTMLInputElement) {
            if (el.type === "checkbox" || el.type === "radio") el.defaultChecked = el.checked;
            else if (el.type !== "file") el.defaultValue = el.value;
        } else if (el instanceof HTMLTextAreaElement) {
            el.defaultValue = el.value;
        } else if (el instanceof HTMLSelectElement) {
            for (const option of el.options) option.defaultSelected = option.selected;
        }
    }
}
