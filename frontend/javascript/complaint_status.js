import API_BASE_URL from "./config.js";

document.addEventListener("DOMContentLoaded", () => {

  const token = localStorage.getItem("access_token");
  if (!token) {
    alert("Please login as admin");
    window.location.href = "login.html";
    return;
  }

  // ================= TOKEN CHECK =================
  let payload;
  try {
    payload = JSON.parse(atob(token.split(".")[1]));
  } catch {
    alert("Invalid token");
    window.location.href = "login.html";
    return;
  }

  if (payload.role !== "admin") {
    alert("Unauthorized");
    window.location.href = "dashboard.html";
    return;
  }

  const complaintId = new URLSearchParams(window.location.search).get("id");
  if (!complaintId) {
    alert("Complaint ID missing");
    return;
  }

  // ================= DOM ELEMENTS =================
  const el = (id) => document.getElementById(id);

  const userIdEl = el("userId");
  const nameEl = el("name");
  const mobileEl = el("mobile");
  const emailEl = el("email");
  const complaintIdEl = el("complaintId");
  const problemEl = el("problem");
  const descriptionEl = el("description");
  const districtEl = el("district");
  const villageEl = el("village");
  const addressEl = el("address");
  const votesEl = el("votes");
  const dateEl = el("date");
  const currentStatusEl = el("currentStatus");
  const statusSelect = el("statusSelect");
  const updateStatusBtn = el("updateStatus");
  const complaintImageEl = el("complaintImage");

  // ❗ Stop if HTML not loaded correctly
  if (!userIdEl || !updateStatusBtn) {
    console.error("HTML elements missing");
    return;
  }

  // ================= STATUS BADGE =================
  function updateStatusBadge(status) {
    currentStatusEl.className = "status-badge";

    const s = (status || "pending").toLowerCase();
    if (s === "in progress") currentStatusEl.classList.add("status-in-progress");
    else if (s === "resolved") currentStatusEl.classList.add("status-resolved");
    else currentStatusEl.classList.add("status-pending");

    currentStatusEl.textContent = status || "Pending";
  }

  // ================= FETCH COMPLAINT =================
  async function fetchComplaint() {
    try {
      const res = await fetch(`${API_BASE_URL}/complaints/${complaintId}`);
      if (!res.ok) throw new Error("Fetch failed");

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
      addressEl.textContent = c.address;
      votesEl.textContent = c.votes;
      dateEl.textContent = new Date(c.created_at).toLocaleDateString();

      complaintImageEl.src = c.image_url || "../images/icon1.png";

      statusSelect.value = (c.status || "pending").toLowerCase();
      updateStatusBadge(c.status);

    } catch (err) {
      console.error(err);
      alert("Complaint details not loading");
    }
  }

  // ================= EMAILJS =================
  emailjs.init("XHeAM4w6Ryg1e-lB9");

  updateStatusBtn.addEventListener("click", async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/admin/complaints/${complaintId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ status: statusSelect.value })
        }
      );

      if (!res.ok) throw new Error("Update failed");

      updateStatusBadge(statusSelect.value);

      await emailjs.send("service_6i8hmql", "template_yy03x4k", {
        user_name: nameEl.textContent,
        complaint_id: complaintIdEl.textContent,
        status: statusSelect.value,
        email_to: emailEl.textContent
      });

      alert("Status updated & email sent ✅");

    } catch (err) {
      console.error(err);
      alert("Status updated but email failed ❌");
    }
  });

  // ================= LOAD DATA =================
  fetchComplaint();
});
