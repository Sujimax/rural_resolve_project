import API_BASE_URL from "./config.js";

document.addEventListener("DOMContentLoaded", async () => {
  const section = document.querySelector(".complaint-section");
  const token = localStorage.getItem("access_token");

  if (!token) {
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/complaints/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error();

    const complaints = await res.json();
    section.innerHTML = "";

    complaints.forEach(c => {
      const div = document.createElement("div");
      const img = c.image_url
        ? `${API_BASE_URL}/${c.image_url}`
        : "../images/icon1.png";

      div.innerHTML = `
        <h3>${c.problem_type}</h3>
        <p>${c.description}</p>
        <img src="${img}">
      `;
      section.appendChild(div);
    });
  } catch {
    section.innerHTML = "<p>Error loading complaints</p>";
  }
});
