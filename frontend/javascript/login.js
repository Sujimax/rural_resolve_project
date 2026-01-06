import API_BASE_URL from "./config.js";

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("login-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      email: form.email.value.trim(),
      password: form.password.value.trim()
    };

    try {

      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.detail || "Login failed");
      }

      // Save token
      localStorage.setItem("access_token", result.access_token);

      // Decode JWT safely
      const tokenParts = result.access_token.split(".");
      const payload = JSON.parse(atob(tokenParts[1]));

      const role = payload.role || "user";

      // Redirect based on role
      if (role === "admin") {
        window.location.href = "admin.html";
      } else {
        window.location.href = "dashboard.html";
      }

    } catch (err) {
      alert(err.message);
    }
  });
});
