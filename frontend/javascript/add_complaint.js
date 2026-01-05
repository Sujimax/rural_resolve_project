import API_BASE_URL from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const token = localStorage.getItem("access_token");

  if (!token) return (location.href = "login.html");

  form.addEventListener("submit", async e => {
    e.preventDefault();

    const data = new FormData(form);

    await fetch(`${API_BASE_URL}/complaints/`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: data
    });

    alert("Complaint submitted");
    form.reset();
  });
});
