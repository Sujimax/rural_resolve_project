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

  // ===== Email Validation (Live while typing) =====

  form.email.addEventListener("input", () => {
    const email = form.email.value.trim();

    if (!/^[\w.-]+@[\w.-]+\.\w{2,}$/.test(email)) {
      showError(form.email, "Invalid email format");
    } else {
      clearError(form.email);
    }
  });

  // ===== Password Show / Hide =====

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

    const email = form.email.value.trim();
    const password = form.password.value;

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        showError(form.password, data.detail || "Invalid email or password");
        return;
      }

      // Save token
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Decode JWT
      const payload = JSON.parse(atob(data.access_token.split(".")[1]));
      const role = payload.role || "user";

      // Redirect
      window.location.href =
        role === "admin"
          ? "admin.html"
          : "dashboard.html";

    } catch (err) {
      alert("Something went wrong. Please try again.");
      console.error(err);
    }
  });

});


