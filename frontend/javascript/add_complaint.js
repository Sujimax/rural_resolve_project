import API_BASE_URL from "./config.js";

document.addEventListener("DOMContentLoaded", () => {

  const form = document.querySelector("form");

  const token = localStorage.getItem("access_token");
  if (!token) {
    alert("You must be logged in to submit a complaint!");
    window.location.href = "login.html";
    return;
  }

  // --- District → Village mapping ---
  const villagesByDistrict = {
    Thiruvallur:["Uthukottai","Katchur","Nandhi Mangalam","Periyapalayam"],
    Chennai:["Ananthapuram","Keelapatti","Madhavaram","Velachery","Tondiarpet","Tambaram","Adyar","Mylapore"],
    Coimbatore:["Perur","Sulur","Annur","Kovai","Vellalore","Vadavalli","Palladam"],
    Madurai:["Melur","Vadipatti","Usilampatti","Thirumangalam","Peraiyur","Kottampatti","Samayanallur"],
    Salem:["Attur","Mettur","Yercaud","Edappadi","Omalur","Salem North","Salem South"],
    Tiruchirappalli:["Srirangam","Lalgudi","Thuraiyur","Manapparai","Musiri","Thottiyam"],
    Erode:["Gobichettipalayam","Perundurai","Chennimalai","Erode Town","Modakurichi"],
    Nilgiris:["Ooty","Coonoor","Kotagiri","Gudalur","Udhagamandalam"],
    Thanjavur:["Kumbakonam","Papanasam","Thiruvaiyaru","Orathanadu","Thanjavur Town"],
    Tuticorin:["Thoothukudi","Sattankulam","Vilathikulam","Srivaikundam","Kovilpatti"],
    Villupuram:["Villupuram","Thiruvennainallur","Tindivanam","Kandamangalam"],
    Kanchipuram:["Kanchipuram","Sriperumbudur","Uthiramerur","Chengalpattu"],
    Dharmapuri:["Dharmapuri","Harur","Palacode","Pappireddipatti"]
  };

  const districtSelect = document.getElementById("district");
  const villageSelect = document.getElementById("village");

  // Load districts
  districtSelect.innerHTML = `<option value="">-- Select District --</option>`;
  Object.keys(villagesByDistrict).forEach(d => {
    const opt = document.createElement("option");
    opt.value = d;
    opt.textContent = d;
    districtSelect.appendChild(opt);
  });

  // Load villages when district changes
  districtSelect.addEventListener("change", () => {
    villageSelect.innerHTML = `<option value="">-- Select Village --</option>`;
    (villagesByDistrict[districtSelect.value] || []).forEach(v => {
      const opt = document.createElement("option");
      opt.value = v;
      opt.textContent = v;
      villageSelect.appendChild(opt);
    });
  });

  // --- Submit Complaint ---
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("problem_type", document.getElementById("problem-name").value);
    formData.append("description", document.getElementById("description").value);
    formData.append("district", districtSelect.value);
    formData.append("village", villageSelect.value);
    formData.append("door_no", document.getElementById("doorno").value);

    const image = document.getElementById("image");
    if (image.files.length > 0) formData.append("image", image.files[0]);

    try {
      const res = await fetch(`${API_BASE_URL}/complaints/`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to submit complaint");
      }

      alert("Complaint submitted successfully ✅");
      form.reset();

    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  });

});
