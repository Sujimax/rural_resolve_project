import API_BASE_URL from "./config.js";

document.addEventListener("DOMContentLoaded", async () => {
  const id = new URLSearchParams(location.search).get("id");

  const res = await fetch(`${API_BASE_URL}/complaints/${id}`);
  const c = await res.json();

  document.getElementById("problemType").textContent = c.problem_type;
});
