const token = localStorage.getItem("access_token");

if (!token) {
  window.location.href = "login.html";
}

const payload = JSON.parse(atob(token.split(".")[1]));

if (payload.role !== "admin") {
  alert("Access denied");
  window.location.href = "dashboard.html";
}
