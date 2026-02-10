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
    const response = await fetch(`${API_BASE_URL}/complaints/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) throw new Error("Failed to fetch complaints");

    const complaints = await response.json();
    complaintSection.innerHTML = "";

    if (complaints.length === 0) {
      complaintSection.innerHTML = "<p>No complaints submitted by you.</p>";
      return;
    }

    complaints.forEach((complaint) => {
      const complaintBox = document.createElement("div");
      complaintBox.classList.add("complaint-box");

      const statusLower = (complaint.status || "pending").toLowerCase();
      let statusClass = "status-pending";
      let statusText = "Pending";

      if (statusLower === "in progress") {
        statusClass = "status-in-progress";
        statusText = "In Progress";
      } else if (statusLower === "resolved") {
        statusClass = "status-resolved";
        statusText = "Resolved";
      }

      const imageSrc = complaint.image_url || "../images/icon1.png";

      complaintBox.innerHTML = `
  <div class="complaint-content">
    <div class="details">
      <h2 class="problem-title"> Problem Title :
        ${complaint.problem_type} 
        <span class="complaint-id">Complaint ID: ${complaint.id}</span>
      </h2>

      <p><strong>Date:</strong> ${new Date(complaint.created_at).toLocaleDateString()}</p>
      <p><strong>District:</strong> ${complaint.district}</p>
      <p><strong>Village:</strong> ${complaint.village}</p>
      <p><strong>Address:</strong> ${complaint.address}</p>
      <p><strong>Description:</strong> ${complaint.description}</p>
      <p><strong>Status:</strong> <span class="${statusClass}">${statusText}</span></p>
      <p><strong>Votes:</strong> ${complaint.votes || 0} 👍</p>
      <p><strong>Comments:</strong> ${complaint.comments_count}</p>

      <div class="action-section">
        <a href="edit_complaint.html?id=${complaint.id}" class="edit-btn">Edit</a>
        <button class="delete-btn" data-id="${complaint.id}">Delete</button>
      </div>
    </div>

    <div class="image">
      <img src="${imageSrc}" alt="Complaint Image">
    </div>
  </div>
`;

      complaintBox.querySelector(".delete-btn").addEventListener("click", async () => {
        if (!confirm("Do you want to delete this complaint?")) return;

        const res = await fetch(`${API_BASE_URL}/complaints/${complaint.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) complaintBox.remove();
        else alert("Failed to delete complaint");
      });

      complaintSection.appendChild(complaintBox);
    });
  } catch (err) {
    console.error(err);
    complaintSection.innerHTML = "<p>Error loading complaints</p>";
  }
});
