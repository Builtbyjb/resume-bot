async function handlePost(url, body) {
    return await fetch(url, {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
}

/* Login form */
document.getElementById("signin-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const props = Object.fromEntries(formData);

    const response = await handlePost("/api/v1/signin", { email: props.email });

    if (response.status === 200) {
        const otpDiv = document.getElementById("otp-div");
        if (otpDiv) otpDiv.style.display = "flex";
    }
});

/* OTP form */
document.getElementById("otp-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const props = Object.fromEntries(formData);

    const response = await handlePost("/api/v1/otp", { otp: props.otp });

    if (response.status === 200) {
        const result = await response.json();
        localStorage.setItem("userData", JSON.stringify(result.userData));
        window.location.href = "/jobs";
    }
});
