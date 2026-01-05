document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("editComplaintForm");
  const complaintId = new URLSearchParams(window.location.search).get("id");

  // Get JWT token
  const token = localStorage.getItem("access_token");
  if (!token) {
    alert("Please login first");
    window.location.href = "login.html";
    return;
  }

  // Fetch existing complaint data
  if (complaintId) {
    try {
      const res = await fetch(`http://127.0.0.1:8000/complaints/${complaintId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch complaint");
      const data = await res.json();

      // form.name.value = data.name;
      form.problem_type.value = data.problem_type;
      form.description.value = data.description;
      form.district.value = data.district;
      form.village.value = data.village;
      form.door_no.value = data.door_no;

    } catch (err) {
      console.error(err);
      alert("Error loading complaint");
    }
  }

  // Handle form submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const updatedData = {
      // name: form.name.value,
      problem_type: form.problem_type.value,
      description: form.description.value,
      district: form.district.value,
      village: form.village.value,
      door_no: form.door_no.value
    };

    try {
      const res = await fetch(`http://127.0.0.1:8000/complaints/${complaintId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to update complaint");

      alert("Updated successfully!");
      window.location.href = "my_complaint.html";

    } catch (err) {
      console.error(err);
      alert("Error updating complaint: " + err.message);
    }
  });
});
