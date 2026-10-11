/* Login form */
document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const props = Object.fromEntries(formData);
    console.log(props);
});
