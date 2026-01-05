import API_BASE_URL from "./config.js";

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    window.location.href = "login.html";
    return;
  }

  const payload = JSON.parse(atob(token.split(".")[1]));

  if (payload.role !== "admin") {
    alert("Access denied");
    window.location.href = "dashboard.html";
    return;
  }

  const res = await fetch(`${API_BASE_URL}/complaints/`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const complaints = await res.json();
  console.log(complaints);
});
