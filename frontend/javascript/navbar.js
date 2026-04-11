document.addEventListener("DOMContentLoaded", () => {
  // ✅ Navbar toggle
  const menuBtn = document.getElementById("menuBtn");
  const navLinks = document.querySelector(".nav-links");
  const navRight = document.querySelector(".nav-right");

  if (menuBtn && navLinks && navRight) {
    menuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("show");
      navRight.classList.toggle("show");
    });

    document.querySelectorAll(".nav-links a, .nav-right a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("show");
        navRight.classList.remove("show");
      });
    });
  }

  // ✅ User name display (FIXED)
  const username = localStorage.getItem('user');

  if (username) {
    try {
      const userObj = JSON.parse(username);

      const userElement = document.getElementById('user');

      if (userElement && userObj.name) {
        userElement.textContent = userObj.name;
      }
    } catch (error) {
      console.error("Invalid user data in localStorage");
    }
  }
});



