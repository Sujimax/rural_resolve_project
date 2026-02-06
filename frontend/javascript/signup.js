import API_BASE_URL from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signup-form");

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

  // Password strength
  const passwordInput = form.password;
  const passwordStatus = passwordInput.parentNode.querySelector(".password-status");

  passwordInput.addEventListener("input", () => {
    const pwd = passwordInput.value;

    if (pwd.length < 6) {
      passwordStatus.textContent = "Weak";
      passwordStatus.style.color = "red";
    } else if (!/[A-Z]/.test(pwd) || !/[0-9]/.test(pwd)) {
      passwordStatus.textContent = "Medium";
      passwordStatus.style.color = "orange";
    } else {
      passwordStatus.textContent = "Strong ✅";
      passwordStatus.style.color = "green";
    }
  });

  // Confirm password check
  const confirmInput = form.confirm_password;
  const confirmStatus = confirmInput.parentNode.querySelector(".password-status");

  confirmInput.addEventListener("input", () => {
    if (confirmInput.value === passwordInput.value && confirmInput.value.length >= 6) {
      confirmStatus.textContent = "✅";
      confirmStatus.style.color = "green";
    } else {
      confirmStatus.textContent = "";
    }
  });

  // Phone validation
  form.phone.addEventListener("input", () => {
    const phone = form.phone.value.trim();
    if (!/^\d{0,10}$/.test(phone)) {
      showError(form.phone, "Only digits allowed, max 10 digits");
    } else if (phone.length < 10) {
      showError(form.phone, "Phone number must be 10 digits");
    } else {
      clearError(form.phone);
    }
  });

  // Email validation
  form.email.addEventListener("input", () => {
    const email = form.email.value.trim();
    if (!/^[\w.-]+@[\w.-]+\.\w{2,}$/.test(email)) {
      showError(form.email, "Invalid email format");
    } else {
      clearError(form.email);
    }
  });

  // ✅ Fixed password toggle
  document.querySelectorAll(".toggle-password").forEach((btn) => {
    btn.addEventListener("click", () => {
      // Find the input in the same wrapper
      const wrapper = btn.closest(".password-wrapper");
      const input = wrapper.querySelector("input");

      if (input.type === "password") {
        input.type = "text";
        btn.textContent = "🙈"; // show monkey when visible
      } else {
        input.type = "password";
        btn.textContent = "👁️"; // show eye when hidden
      }
    });
  });

  // Form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    let valid = true;

    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const confirmPassword = form.confirm_password.value;

    // Name validation
    if (!name) {
      showError(form.name, "Name is required");
      valid = false;
    } else {
      clearError(form.name);
    }

    // Phone validation
    if (!/^\d{10}$/.test(phone)) {
      showError(form.phone, "Phone number must be 10 digits");
      valid = false;
    } else {
      clearError(form.phone);
    }

    // Email validation
    if (!/^[\w.-]+@[\w.-]+\.\w{2,}$/.test(email)) {
      showError(form.email, "Invalid email format");
      valid = false;
    } else {
      clearError(form.email);
    }

    // Password validation
    if (password.length < 6) {
      showError(passwordInput, "Password too short, min 6 characters");
      valid = false;
    } else if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      showError(passwordInput, "Add uppercase & number for strong password");
      valid = false;
    } else {
      clearError(passwordInput);
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      showError(confirmInput, "Passwords do not match");
      valid = false;
    } else {
      clearError(confirmInput);
    }

    if (!valid) return;

    // Submit data
    const data = { name, phone, email, password };

    try {
      const res = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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
