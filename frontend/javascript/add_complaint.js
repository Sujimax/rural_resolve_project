import API_BASE_URL from "./config.js";

document.addEventListener("DOMContentLoaded", () => {

  // ✅ FIX 1: select form correctly
  const form = document.querySelector("form");

  const token = localStorage.getItem("access_token");
  if (!token) {
    alert("You must be logged in to submit a complaint!");
    window.location.href = "login.html";
    return;
  }

  /* =========================
     PROBLEM TYPE
  ========================= */
  const problemSelect = document.getElementById("problem-name");

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
     SUBMIT FORM
  ========================= */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!problemSelect.value) {
      alert("Please select problem type");
      return;
    }

    const formData = new FormData();
    formData.append("problem_type", problemSelect.value);
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
        alert("Failed to submit complaint");
        return;
      }

      alert("Complaint submitted successfully ✅");
      form.reset();

    } catch (err) {
      console.error(err);
      alert("Server error. Please try again.");
    }
  });
});
