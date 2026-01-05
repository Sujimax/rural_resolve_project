document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      email: form.email.value,
      password: form.password.value
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Login failed");
      }

      const result = await res.json();

      // Store JWT & user info
      localStorage.setItem("access_token", result.access_token);
      localStorage.setItem("token_type", result.token_type);
      localStorage.setItem("user", JSON.stringify(result.user || {}));

      // Decode JWT payload
      const payload = JSON.parse(atob(result.access_token.split(".")[1]));

      if (payload.role === "admin") {
        alert("Admin login successful ✅");
        window.location.href = "admin.html";
      } else {
        alert("User login successful ✅");
        window.location.href = "dashboard.html";
      }

    } catch (err) {
      alert("❌ " + err.message);
    }
  });
});
