import API_BASE_URL from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  if (!form) return;

  // ===== Inline Error Functions =====

  const showError = (input, message) => {
    let error = input.nextElementSibling;

    if (!error || !error.classList.contains("error-msg")) {
      error = document.createElement("small");
      error.classList.add("error-msg");
      input.parentNode.insertBefore(error, input.nextSibling);
    }

    error.textContent = message;
    error.style.color = "red";
  };

  const clearError = (input) => {
    let error = input.nextElementSibling;
    if (error && error.classList.contains("error-msg")) {
      error.textContent = "";
    }
  };

  // ===== Email Validation =====

  form.email.addEventListener("input", () => {
    const email = form.email.value.trim();

    if (!/^[\w.-]+@[\w.-]+\.\w{2,}$/.test(email)) {
      showError(form.email, "Invalid email format");
    } else {
      clearError(form.email);
    }
  });

  // ===== Password Hide / Show (FIXED FOR IMAGE ICONS) =====

  document.querySelectorAll(".toggle-password").forEach((btn) => {
    btn.addEventListener("click", () => {

      const wrapper = btn.closest(".password-wrapper");
      const input = wrapper.querySelector("input");

      const showIcon = btn.dataset.show;
      const hideIcon = btn.dataset.hide;

      if (input.type === "password") {
        input.type = "text";
        btn.src = hideIcon;
      } else {
        input.type = "password";
        btn.src = showIcon;
      }

    });
  });

  // ===== Form Submission =====

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    let valid = true;

    const email = form.email.value.trim();
    const password = form.password.value;

    // Email validation
    if (!email) {
      showError(form.email, "Email is required");
      valid = false;
    } else if (!/^[\w.-]+@[\w.-]+\.\w{2,}$/.test(email)) {
      showError(form.email, "Invalid email format");
      valid = false;
    } else {
      clearError(form.email);
    }

    // Password validation
    if (!password) {
      showError(form.password, "Password is required");
      valid = false;
    } else if (password.length < 6) {
      showError(form.password, "Minimum 6 characters required");
      valid = false;
    } else {
      clearError(form.password);
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
        showError(form.password, data.detail || "Invalid email or password");
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