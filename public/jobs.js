/* Jobs drawer */
const jobDrawer = document.getElementById("job-drawer");

if (jobDrawer) {
    const drawerBody = jobDrawer.querySelector("[data-drawer-body]");
    let selectedRow = null;

    const openJob = (row) => {
        const template = document.getElementById(`job-detail-${row.dataset.jobId}`);
        if (!template) return;

        drawerBody.replaceChildren(template.content.cloneNode(true));
        drawerBody.scrollTop = 0;

        selectedRow?.classList.remove("selected");
        selectedRow = row;
        row.classList.add("selected");

        if (!jobDrawer.open) jobDrawer.showModal();
    };

    document.querySelectorAll("tr[data-job-id]").forEach((row) => {
        row.addEventListener("click", () => openJob(row));
        row.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openJob(row);
            }
        });
    });

    // The dialog has no padding, so a click whose target is the dialog itself landed on the backdrop.
    jobDrawer.addEventListener("click", (e) => {
        if (e.target === jobDrawer) jobDrawer.close();
    });

    jobDrawer.addEventListener("close", () => {
        selectedRow?.classList.remove("selected");
        selectedRow = null;
    });
}
