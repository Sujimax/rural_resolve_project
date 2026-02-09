import API_BASE_URL from "./config.js";

document.addEventListener("DOMContentLoaded", async () => {
  const complaintSection = document.querySelector(".complaint-section");
  const token = localStorage.getItem("access_token");

  if (!token) {
    alert("Please login first");
    window.location.href = "login.html";
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/complaints/`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) throw new Error("Failed to fetch complaints");

    const complaints = await response.json();
    complaintSection.innerHTML = "";

    if (complaints.length === 0) {
      complaintSection.innerHTML = "<p>No complaints found.</p>";
      return;
    }

    for (const complaint of complaints) {

      /* ===== COMMENT COUNT ===== */
      let commentCount = 0;
      try {
        const cRes = await fetch(
          `${API_BASE_URL}/complaints/${complaint.id}/comments`
        );
        if (cRes.ok) {
          const comments = await cRes.json();
          commentCount = comments.length;
        }
      } catch {}

      const complaintBox = document.createElement("div");
      complaintBox.classList.add("complaint-box");

      /* ===== STATUS ===== */
      const statusLower = (complaint.status || "pending").toLowerCase();
      let statusText = "Pending";

      if (statusLower === "in progress") {
        statusText = "In Progress";
      } else if (statusLower === "resolved") {
        statusText = "Resolved";
      }

      const imageSrc = complaint.image_url || "../images/icon1.png";

      complaintBox.innerHTML = `
        <div class="complaint-content">
          <div class="details">

            <h2 class="problem-title">Problem: ${complaint.problem_type}</h2>

            <p><strong>District:</strong> ${complaint.district}</p>
            <p><strong>Village:</strong> ${complaint.village}</p>

            <p><strong>Date:</strong>
              ${complaint.created_at
                ? new Date(complaint.created_at).toLocaleDateString()
                : "N/A"}
            </p>

            <p><strong>Description:</strong>
              ${complaint.description || "No description provided"}
            </p>

            <p><strong>Status:</strong> ${statusText}</p>

            <!-- SUPPORT -->
            <div class="action-row">
              <span class="action-label">Support</span>
              <span class="action-count">${complaint.votes || 0}</span>
            </div>

            <!-- COMMENT -->
            <div class="action-row">
              <span class="action-label">Comment</span>
              <span class="action-count">${commentCount}</span>
            </div>

          </div>

          <div class="image">
            <img src="${imageSrc}" alt="Complaint Image">
          </div>
        </div>
      `;

      complaintSection.appendChild(complaintBox);
    }

  } catch (error) {
    console.error(error);
    complaintSection.innerHTML = "<p>Error loading complaints.</p>";
  }
});
