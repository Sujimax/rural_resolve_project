import API_BASE_URL from "./config.js";

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    alert("Please login as admin");
    window.location.href = "login.html";
    return;
  }

  let payload;
  try {
    payload = JSON.parse(atob(token.split(".")[1]));
  } catch {
    alert("Invalid token, please login again");
    localStorage.removeItem("access_token");
    window.location.href = "login.html";
    return;
  }

  if (payload.role !== "admin") {
    alert("Unauthorized");
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
  const addressEl = document.getElementById("address");
  const votesEl = document.getElementById("votes");
  const dateEl = document.getElementById("date");
  const currentStatusEl = document.getElementById("currentStatus");
  const statusSelect = document.getElementById("statusSelect");
  const updateStatusBtn = document.getElementById("updateStatus");
  const complaintImageEl = document.getElementById("complaintImage");
  const deleteBtn = document.getElementById("deleteComplaint");

  let complaintData = null;

  // Update status badge
  function updateStatusBadge(status) {
    currentStatusEl.className = "status-badge";
    const s = (status || "pending").toLowerCase();

    if (s === "in progress") {
      currentStatusEl.classList.add("status-in-progress");
      currentStatusEl.textContent = "In Progress";
    } else if (s === "resolved") {
      currentStatusEl.classList.add("status-resolved");
      currentStatusEl.textContent = "Resolved";
    } else {
      currentStatusEl.classList.add("status-pending");
      currentStatusEl.textContent = "Pending";
    }
  }

  // Fetch complaint details
  async function fetchComplaint() {
    try {
      const res = await fetch(`${API_BASE_URL}/complaints/${complaintId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      complaintData = await res.json();

      // Fill data
      userIdEl.textContent = complaintData.user_id || "N/A";
      nameEl.textContent = complaintData.user_name || "N/A";
      mobileEl.textContent = complaintData.phone || "N/A";
      emailEl.textContent = complaintData.email || "N/A";
      complaintIdEl.textContent = complaintData.id;
      problemEl.textContent = complaintData.problem_type || "N/A";
      descriptionEl.textContent = complaintData.description || "N/A";
      districtEl.textContent = complaintData.district || "N/A";
      villageEl.textContent = complaintData.village || "N/A";
      addressEl.textContent = complaintData.address || "N/A";
      votesEl.textContent = complaintData.votes || 0;

      dateEl.textContent = new Date(complaintData.created_at).toLocaleDateString();

      complaintImageEl.src = complaintData.image_url || "../images/icon1.png";

      // Set current status
      statusSelect.value = (complaintData.status || "pending").toLowerCase();
      updateStatusBadge(complaintData.status);

      // If resolved, disable dropdown only, keep button clickable
      if (complaintData.status && complaintData.status.toLowerCase() === "resolved") {
        statusSelect.disabled = true;
        updateStatusBtn.textContent = "Status Finalized";
      } else {
        statusSelect.disabled = false;
        updateStatusBtn.textContent = "Update Status";
      }

    } catch (err) {
      alert("Error loading complaint");
      console.error(err);
    }
  }

  // Update status button click
  updateStatusBtn.addEventListener("click", async () => {
    // ✅ ALERT if already resolved
    if (!complaintData) return; // safety check
    if (complaintData.status.toLowerCase() === "resolved") {
      alert("This complaint is already resolved! Status cannot be changed.");
      return;
    }

    const newStatus = statusSelect.value;

    try {
      const res = await fetch(`${API_BASE_URL}/admin/complaints/${complaintId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) throw new Error("Update failed");

      // Update local complaintData and UI
      complaintData.status = newStatus;
      updateStatusBadge(newStatus);

      if (newStatus.toLowerCase() === "resolved") {
        statusSelect.disabled = true;
        updateStatusBtn.textContent = "Status Finalized";
      }

      // Send email
      const params = {
        user_name: nameEl.textContent,
        complaint_id: complaintIdEl.textContent,
        status: newStatus,
        email_to: emailEl.textContent
      };

      window.emailjs
        .send("service_lrkjfeo", "template_cq2r65r", params)
        .then(() => alert("Status updated & email sent successfully!"))
        .catch(err => {
          console.error("EmailJS Error:", err);
          alert("Status updated but email not sent");
        });

    } catch (err) {
      alert("Error updating status");
      console.error(err);
    }
  });

  // Delete button
  deleteBtn.addEventListener("click", async () => {
    if (!confirm("Delete this complaint?")) return;

    try {
      await fetch(`${API_BASE_URL}/admin/complaints/${complaintId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Deleted successfully");
      window.location.href = "admin.html";
    } catch (err) {
      alert("Delete error");
      console.error(err);
    }
  });

  fetchComplaint();
});


