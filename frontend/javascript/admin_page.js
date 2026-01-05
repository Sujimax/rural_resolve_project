import API_BASE_URL from "./config.js";

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("access_token");
  if (!token) return (location.href = "login.html");

  const payload = JSON.parse(atob(token.split(".")[1]));
  if (payload.role !== "admin") return (location.href = "dashboard.html");

  const res = await fetch(`${API_BASE_URL}/complaints/`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const complaints = await res.json();
  console.log(complaints);
});
