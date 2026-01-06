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
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch complaints");
    }

    const complaints = await response.json();

    if (complaints.length === 0) {
      complaintSection.innerHTML = "<p>No complaints submitted by you.</p>";
      return;
    }

    complaintSection.innerHTML = "";

    complaints.forEach((complaint) => {
      const complaintBox = document.createElement("div");
      complaintBox.classList.add("complaint-box");

      const statusLower = (complaint.status || "Pending").toLowerCase();
      let statusClass =
        statusLower === "pending"
          ? "status-pending"
          : statusLower === "in progress"
          ? "status-in-progress"
          : "status-solved";

      complaintBox.innerHTML = `
        <div class="complaint-content">
          <div class="details">
            <h2 class="problem-title">Problem: ${complaint.problem_type}</h2>
            <p><strong>District:</strong> ${complaint.district}</p>
            <p><strong>Village:</strong> ${complaint.village}</p>
            <p><strong>Door No:</strong> ${complaint.door_no}</p>
            <p><strong>Description:</strong> ${complaint.description}</p>
            <p><strong>Status:</strong> 
              <span class="${statusClass}">
                ${complaint.status || "Pending"}
              </span>
            </p>
            <p><strong>Votes:</strong> ${complaint.votes || 0} 👍</p>
            <div class="action-section">
              <a href="edit_complaint.html?id=${complaint.id}" class="edit-btn">✏️ Edit</a>
              <button class="delete-btn" data-id="${complaint.id}">🗑️ Delete</button>
            </div>
          </div>
          <div class="image">
            <img src="${
              complaint.image_url
                ? `${API_BASE_URL}/${complaint.image_url}`
                : "../images/icon1.png"
            }" alt="Complaint Image">
          </div>
        </div>
      `;

      // DELETE
      complaintBox.querySelector(".delete-btn").addEventListener("click", async () => {
        if (!confirm("Do you want to delete this complaint?")) return;

        const res = await fetch(
          `${API_BASE_URL}/complaints/${complaint.id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (res.ok) {
          complaintBox.remove();
        } else {
          alert("Failed to delete complaint");
        }
      });

      complaintSection.appendChild(complaintBox);
    });

  } catch (err) {
    console.error(err);
    complaintSection.innerHTML = "<p>Error loading complaints</p>";
  }
});
