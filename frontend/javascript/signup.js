document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signup-form");

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const password = form.password.value;
    const confirmPassword = form.confirm_password.value;

    if (password !== confirmPassword) {
      alert("Passwords do not match ❌");
      return;
    }

    const data = {
      name: form.name.value,
      phone: form.phone.value,
      email: form.email.value,
      password: password,
      // role: "user"
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Signup failed ❌");
      }

      alert("Signup successful ✅");
      window.location.href = "login.html";

    } catch (error) {
      alert(error.message);
    }
  });
});
