import API_BASE_URL from "./config.js";

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    window.location.href = "login.html";
    return;
  }

  // Decode JWT safely
  let payload;
  try {
    payload = JSON.parse(atob(token.split(".")[1]));
  } catch {
    localStorage.removeItem("access_token");
    window.location.href = "login.html";
    return;
  }

  // Admin check
  if (payload.role !== "admin") {
    alert("You are not authorized to view this page");
    window.location.href = "dashboard.html";
    return;
  }

  const tableBody = document.querySelector("#complaints-table tbody");
  const totalCount = document.getElementById("total-count");
  const resolvedCount = document.getElementById("solved-count");
  const pendingCount = document.getElementById("pending-count");

  try {
    const res = await fetch(`${API_BASE_URL}/complaints/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      if (res.status === 401) {
        alert("Session expired. Login again.");
        localStorage.removeItem("access_token");
        window.location.href = "login.html";
      }
      throw new Error("Failed to fetch complaints");
    }

    const complaints = await res.json();
    tableBody.innerHTML = "";

    let resolved = 0;
    let pending = 0;

    complaints.forEach(c => {
      // ===== STATUS LOGIC =====
      const statusLower = (c.status || "pending").toLowerCase();
      let statusClass = "status-pending";
      let statusText = "Pending";

      if (statusLower === "resolved") {
        statusClass = "status-resolved";
        statusText = "Resolved";
        resolved++;
      } else if (statusLower === "in progress") {
        statusClass = "status-in-progress";
        statusText = "In Progress";
        pending++;
      } else {
        pending++;
      }
      // ========================

      const imageSrc = c.image_url
        ? c.image_url
        : "../images/icon1.png";

      tableBody.innerHTML += `
        <tr>
          <td>${c.id}</td>
          <td>${c.problem_type}</td>
          <td>${c.name || c.user_name || "N/A"}</td>
          <td>${c.district}</td>
          <td>${c.votes || 0}</td>
          <td>${c.description}</td>
          <td>${new Date(c.created_at).toLocaleDateString()}</td>
          <td>
            <img src="${imageSrc}" width="50">
          </td>
          <td>
            <span class="status-badge ${statusClass}">
              ${statusText}
            </span>
          </td>
          <td>
            <button class="view-btn"
              onclick="window.location.href='complaint_status.html?id=${c.id}'">
              View
            </button>
          </td>
        </tr>
      `;
    });

    totalCount.textContent = complaints.length;
    resolvedCount.textContent = resolved;
    pendingCount.textContent = pending;

  } catch (error) {
    console.error(error);
    tableBody.innerHTML =
      `<tr><td colspan="10">Error loading complaints</td></tr>`;
  }
});

