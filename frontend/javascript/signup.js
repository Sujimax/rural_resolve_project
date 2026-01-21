import API_BASE_URL from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signup-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (form.password.value !== form.confirm_password.value) {
      alert("Passwords do not match");
      return;
    }

    const data = {
      name: form.name.value,
      phone: form.phone.value,
      email: form.email.value,
      password: form.password.value
    };

    try {
      const res = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Signup failed");
      }

      alert("Signup successful");
      window.location.href = "login.html";
    } catch (err) {
      alert(err.message);
    }
  });
});
