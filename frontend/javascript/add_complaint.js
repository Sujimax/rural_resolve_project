import API_BASE_URL from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("complaintForm");
  const token = localStorage.getItem("access_token");

  if (!token) {
    alert("You must be logged in to submit a complaint!");
    window.location.href = "login.html";
    return;
  }

  /* =========================
     PROBLEM TYPE (OTHER)
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

  Object.keys(villagesByDistrict).forEach(d => {
    const option = document.createElement("option");
    option.value = d;
    option.textContent = d;
    districtSelect.appendChild(option);
  });

  districtSelect.addEventListener("change", () => {
    villageSelect.innerHTML = `<option value="">-- Select Village --</option>`;
    (villagesByDistrict[districtSelect.value] || []).forEach(v => {
      const option = document.createElement("option");
      option.value = v;
      option.textContent = v;
      villageSelect.appendChild(option);
    });
  });

  /* =========================
     SUBMIT
  ========================= */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const problemType =
      problemSelect.value === "other"
        ? problemOtherInput.value.trim()
        : problemSelect.value;

    if (!problemType) {
      alert("Please enter problem type");
      return;
    }

    const formData = new FormData();
    formData.append("problem_type", problemType);
    formData.append("description", document.getElementById("description").value);
    formData.append("district", districtSelect.value);
    formData.append("village", villageSelect.value);
    formData.append("address", document.getElementById("address").value);

    const image = document.getElementById("image").files[0];
    if (image) formData.append("image", image);

    try {
      const res = await fetch(`${API_BASE_URL}/complaints/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (!res.ok) {
        const err = await res.text();
        console.error(err);
        throw new Error("Backend rejected request");
      }

      alert("Complaint submitted successfully ✅");
      form.reset();
      problemOtherInput.style.display = "none";

    } catch (err) {
      console.error(err);
      alert("Server error. Check backend running.");
    }
  });
});
