document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("menuBtn");
  const navLinks = document.querySelector(".nav-links");
  const navRight = document.querySelector(".nav-right");

  menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("show");
    navRight.classList.toggle("show");
  });

  document.querySelectorAll(".nav-links a, .nav-right a")
    .forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("show");
        navRight.classList.remove("show");
      });
    });
});
