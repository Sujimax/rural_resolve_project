import API_BASE_URL from "./config.js";

document.addEventListener("DOMContentLoaded", async () => {
  const section = document.querySelector(".complaint-section");

  const res = await fetch(`${API_BASE_URL}/complaints/`);
  const complaints = await res.json();

  complaints.forEach(c => {
    const img = c.image_url
      ? `${API_BASE_URL}/${c.image_url}`
      : "../../images/icon1.png";

    section.innerHTML += `
      <div>
        <h3>${c.problem_type}</h3>
        <img src="${img}">
      </div>
    `;
  });
});
