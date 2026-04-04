import API_BASE_URL from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signup-form");
  if (!form) return;

  // Inline Error Functions 

  const showError = (input, message) => {
    let error = input.nextElementSibling;

    // error ilana work agum
    if (!error || !error.classList.contains("error-msg")) {
      error = document.createElement("small");
      error.classList.add("error-msg");
      input.parentNode.insertBefore(error, input.nextSibling);    //newelement, reference element
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

  // ===== Password Strength =====

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
      passwordStatus.textContent = "Strong ";
      passwordStatus.style.color = "green";
    }
  });

  // ===== Mobile Validation =====

  form.phone.addEventListener("input", () => {
    form.phone.value = form.phone.value.replace(/\D/g, "");    //pattern , newvalue

    const phone = form.phone.value;

    if (phone.length === 0) {
      showError(form.phone, "Phone number is required");
    } else if (phone.length < 10) {
      showError(form.phone, "Phone number must be exactly 10 digits");
    } else {
      clearError(form.phone);
    }
  });

  // ===== Email Validation =====

  form.email.addEventListener("input", () => {
    const email = form.email.value.trim();

    if (!/^[\w.-]+@[\w.-]+\.\w{2,}$/.test(email)) {
      showError(form.email, "Invalid email format");
    } else {
      clearError(form.email);
    }
  });

  // ===== Password Hide / Show =====

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

    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;

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










