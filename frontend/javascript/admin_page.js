import API_BASE_URL from "./config.js";

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("access_token");

  // ✅ Check login
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  // ✅ Decode JWT safely
  let payload;
  try {
    payload = JSON.parse(atob(token.split(".")[1]));
  } catch {
    localStorage.removeItem("access_token");
    window.location.href = "login.html";
    return;
  }

  // ✅ Admin check
  if (payload.role !== "admin") {
    alert("❌ You are not authorized to view this page");
    window.location.href = "dashboard.html";
    return;
  }

  // DOM Elements
  const tableBody = document.querySelector("#complaints-table tbody");
  const totalCount = document.getElementById("total-count");
  const solvedCount = document.getElementById("solved-count");
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

    let solved = 0;
    let pending = 0;

    complaints.forEach(c => {
      const status = (c.status || "Pending").toLowerCase();
      let statusClass = "status-pending";

      if (status === "solved") {
        statusClass = "status-solved";
        solved++;
      } else if (status === "in progress") {
        statusClass = "status-in-progress";
        pending++;
      } else {
        pending++;
      }

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
            <img 
              src="${c.image_url ? `${API_BASE_URL}/${c.image_url}` : "../images/icon1.png"}" 
              width="50"
            >
          </td>
          <td>
            <span class="status-badge ${statusClass}">
              ${c.status || "Pending"}
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

    // Summary counts
    totalCount.textContent = complaints.length;
    solvedCount.textContent = solved;
    pendingCount.textContent = pending;

  } catch (error) {
    console.error(error);
    tableBody.innerHTML =
      `<tr><td colspan="10">Error loading complaints</td></tr>`;
  }
});
