document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  const payload = JSON.parse(atob(token.split(".")[1]));
  if (payload.role !== "admin") {
    alert("❌ You are not authorized to view this page");
    window.location.href = "dashboard.html";
    return;
  }

  // Fetch complaints
  const tableBody = document.querySelector("#complaints-table tbody");
  try {
    const res = await fetch(`${API_BASE_URL}/complaints/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Failed to fetch complaints");
    const complaints = await res.json();

    tableBody.innerHTML = "";
    complaints.forEach(c => {
      tableBody.innerHTML += `<tr>
        <td>${c.id}</td>
        <td>${c.problem_type}</td>
        <td>${c.name || c.user_name || "N/A"}</td>
        <td>${c.district}</td>
        <td>${c.votes || 0}</td>
        <td>${c.description}</td>
        <td>${new Date(c.created_at).toLocaleDateString()}</td>
        <td><img src="${c.image_url ? API_BASE_URL + '/' + c.image_url : '../images/icon1.png'}" width="50"></td>
        <td>${c.status || "Pending"}</td>
      </tr>`;
    });

  } catch (err) {
    console.error(err);
    tableBody.innerHTML = `<tr><td colspan="10">Error loading complaints</td></tr>`;
  }
});
