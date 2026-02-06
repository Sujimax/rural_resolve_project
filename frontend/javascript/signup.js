import API_BASE_URL from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signup-form");

  // Show password strength (basic)
  const passwordInput = form.password;
  const strengthMsg = document.createElement("small");
  passwordInput.parentNode.appendChild(strengthMsg);

  passwordInput.addEventListener("input", () => {
    const pwd = passwordInput.value;
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

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Basic validations
    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const confirmPassword = form.confirm_password.value;

    if (!name || !phone || !email || !password || !confirmPassword) {
      alert("All fields are required");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      alert("Phone number must be 10 digits");
      return;
    }

    if (!/^[\w.-]+@[\w.-]+\.\w{2,}$/.test(email)) {
      alert("Invalid email format");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

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

// import API_BASE_URL from "./config.js";

// document.addEventListener("DOMContentLoaded", () => {
//   const form = document.getElementById("signup-form");

//   form.addEventListener("submit", async (e) => {
//     e.preventDefault();

//     if (form.password.value !== form.confirm_password.value) {
//       alert("Passwords do not match");
//       return;
//     }

//     const data = {
//       name: form.name.value,
//       phone: form.phone.value,
//       email: form.email.value,
//       password: form.password.value
//     };

//     try {
//       const res = await fetch(`${API_BASE_URL}/auth/signup`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data)
//       });

//       if (!res.ok) {
//         const err = await res.json();
//         throw new Error(err.detail || "Signup failed");
//       }

//       alert("Signup successful");
//       window.location.href = "login.html";
//     } catch (err) {
//       alert(err.message);
//     }
//   });
// });
