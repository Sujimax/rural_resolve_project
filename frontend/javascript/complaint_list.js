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
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch complaints");
    }

    const complaints = await response.json();
    complaintSection.innerHTML = "";

    if (complaints.length === 0) {
      complaintSection.innerHTML = "<p>No complaints found.</p>";
      return;
    }

    complaints.forEach((complaint) => {
      const complaintBox = document.createElement("div");
      complaintBox.classList.add("complaint-box");

      // ===== STATUS LOGIC =====
      const statusLower = (complaint.status || "pending").toLowerCase();
      let statusClass;
      let statusText;

      if (statusLower === "pending") {
        statusClass = "status-pending";
        statusText = "Pending";
      } else if (statusLower === "in progress") {
        statusClass = "status-in-progress";
        statusText = "In Progress";
      } else if (statusLower === "resolved") {
        statusClass = "status-resolved";
        statusText = "Resolved";
      } else {
        statusClass = "status-pending";
        statusText = "Pending";
      }
      // ========================

      const imageSrc = complaint.image_url
        ? complaint.image_url
        : "../images/icon1.png";

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

            <p><strong>Description:</strong>
              ${complaint.description || "No description provided"}
            </p>

            <p>
              <strong>Status:</strong>
              <span class="${statusClass}">
                ${statusText}
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

      /* ===== VOTE FUNCTION ===== */
      const voteBtn = complaintBox.querySelector(".vote-btn");
      const voteCount = complaintBox.querySelector(".vote-count");

      voteBtn.addEventListener("click", async () => {
        try {
          const voteResponse = await fetch(
            `${API_BASE_URL}/complaints/${complaint.id}/vote`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );

          if (!voteResponse.ok) {
            throw new Error("Vote failed");
          }

          voteCount.textContent = parseInt(voteCount.textContent) + 1;

        } catch (err) {
          console.error(err);
          alert("Error voting. Please try again.");
        }
      });

      complaintSection.appendChild(complaintBox);
    });

  } catch (error) {
    console.error(error);
    complaintSection.innerHTML = "<p>Error loading complaints.</p>";
  }
});






// import API_BASE_URL from "./config.js";

// document.addEventListener("DOMContentLoaded", async () => {
//   const complaintSection = document.querySelector(".complaint-section");

//   const token = localStorage.getItem("access_token");

//   if (!token) {
//     alert("Please login first");
//     window.location.href = "login.html";
//     return;
//   }

//   try {
//     const response = await fetch(`${API_BASE_URL}/complaints/`, {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     });

//     if (!response.ok) {
//       throw new Error("Failed to fetch complaints");
//     }

//     const complaints = await response.json();
//     complaintSection.innerHTML = "";

//     if (complaints.length === 0) {
//       complaintSection.innerHTML = "<p>No complaints found.</p>";
//       return;
//     }

//     complaints.forEach((complaint) => {
//       const complaintBox = document.createElement("div");
//       complaintBox.classList.add("complaint-box");

//       const statusLower = (complaint.status || "pending").toLowerCase();
//       let statusClass;

//       if (statusLower === "pending") {
//         statusClass = "status-pending";
//       } else if (statusLower === "in progress") {
//         statusClass = "status-in-progress";
//       } else if (statusLower === "resolved") {
//         statusClass = "status-resolved";
//       } else {
//         statusClass = "status-pending";
//       }

//       const imageSrc = complaint.image_url
//         ? complaint.image_url
//         : "../images/icon1.png";

//       complaintBox.innerHTML = `
//         <div class="complaint-content">
//           <div class="details">
//             <h2 class="problem-title">Problem: ${complaint.problem_type}</h2>

//             <p><strong>District:</strong> ${complaint.district}</p>
//             <p><strong>Village:</strong> ${complaint.village}</p>

//             <p><strong>Date:</strong> ${
//               complaint.created_at
//                 ? new Date(complaint.created_at).toLocaleDateString()
//                 : "N/A"
//             }</p>

//             <p><strong>Description:</strong>
//               ${complaint.description || "No description provided"}
//             </p>

//             <p>
//               <strong>Status:</strong>
//               <span class="${statusClass}">
//                 ${complaint.status || "Pending"}
//               </span>
//             </p>

//             <p>
//               <strong>Votes:</strong>
//               <span class="vote-count">${complaint.votes || 0}</span>
//             </p>

//             <div class="vote-section">
//               <button class="btn vote-btn">👍 Support</button>
//               <a href="comment.html?id=${complaint.id}" class="btn comment-btn">
//                 Comment
//               </a>
//             </div>
//           </div>

//           <div class="image">
//             <img src="${imageSrc}" alt="Complaint Image">
//           </div>
//         </div>
//       `;

//       /* VOTE FUNCTION */
//       const voteBtn = complaintBox.querySelector(".vote-btn");
//       const voteCount = complaintBox.querySelector(".vote-count");

//       voteBtn.addEventListener("click", async () => {
//         try {
//           const voteResponse = await fetch(
//             `${API_BASE_URL}/complaints/${complaint.id}/vote`,
//             {
//               method: "POST",
//               headers: {
//                 Authorization: `Bearer ${token}`
//               }
//             }
//           );

//           if (!voteResponse.ok) {
//             throw new Error("Vote failed");
//           }

//           voteCount.textContent = parseInt(voteCount.textContent) + 1;

//         } catch (err) {
//           console.error(err);
//           alert("Error voting. Please try again.");
//         }
//       });

//       complaintSection.appendChild(complaintBox);
//     });

//   } catch (error) {
//     console.error(error);
//     complaintSection.innerHTML = "<p>Error loading complaints.</p>";
//   }
// });
