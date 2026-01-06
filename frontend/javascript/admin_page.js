document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("access_token");

  /* ================= AUTH CHECK ================= */
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  let payload;
  try {
    payload = JSON.parse(atob(token.split(".")[1]));
  } catch (err) {
    localStorage.removeItem("access_token");
    window.location.href = "login.html";
    return;
  }

  if (payload.role !== "admin") {
    alert("❌ You are not authorized to view this page");
    window.location.href = "dashboard.html";
    return;
  }

  /* ================= DOM ELEMENTS ================= */
  const tableBody = document.querySelector("#complaints-table tbody");
  const totalCount = document.getElementById("total-count");
  const solvedCount = document.getElementById("solved-count");
  const pendingCount = document.getElementById("pending-count");

  /* ================= FETCH COMPLAINTS ================= */
  try {
    const res = await fetch("http://127.0.0.1:8000/complaints/", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (res.status === 401) {
      alert("Session expired. Please login again.");
      localStorage.removeItem("access_token");
      window.location.href = "login.html";
      return;
    }

    if (!res.ok) {
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
      } else {
        pending++;
      }

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${c.id}</td>
        <td>${c.problem_type}</td>
        <td>${c.user_name || "N/A"}</td>
        <td>${c.district}</td>
        <td>${c.votes || 0}</td>
        <td>${c.description || "N/A"}</td>
        <td>${new Date(c.created_at).toLocaleDateString()}</td>
        <td>
          <img 
            src="${c.image_url ? `http://127.0.0.1:8000/${c.image_url}` : "../images/icon1.png"}"
            width="50"
            alt="Complaint Image"
          />
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
      `;

      tableBody.appendChild(row);
    });

    /* ================= SUMMARY COUNTS ================= */
    totalCount.textContent = complaints.length;
    solvedCount.textContent = solved;
    pendingCount.textContent = pending;

  } catch (error) {
    console.error(error);
    tableBody.innerHTML = `
      <tr>
        <td colspan="10">⚠️ Error loading complaints</td>
      </tr>
    `;
  }
});
