import API_BASE_URL from "./config.js";

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("login-form");
  if (!form) return;

  // ======================
  // Error Function
  // ======================
  const setError = (input, message = "") => {
    let error = input.parentElement.querySelector(".error-msg");

    if (!error) {
      error = document.createElement("small");
      error.className = "error-msg";
      error.style.color = "red";
      input.parentElement.appendChild(error);
    }

    error.textContent = message;
  };

  // ======================
  // Password Toggle (COMMON)
  // ======================
  document.querySelectorAll(".toggle-password").forEach(icon => {
    icon.addEventListener("click", () => {
      const wrapper = icon.closest(".password-wrapper");
      if (!wrapper) return;

      const input = wrapper.querySelector("input");
      if (!input) return;

      const hidden = input.type === "password";
      input.type = hidden ? "text" : "password";
      icon.src = hidden ? icon.dataset.hide : icon.dataset.show;
    });
  });

  // ======================
  // Form Submit
  // ======================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = form.email.value.trim();
    const password = form.password.value.trim();

    let valid = true;

    if (!email) {
      setError(form.email, "Email is required");
      valid = false;
    } else if (!/^[\w.-]+@[\w.-]+\.\w{2,}$/.test(email)) {
      setError(form.email, "Invalid email format");
      valid = false;
    } else {
      setError(form.email);
    }

    if (!password) {
      setError(form.password, "Password is required");
      valid = false;
    } else if (password.length < 6) {
      setError(form.password, "Minimum 6 characters required");
      valid = false;
    } else {
      setError(form.password);
    }

    if (!valid) return;

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(form.password, data.detail || "Invalid email or password");
        return;
      }

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      const payload = JSON.parse(atob(data.access_token.split(".")[1]));
      const role = payload.role || "user";

      window.location.href = role === "admin"
        ? "admin.html"
        : "dashboard.html";

    } catch (err) {
      alert("Something went wrong. Please try again.");
      console.error(err);
    }
  });

});
