import API_BASE_URL from "./config.js";

document.addEventListener("DOMContentLoaded", () => {

  const form = document.querySelector("form");
  const token = localStorage.getItem("access_token");

  if (!token) {
    alert("You must be logged in to submit a complaint!");
    window.location.href = "login.html";
    return;
  }

  /* =========================
     PROBLEM TYPE (Other)
  ========================= */

  const problemSelect = document.getElementById("problem-name");
  const problemOtherInput = document.getElementById("problem-other");

  problemSelect.addEventListener("change", () => {
    if (problemSelect.value === "other") {
      problemOtherInput.style.display = "block";
      problemOtherInput.required = true;
    } else {
      problemOtherInput.style.display = "none";
      problemOtherInput.required = false;
      problemOtherInput.value = "";
    }
  });

  /* =========================
     DISTRICT → VILLAGE
  ========================= */

  const villagesByDistrict = {
    Thiruvallur: ["Uthukottai","Katchur","Nandhi Mangalam","Periyapalayam","Seethanjery","Suloorpettai"],
    Chennai: ["Ananthapuram","Keelapatti","Madhavaram","Velachery","Tondiarpet","Tambaram","Adyar","Mylapore"],
    Coimbatore: ["Perur","Sulur","Annur","Kovai","Vellalore","Vadavalli","Palladam"],
    Madurai: ["Melur","Vadipatti","Usilampatti","Thirumangalam","Peraiyur","Kottampatti","Samayanallur"],
    Salem: ["Attur","Mettur","Yercaud","Edappadi","Omalur","Salem North","Salem South"],
    Tiruchirappalli: ["Srirangam","Lalgudi","Thuraiyur","Manapparai","Musiri","Thottiyam"],
    Erode: ["Gobichettipalayam","Perundurai","Chennimalai","Erode Town","Modakurichi"],
    Nilgiris: ["Ooty","Coonoor","Kotagiri","Gudalur","Udhagamandalam"],
    Thanjavur: ["Kumbakonam","Papanasam","Thiruvaiyaru","Orathanadu","Thanjavur Town"],
    Tuticorin: ["Thoothukudi","Sattankulam","Vilathikulam","Srivaikundam","Kovilpatti"],
    Villupuram: ["Villupuram","Thiruvennainallur","Tindivanam","Kandamangalam"],
    Kanchipuram: ["Kanchipuram","Sriperumbudur","Uthiramerur","Chengalpattu"],
    Dharmapuri: ["Dharmapuri","Harur","Palacode","Pappireddipatti"]
  };

  const districtSelect = document.getElementById("district");
  const villageSelect = document.getElementById("village");

  districtSelect.innerHTML = `<option value="">-- Select District --</option>`;
  Object.keys(villagesByDistrict).forEach(d => {
    const opt = document.createElement("option");
    opt.value = d;
    opt.textContent = d;
    districtSelect.appendChild(opt);
  });

  districtSelect.addEventListener("change", () => {
    villageSelect.innerHTML = `<option value="">-- Select Village --</option>`;
    (villagesByDistrict[districtSelect.value] || []).forEach(v => {
      const opt = document.createElement("option");
      opt.value = v;
      opt.textContent = v;
      villageSelect.appendChild(opt);
    });
  });

  /* =========================
     FORM SUBMIT
  ========================= */

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const problemValue =
      problemSelect.value === "other"
        ? problemOtherInput.value.trim()
        : problemSelect.value;

    if (!problemValue) {
      alert("Please enter problem type");
      return;
    }

    const formData = new FormData();
    formData.append("problem_type", problemValue);
    formData.append("description", document.getElementById("description").value);
    formData.append("district", districtSelect.value);
    formData.append("village", villageSelect.value);
    formData.append("address", document.getElementById("address").value);

    const imageInput = document.getElementById("image");
    if (imageInput.files.length > 0) {
      formData.append("image", imageInput.files[0]);
    }

    try {
      const res = await fetch(`${API_BASE_URL}/complaints/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      alert("Complaint submitted successfully");
      form.reset();
      problemOtherInput.style.display = "none";

    } catch (error) {
      console.error(error);
      alert("Server error. Please try again.");
    }
  });
});
