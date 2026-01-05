document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    alert("Please login as admin");
    window.location.href = "login.html";
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
  const deleteBtn = document.getElementById("deleteComplaint"); // Add a delete button in HTML

  // Function to update status badge color
  function updateStatusBadge(status) {
    currentStatusEl.className = "status-badge"; // Reset classes
    const s = (status || "pending").toLowerCase();
    // if (s === "pending") currentStatusEl.classList.add("status-pending");
    if (s === "in progress") currentStatusEl.classList.add("status-in-progress");
    else if (s === "solved") currentStatusEl.classList.add("status-solved");
    currentStatusEl.textContent = status.charAt(0).toUpperCase() + status.slice(1);
  }

  // Fetch complaint details
  async function fetchComplaint() {
    try {
      const res = await fetch(`http://127.0.0.1:8000/complaints/${complaintId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        if (res.status === 401) {
          alert("Session expired. Login again.");
          localStorage.removeItem("access_token");
          window.location.href = "login.html";
        }
        throw new Error("Failed to fetch complaint");
      }

      const c = await res.json();

      userIdEl.textContent = c.user_id || "N/A";
      nameEl.textContent = c.user_name || c.name || "N/A";
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
      complaintImageEl.src = c.image_url ? `http://127.0.0.1:8000/${c.image_url}` : "../images/icon1.png";

      // Set current status & badge color
      statusSelect.value = (c.status || "pending").toLowerCase();
      updateStatusBadge(c.status || "Pending");

    } catch (error) {
      console.error(error);
      alert("Error loading complaint");
    }
  }

  // Update complaint status
  updateStatusBtn.addEventListener("click", async () => {
    const newStatus = statusSelect.value;

    try {
      const res = await fetch(`http://127.0.0.1:8000/admin/complaints/${complaintId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) {
        if (res.status === 401) {
          alert("Session expired. Login again.");
          localStorage.removeItem("access_token");
          window.location.href = "login.html";
        }
        throw new Error("Failed to update status");
      }

      updateStatusBadge(newStatus);
      alert("Status updated successfully ✅");

    } catch (error) {
      console.error(error);
      alert("Error updating status");
    }
  });

  // ✅ Delete complaint (admin only)
  deleteBtn.addEventListener("click", async () => {
    if (!confirm("Are you sure you want to delete this complaint?")) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/admin/complaints/${complaintId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to delete complaint");
      }

      alert("Complaint deleted successfully ✅");
      window.location.href = "admin.html"; // redirect back to admin page

    } catch (error) {
      console.error(error);
      alert("Error deleting complaint: " + error.message);
    }
  });

  // Initial fetch
  fetchComplaint();
});
