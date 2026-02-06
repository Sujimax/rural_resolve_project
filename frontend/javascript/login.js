import API_BASE_URL from "./config.js"; 

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");

  // Helper functions for inline errors
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

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const emailInput = form.email;
    const passwordInput = form.password;

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    let valid = true;

    // Email validation (like signup page)
    if (!email) {
      showError(emailInput, "Email is required");
      valid = false;
    } else if (!/^[\w.-]+@[\w.-]+\.\w{2,}$/.test(email)) {
      showError(emailInput, "Invalid email format");
      valid = false;
    } else {
      clearError(emailInput);
    }

    // Password validation (like signup page)
    if (!password) {
      showError(passwordInput, "Password is required");
      valid = false;
    } else if (password.length < 6) {
      showError(passwordInput, "Password must be at least 6 characters");
      valid = false;
    } else {
      clearError(passwordInput);
    }

    if (!valid) return; // stop submission if invalid

    // Send login request
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const result = await res.json();

      if (!res.ok) {
        // Show invalid credentials under password field
        showError(passwordInput, result.detail || "Invalid email or password");
        return;
      }

      // Save token
      localStorage.setItem("access_token", result.access_token);

      // Decode JWT to check role
      const payload = JSON.parse(atob(result.access_token.split(".")[1]));
      const role = payload.role || "user";

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
