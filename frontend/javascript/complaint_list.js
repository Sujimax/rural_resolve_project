document.addEventListener("DOMContentLoaded", async () => {
  const complaintSection = document.querySelector(".complaint-section");

  // Get JWT token for protected actions
  const token = localStorage.getItem("access_token");

  try {
    const response = await fetch("http://127.0.0.1:8000/complaints/", {
      headers: token ? { "Authorization": `Bearer ${token}` } : {}
    });

    if (!response.ok) throw new Error("Failed to fetch complaints");

    const complaints = await response.json();
    complaintSection.innerHTML = "";

    if (complaints.length === 0) {
      complaintSection.innerHTML = "<p>No complaints found.</p>";
      return;
    }

    complaints.forEach((complaint) => {
      const complaintBox = document.createElement("div");
      complaintBox.classList.add("complaint-box");

      const statusLower = (complaint.status || "Pending").toLowerCase();

      let statusClass;

      if (statusLower === "pending") {
        statusClass = "status-pending";
      } else if (statusLower === "in progress") {
        statusClass = "status-in-progress";
      } else {
        statusClass = "status-solved";
      }

      /* ---------- IMAGE ---------- */
      const imageSrc = complaint.image_url
        ? `http://127.0.0.1:8000/${complaint.image_url}`
        : "../../images/icon1.png";

      complaintBox.innerHTML = `
        <div class="complaint-content">
          <div class="details">
            <h2 class="problem-title">Problem: ${complaint.problem_type}</h2>

            <p><strong>District:</strong> ${complaint.district}</p>
            <p><strong>Village:</strong> ${complaint.village}</p>

            <p><strong>Date:</strong> ${
              complaint.created_at
                ? new Date(complaint.created_at).toLocaleDateString()
                : "N/A"
            }</p>

            <p><strong>Description:</strong> ${
              complaint.description || "No description provided"
            }</p>

            <p>
              <strong>Status:</strong>
              <span class="${statusClass}">
                ${complaint.status || "Pending"}
              </span>
            </p>

            <p>
              <strong>Votes:</strong>
              <span class="vote-count">${complaint.votes || 0}</span>
            </p>

            <div class="vote-section">
              <button class="btn vote-btn">👍 Support</button>
              <a href="comment.html?id=${complaint.id}" class="btn comment-btn">
                Comment
              </a>
            </div>
          </div>

          <div class="image">
            <img src="${imageSrc}" alt="Complaint Image">
          </div>
        </div>
      `;

      /* ---------- VOTING ---------- */
      const voteBtn = complaintBox.querySelector(".vote-btn");
      const voteCount = complaintBox.querySelector(".vote-count");

      voteBtn.addEventListener("click", async () => {
        if (!token) {
          alert("You must be logged in to vote!");
          return;
        }

        try {
          const voteResponse = await fetch(
            `http://127.0.0.1:8000/complaints/${complaint.id}/vote`,
            {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${token}`
              }
            }
          );

          if (!voteResponse.ok) throw new Error("Vote failed");

          voteCount.textContent = parseInt(voteCount.textContent) + 1;
        } catch (err) {
          alert("Error voting. Please try again.");
          console.error(err);
        }
      });

      complaintSection.appendChild(complaintBox);
    });

  } catch (error) {
    console.error(error);
    complaintSection.innerHTML = "<p>Error loading complaints.</p>";
  }
});
