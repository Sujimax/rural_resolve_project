import API_BASE_URL from "./config.js";

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    alert("Please login as admin");
    window.location.href = "login.html";
    return;
  }

  // Decode token safely
  let payload;
  try {
    payload = JSON.parse(atob(token.split(".")[1]));
  } catch (err) {
    alert("Invalid token, please login again");
    localStorage.removeItem("access_token");
    window.location.href = "login.html";
    return;
  }

  if (payload.role !== "admin") {
    alert("Unauthorized");
    window.location.href = "dashboard.html";
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const complaintId = params.get("id");
  if (!complaintId) {
    alert("Complaint ID missing");
    return;
  }

  // DOM Elements
  const userIdEl = document.getElementById("userId");
  const nameEl = document.getElementById("name");
  const mobileEl = document.getElementById("mobile");
  const emailEl = document.getElementById("email");
  const complaintIdEl = document.getElementById("complaintId");
  const problemEl = document.getElementById("problem");
  const descriptionEl = document.getElementById("description");
  const districtEl = document.getElementById("district");
  const villageEl = document.getElementById("village");
  const addressEl = document.getElementById("address");
  const votesEl = document.getElementById("votes");
  const dateEl = document.getElementById("date");
  const currentStatusEl = document.getElementById("currentStatus");
  const statusSelect = document.getElementById("statusSelect");
  const updateStatusBtn = document.getElementById("updateStatus");
  const complaintImageEl = document.getElementById("complaintImage");
  const deleteBtn = document.getElementById("deleteComplaint");

  // ✅ FIXED: Update status badge to include "resolved"
  function updateStatusBadge(status) {
    currentStatusEl.className = "status-badge"; // reset

    const statusText = (status || "pending").toLowerCase();

    if (statusText === "in progress") {
      currentStatusEl.classList.add("status-in-progress");
    } else if (statusText === "resolved") {
      currentStatusEl.classList.add("status-resolved"); // <-- green now
    } else {
      currentStatusEl.classList.add("status-pending");
    }

    // Capitalize first letter for display
    currentStatusEl.textContent =
      statusText.charAt(0).toUpperCase() + statusText.slice(1);
  }

  // Fetch complaint details
  async function fetchComplaint() {
    try {
      const res = await fetch(`${API_BASE_URL}/complaints/${complaintId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch complaint");

      const c = await res.json();

      userIdEl.textContent = c.user_id || "N/A";
      nameEl.textContent = c.user_name || "N/A";
      mobileEl.textContent = c.phone || "N/A";
      emailEl.textContent = c.email || "N/A";
      complaintIdEl.textContent = c.id;
      problemEl.textContent = c.problem_type || "N/A";
      descriptionEl.textContent = c.description || "N/A";
      districtEl.textContent = c.district || "N/A";
      villageEl.textContent = c.village || "N/A";
      addressEl.textContent = c.address || "N/A";
      votesEl.textContent = c.votes || 0;
      dateEl.textContent = new Date(c.created_at).toLocaleDateString();
      complaintImageEl.src = c.image_url || "../images/icon1.png";

      statusSelect.value = (c.status || "pending").toLowerCase();
      updateStatusBadge(c.status || "Pending");
    } catch (err) {
      alert("Error loading complaint");
      console.error(err);
    }
  }

  // ✅ FIXED: Update complaint status and send email
  updateStatusBtn.addEventListener("click", async () => {
    const newStatus = statusSelect.value;

    try {
      // Update status in backend
      const res = await fetch(`${API_BASE_URL}/admin/complaints/${complaintId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Update failed");

      updateStatusBadge(newStatus);

      // ✅ EmailJS: initialize here to ensure SDK is ready
      if (!window.emailjs) {
        alert("EmailJS SDK not loaded");
        return;
      }

      // Send email
      const templateParams = {
        user_name: nameEl.textContent,
        complaint_id: complaintIdEl.textContent,
        status: newStatus,
        email_to: emailEl.textContent,
      };

      emailjs
        .send("service_lrkjfeo", "template_cq2r65r", templateParams)
        .then(
          () => {
            alert("Status updated and email sent successfully!");
          },
          (error) => {
            console.error("Email sending error:", error);
            alert("Status updated but email failed to send");
          }
        );
    } catch (err) {
      alert("Error updating status");
      console.error(err);
    }
  });

  // Delete complaint
  deleteBtn.addEventListener("click", async () => {
    if (!confirm("Delete this complaint?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/admin/complaints/${complaintId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Delete failed");

      alert("Deleted successfully");
      window.location.href = "admin.html";
    } catch (err) {
      alert("Delete error");
      console.error(err);
    }
  });

  fetchComplaint();
});







// import API_BASE_URL from "./config.js";

// document.addEventListener("DOMContentLoaded", async () => {
//   const token = localStorage.getItem("access_token");
//   if (!token) {
//     alert("Please login as admin");
//     window.location.href = "login.html";
//     return;
//   }

//   // Decode token safely
//   let payload;
//   try {
//     payload = JSON.parse(atob(token.split(".")[1]));
//   } catch (err) {
//     alert("Invalid token, please login again");
//     localStorage.removeItem("access_token");
//     window.location.href = "login.html";
//     return;
//   }

//   if (payload.role !== "admin") {
//     alert("Unauthorized");
//     window.location.href = "dashboard.html";
//     return;
//   }

//   const params = new URLSearchParams(window.location.search);
//   const complaintId = params.get("id");
//   if (!complaintId) {
//     alert("Complaint ID missing");
//     return;
//   }

//   // DOM Elements
//   const userIdEl = document.getElementById("userId");
//   const nameEl = document.getElementById("name");
//   const mobileEl = document.getElementById("mobile");
//   const emailEl = document.getElementById("email");
//   const complaintIdEl = document.getElementById("complaintId");
//   const problemEl = document.getElementById("problem");
//   const descriptionEl = document.getElementById("description");
//   const districtEl = document.getElementById("district");
//   const villageEl = document.getElementById("village");
//   const addressEl = document.getElementById("address");
//   const votesEl = document.getElementById("votes");
//   const dateEl = document.getElementById("date");
//   const currentStatusEl = document.getElementById("currentStatus");
//   const statusSelect = document.getElementById("statusSelect");
//   const updateStatusBtn = document.getElementById("updateStatus");
//   const complaintImageEl = document.getElementById("complaintImage");
//   const deleteBtn = document.getElementById("deleteComplaint");

//   // ✅ FIXED: Update status badge to include "resolved"
//   function updateStatusBadge(status) {
//     currentStatusEl.className = "status-badge"; // reset

//     const statusText = (status || "pending").toLowerCase();

//     if (statusText === "in progress") {
//       currentStatusEl.classList.add("status-in-progress");
//     } else if (statusText === "resolved") {
//       currentStatusEl.classList.add("status-resolved"); // <-- green now
//     } else {
//       currentStatusEl.classList.add("status-pending");
//     }

//     // Capitalize first letter for display
//     currentStatusEl.textContent = statusText.charAt(0).toUpperCase() + statusText.slice(1);
//   }

//   // Fetch complaint details
//   async function fetchComplaint() {
//     try {
//       const res = await fetch(`${API_BASE_URL}/complaints/${complaintId}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (!res.ok) throw new Error("Failed to fetch complaint");

//       const c = await res.json();

//       userIdEl.textContent = c.user_id || "N/A";
//       nameEl.textContent = c.user_name || "N/A";
//       mobileEl.textContent = c.phone || "N/A";
//       emailEl.textContent = c.email || "N/A";
//       complaintIdEl.textContent = c.id;
//       problemEl.textContent = c.problem_type || "N/A";
//       descriptionEl.textContent = c.description || "N/A";
//       districtEl.textContent = c.district || "N/A";
//       villageEl.textContent = c.village || "N/A";
//       addressEl.textContent = c.address || "N/A";
//       votesEl.textContent = c.votes || 0;
//       dateEl.textContent = new Date(c.created_at).toLocaleDateString();
//       complaintImageEl.src = c.image_url || "../images/icon1.png";

//       statusSelect.value = (c.status || "pending").toLowerCase();
//       updateStatusBadge(c.status || "Pending");

//     } catch (err) {
//       alert("Error loading complaint");
//       console.error(err);
//     }
//   }

//   // Update complaint status and send email
//   updateStatusBtn.addEventListener("click", async () => {
//     try {
//       const res = await fetch(`${API_BASE_URL}/admin/complaints/${complaintId}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify({ status: statusSelect.value })
//       });

//       if (!res.ok) throw new Error("Update failed");

//       updateStatusBadge(statusSelect.value);

//       const templateParams = {
//         user_name: nameEl.textContent,
//         complaint_id: complaintIdEl.textContent,
//         status: statusSelect.value,
//         email_to: emailEl.textContent
//       };

//       try {
//         await emailjs.send(
//           "service_lrkjfeo",
//           "template_cq2r65r",
//           templateParams
//         );
//         alert("Status updated and email sent successfully!");
//       } catch (emailErr) {
//         console.error("Email sending error:", emailErr);
//         alert("Status updated but email failed to send");
//       }

//     } catch (err) {
//       alert("Error updating status");
//       console.error(err);
//     }
//   });

//   // Delete complaint
//   deleteBtn.addEventListener("click", async () => {
//     if (!confirm("Delete this complaint?")) return;

//     try {
//       const res = await fetch(`${API_BASE_URL}/admin/complaints/${complaintId}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (!res.ok) throw new Error("Delete failed");

//       alert("Deleted successfully");
//       window.location.href = "admin.html";

//     } catch (err) {
//       alert("Delete error");
//       console.error(err);
//     }
//   });

//   fetchComplaint();
// });
