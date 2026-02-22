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

      // Status
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

      // Image
      const imageSrc = complaint.image_url || "../images/icon1.png";

      // Check if edited
      let dateText = new Date(complaint.created_at).toLocaleDateString();
      if (complaint.updated_at && complaint.updated_at !== complaint.created_at) {
        dateText += " (Edited)";
      }

      complaintBox.innerHTML = `
        <div class="complaint-content">
        <div class="details">
        <h2 class="problem-title"> Problem :
        ${complaint.problem_type} </h2>
        
      
<p><strong>Complaint ID :</strong> ( ${complaint.id} )</p>
      <p><strong>Date:</strong> ${dateText}</p>
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

      // Delete button
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
      // Apply Tamil again if selected
      const savedLang = localStorage.getItem("selectedLanguage");
      if (savedLang === "ta") {
        setTimeout(() => {
          translatePage("ta");
        }, 200);
      }

    });
  } catch (err) {
    console.error(err);
    complaintSection.innerHTML = "<p>Error loading complaints</p>";
  }
});



