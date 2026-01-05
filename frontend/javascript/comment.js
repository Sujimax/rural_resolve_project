document.addEventListener("DOMContentLoaded", () => {
  const complaintId = new URLSearchParams(window.location.search).get("id");
  if (!complaintId) {
    alert("No complaint ID found");
    return;
  }

  /* ---------------- ELEMENTS ---------------- */
  const problemTypeEl = document.getElementById("problemType");
  const districtEl = document.getElementById("district");
  const villageEl = document.getElementById("village");
  const dateEl = document.getElementById("date");
  const descriptionEl = document.getElementById("description");
  const voteEl = document.getElementById("vote");
  const problemImageEl = document.getElementById("problemImage");

  const commentsContainer = document.getElementById("commentsContainer");
  const commentText = document.getElementById("commentText");
  const postBtn = document.getElementById("postComment");

  /* ---------------- AUTH ---------------- */
  const token = localStorage.getItem("access_token");
  let userId = null;

  // ✅ Decode JWT to get user_id
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      userId = payload.user_id;
    } catch (err) {
      console.error("Invalid token");
    }
  }

  /* ---------------- ENABLE INPUT ---------------- */
  if (token && userId) {
    commentText.disabled = false;
    postBtn.disabled = false;
  } else {
    commentText.disabled = true;
    postBtn.disabled = true;
    commentsContainer.innerHTML = "<p>Please login to comment</p>";
  }

  /* ---------------- LOAD COMPLAINT ---------------- */
  async function loadComplaint() {
    try {
      const res = await fetch(`http://127.0.0.1:8000/complaints/${complaintId}`);
      if (!res.ok) throw new Error("Failed to load complaint");

      const c = await res.json();

      problemTypeEl.textContent = "Problem: " + c.problem_type;
      districtEl.textContent = c.district;
      villageEl.textContent = c.village;
      dateEl.textContent = new Date(c.created_at).toLocaleDateString();
      descriptionEl.textContent = c.description || "N/A";
      voteEl.textContent = c.votes || "0 votes"
      problemImageEl.src = c.image_url
        ? `http://127.0.0.1:8000/${c.image_url}`
        : "../../images/icon1.png";

    } catch (err) {
      console.error(err);
    }
  }

  /* ---------------- LOAD COMMENTS ---------------- */
  async function loadComments() {
    try {
      const res = await fetch(`http://127.0.0.1:8000/complaints/${complaintId}/comments`);
      if (!res.ok) throw new Error("Failed to load comments");

      const comments = await res.json();
      commentsContainer.innerHTML = "";

      if (!comments.length) {
        commentsContainer.innerHTML = "<p>No comments yet</p>";
        return;
      }

      comments.forEach(c => {
        const div = document.createElement("div");
        div.className = "comment-box";

        div.innerHTML = `
          <h4><strong>User Name : </strong>${c.user_name}</h4>
          <p><strong>Comment : </strong>${c.content}</p>
          <small>${new Date(c.created_at).toLocaleString()}</small>
          ${userId === c.user_id ? `<button class="delete-comment" data-id="${c.id}">Delete</button>` : ""}
        `;

        commentsContainer.appendChild(div);
      });

    } catch (err) {
      console.error(err);
    }
  }

  /* ---------------- POST COMMENT ---------------- */
  postBtn.addEventListener("click", async () => {
    const content = commentText.value.trim();
    if (!content) return alert("Comment cannot be empty");

    try {
      const res = await fetch(`http://127.0.0.1:8000/complaints/${complaintId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          complaint_id: Number(complaintId),
          content
        })
      });

      if (!res.ok) throw new Error("Failed to post");

      commentText.value = "";
      loadComments();

    } catch (err) {
      alert(err.message);
    }
  });

  /* ---------------- DELETE COMMENT ---------------- */
  commentsContainer.addEventListener("click", async (e) => {
    if (!e.target.classList.contains("delete-comment")) return;

    const id = e.target.dataset.id;
    if (!confirm("Delete this comment?")) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/complaints/comments/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Delete failed");
      loadComments();

    } catch (err) {
      alert(err.message);
    }
  });

  /* ---------------- INIT ---------------- */
  loadComplaint();
  loadComments();
});
