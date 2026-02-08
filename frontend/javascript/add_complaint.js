import API_BASE_URL from "./config.js";

document.addEventListener("DOMContentLoaded", () => {

  const form = document.querySelector("form");

  // ================= AUTH CHECK =================
  const token = localStorage.getItem("access_token");
  if (!token) {
    alert("You must be logged in to submit a complaint!");
    window.location.href = "login.html";
    return;
  }

  // ================= PROBLEM TYPE =================
  const problemSelect = document.getElementById("problem-name");
  const otherProblemInput = document.getElementById("other-problem");

  problemSelect.addEventListener("change", () => {
    if (problemSelect.value === "other") {
      otherProblemInput.style.display = "block";
      otherProblemInput.required = true;
    } else {
      otherProblemInput.style.display = "none";
      otherProblemInput.required = false;
      otherProblemInput.value = "";
    }
  });

  // ================= DISTRICT & VILLAGE =================
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

  const otherDistrictInput = document.getElementById("other-district");
  const otherVillageInput = document.getElementById("other-village");

  // Load districts
  districtSelect.innerHTML = `<option value="">-- Select District --</option>`;
  Object.keys(villagesByDistrict).forEach(district => {
    districtSelect.innerHTML += `<option value="${district}">${district}</option>`;
  });
  districtSelect.innerHTML += `<option value="other">Other</option>`;

  // District change
  districtSelect.addEventListener("change", () => {
    villageSelect.innerHTML = `<option value="">-- Select Village --</option>`;
    otherVillageInput.style.display = "none";
    otherVillageInput.required = false;
    otherVillageInput.value = "";

    if (districtSelect.value === "other") {
      otherDistrictInput.style.display = "block";
      otherDistrictInput.required = true;
      villageSelect.style.display = "none";
    } else {
      otherDistrictInput.style.display = "none";
      otherDistrictInput.required = false;
      otherDistrictInput.value = "";
      villageSelect.style.display = "block";

      (villagesByDistrict[districtSelect.value] || []).forEach(village => {
        villageSelect.innerHTML += `<option value="${village}">${village}</option>`;
      });
      villageSelect.innerHTML += `<option value="other">Other</option>`;
    }
  });

  // Village change
  villageSelect.addEventListener("change", () => {
    if (villageSelect.value === "other") {
      otherVillageInput.style.display = "block";
      otherVillageInput.required = true;
    } else {
      otherVillageInput.style.display = "none";
      otherVillageInput.required = false;
      otherVillageInput.value = "";
    }
  });

  // ================= FORM SUBMIT =================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const problemType =
      problemSelect.value === "other"
        ? otherProblemInput.value
        : problemSelect.value;

    const district =
      districtSelect.value === "other"
        ? otherDistrictInput.value
        : districtSelect.value;

    const village =
      villageSelect.value === "other"
        ? otherVillageInput.value
        : villageSelect.value;

    const formData = new FormData();
    formData.append("problem_type", problemType);
    formData.append("description", document.getElementById("description").value);
    formData.append("district", district);
    formData.append("village", village);
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
        const err = await res.json();
        throw new Error(err.detail || "Failed to submit complaint");
      }

      alert("Complaint submitted successfully");
      form.reset();

      otherProblemInput.style.display = "none";
      otherDistrictInput.style.display = "none";
      otherVillageInput.style.display = "none";

    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  });

});
