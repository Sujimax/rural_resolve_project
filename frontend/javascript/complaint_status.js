import API_BASE_URL from "./config.js";

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    alert("Please login as admin");
    window.location.href = "login.html";
    return;
  }

  const payload = JSON.parse(atob(token.split(".")[1]));
  if (payload.role !== "admin") {
    alert("❌ Unauthorized");
    window.location.href = "dashboard.html";
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const complaintId = params.get("id");
  if (!complaintId) {
    alert("Complaint ID missing");
    return;
  }

  // DOM elements
  const userIdEl = document.getElementById("userId");
  const nameEl = document.getElementById("name");
  const mobileEl = document.getElementById("mobile");
  const emailEl = document.getElementById("email");
  const complaintIdEl = document.getElementById("complaintId");
  const problemEl = document.getElementById("problem");
  const descriptionEl = document.getElementById("description");
  const districtEl = document.getElementById("district");
  const villageEl = document.getElementById("village");
  const doorNoEl = document.getElementById("doorNo");
  const votesEl = document.getElementById("votes");
  const dateEl = document.getElementById("date");
  const currentStatusEl = document.getElementById("currentStatus");
  const statusSelect = document.getElementById("statusSelect");
  const updateStatusBtn = document.getElementById("updateStatus");
  const complaintImageEl = document.getElementById("complaintImage");
  const deleteBtn = document.getElementById("deleteComplaint");

  function updateStatusBadge(status) {
    currentStatusEl.className = "status-badge";
    const s = (status || "pending").toLowerCase();
    if (s === "in progress") currentStatusEl.classList.add("status-in-progress");
    else if (s === "solved") currentStatusEl.classList.add("status-solved");
    else currentStatusEl.classList.add("status-pending");
    currentStatusEl.textContent = status;
  }

  // 🔹 FETCH COMPLAINT
  async function fetchComplaint() {
    try {
      const res = await fetch(`${API_BASE_URL}/complaints/${complaintId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Failed to fetch complaint");

      const c = await res.json();

      userIdEl.textContent = c.user_id || "N/A";
      nameEl.textContent = c.user_name || "N/A";
      mobileEl.textContent = c.phone || "N/A";
      emailEl.textContent = c.email || "N/A";
      complaintIdEl.textContent = c.id;
      problemEl.textContent = c.problem_type;
      descriptionEl.textContent = c.description;
      districtEl.textContent = c.district;
      villageEl.textContent = c.village;
      doorNoEl.textContent = c.door_no || "N/A";
      votesEl.textContent = c.votes || 0;
      dateEl.textContent = new Date(c.created_at).toLocaleDateString();

      // ✅ IMAGE FIX (ONLY CHANGE)
      complaintImageEl.src = c.image_url
        ? c.image_url
        : "../images/icon1.png";

      statusSelect.value = (c.status || "pending").toLowerCase();
      updateStatusBadge(c.status || "Pending");

    } catch (err) {
      alert("Error loading complaint");
      console.error(err);
    }
  }

  // 🔹 UPDATE STATUS
  updateStatusBtn.addEventListener("click", async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/complaints/${complaintId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: statusSelect.value })
      });

      if (!res.ok) throw new Error("Update failed");

      updateStatusBadge(statusSelect.value);
      alert("Status updated ✅");

    } catch (err) {
      alert("Error updating status");
      console.error(err);
    }
  });

  // 🔹 DELETE
  deleteBtn.addEventListener("click", async () => {
    if (!confirm("Delete this complaint?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/admin/complaints/${complaintId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Delete failed");

      alert("Deleted successfully ✅");
      window.location.href = "admin.html";

    } catch (err) {
      alert("Delete error");
      console.error(err);
    }
  });

  fetchComplaint();
});
