/* Billing page */
const billingPage = document.querySelector("[data-billing]");

if (billingPage) {
    // Checkout and the Customer Portal are Stripe-hosted: the API creates a session and returns its URL.
    billingPage.addEventListener("click", async (e) => {
        const button = e.target.closest("[data-stripe-redirect]");
        if (!button) return;

        const label = button.textContent;
        button.disabled = true;
        button.textContent = "Redirecting…";

        try {
            const response = await fetch(button.dataset.stripeRedirect, {
                method: "POST",
                credentials: "same-origin",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(
                    button.dataset.packId ? { packId: button.dataset.packId } : {},
                ),
            });
            if (!response.ok) throw new Error(`Stripe session failed: ${response.status}`);

            const { url } = await response.json();
            if (!url) throw new Error("Stripe session URL missing");
            window.location.href = url;
        } catch {
            showToast("Couldn't connect to Stripe. Please try again.", "error");
            button.disabled = false;
            button.textContent = label;
        }
    });

    const rechargeForm = document.getElementById("auto-recharge-form");
    const turnOffDialog = document.getElementById("turn-off-auto-recharge-dialog");

    const saveAutoRecharge = async (enabled) => {
        const data = new FormData(rechargeForm);
        const response = await fetch("/api/v1/billing/auto-recharge", {
            method: "PUT",
            credentials: "same-origin",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                enabled,
                threshold: Number(data.get("threshold")),
                packId: data.get("packId"),
            }),
        });
        if (!response.ok) throw new Error(`Saving auto-recharge failed: ${response.status}`);
        // The section's copy and buttons depend on the saved state, so re-render from the server.
        window.location.reload();
    };

    rechargeForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!rechargeForm.reportValidity()) return;

        const submitButton = e.submitter ?? rechargeForm.querySelector('[type="submit"]');
        const label = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = "Saving…";

        try {
            await saveAutoRecharge(true);
        } catch {
            showToast("Couldn't update auto-recharge. Please try again.", "error");
            submitButton.disabled = false;
            submitButton.textContent = label;
        }
    });

    rechargeForm.querySelector("[data-open-turn-off]")?.addEventListener("click", () => {
        turnOffDialog.showModal();
    });

    const dialogForm = turnOffDialog.querySelector("form");
    const confirmButton = dialogForm.querySelector('[type="submit"]');
    const alertBox = dialogForm.querySelector('[role="alert"]');

    dialogForm
        .querySelector("[data-close-dialog]")
        .addEventListener("click", () => turnOffDialog.close());
    turnOffDialog.addEventListener("close", () => (alertBox.textContent = ""));

    dialogForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        confirmButton.disabled = true;
        confirmButton.textContent = "Turning off…";
        alertBox.textContent = "";

        try {
            await saveAutoRecharge(false);
        } catch {
            alertBox.textContent = "Something went wrong. Please try again.";
            confirmButton.disabled = false;
            confirmButton.textContent = "Turn off";
        }
    });
}
