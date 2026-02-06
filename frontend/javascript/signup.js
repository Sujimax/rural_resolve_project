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

  // Function to setup password field with toggle + strength
  const setupPasswordField = (input) => {
    // Wrap input in password-wrapper
    const wrapper = document.createElement("div");
    wrapper.classList.add("password-wrapper");
    input.parentNode.insertBefore(wrapper, input);
    wrapper.appendChild(input);

    // Add toggle button
    const toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.classList.add("toggle-password");
    toggleBtn.textContent = "👁️";
    wrapper.appendChild(toggleBtn);

    toggleBtn.addEventListener("click", () => {
      if (input.type === "password") {
        input.type = "text";
        toggleBtn.textContent = "🙈";
      } else {
        input.type = "password";
        toggleBtn.textContent = "👁️";
      }
    });

    // Add password strength message below input
    const strengthMsg = document.createElement("small");
    strengthMsg.style.display = "block";
    wrapper.insertBefore(strengthMsg, toggleBtn);

    // Add strength logic (only for main password, skip for confirm)
    if (input.name === "password") {
      input.addEventListener("input", () => {
        const pwd = input.value;
        if (pwd.length < 6) {
          strengthMsg.textContent = "Weak password: min 6 characters";
          strengthMsg.style.color = "red";
        } else if (!/[A-Z]/.test(pwd) || !/[0-9]/.test(pwd)) {
          strengthMsg.textContent = "Medium: add uppercase & number";
          strengthMsg.style.color = "orange";
        } else {
          strengthMsg.textContent = "Strong password ✅";
          strengthMsg.style.color = "green";
        }
      });
    }
  };

  // Setup both password fields
  setupPasswordField(form.password);
  setupPasswordField(form.confirm_password);

  // Phone validation on input
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

  // Email validation on input
  form.email.addEventListener("input", () => {
    const email = form.email.value.trim();
    if (!/^[\w.-]+@[\w.-]+\.\w{2,}$/.test(email)) {
      showError(form.email, "Invalid email format");
    } else {
      clearError(form.email);
    }
  });

  // Form submit
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
      showError(form.password, "Password too short, min 6 characters");
      valid = false;
    } else if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      showError(form.password, "Add uppercase & number for strong password");
      valid = false;
    } else {
      clearError(form.password);
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      showError(form.confirm_password, "Passwords do not match");
      valid = false;
    } else {
      clearError(form.confirm_password);
    }

    if (!valid) return; // stop submission if invalid

    // Submit data
    const data = { name, phone, email, password };

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
