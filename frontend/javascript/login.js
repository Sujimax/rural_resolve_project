import API_BASE_URL from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      email: form.email.value,
      password: form.password.value
    };

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Login failed");
      }

      const result = await res.json();
      localStorage.setItem("access_token", result.access_token);

      const payload = JSON.parse(atob(result.access_token.split(".")[1]));
      window.location.href =
        payload.role === "admin" ? "admin.html" : "dashboard.html";

    } catch (err) {
      alert(err.message);
    }
  });
});
