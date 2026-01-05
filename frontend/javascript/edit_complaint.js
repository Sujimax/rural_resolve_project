import API_BASE_URL from "./config.js";

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("editComplaintForm");
  const id = new URLSearchParams(location.search).get("id");
  const token = localStorage.getItem("access_token");

  if (!token) return (location.href = "login.html");

  const res = await fetch(`${API_BASE_URL}/complaints/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const c = await res.json();
  form.problem_type.value = c.problem_type;
  form.description.value = c.description;
  form.district.value = c.district;
  form.village.value = c.village;
  form.door_no.value = c.door_no;

  form.addEventListener("submit", async e => {
    e.preventDefault();

    await fetch(`${API_BASE_URL}/complaints/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        problem_type: form.problem_type.value,
        description: form.description.value,
        district: form.district.value,
        village: form.village.value,
        door_no: form.door_no.value
      })
    });

    location.href = "my_complaint.html";
  });
});
