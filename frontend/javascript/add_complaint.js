const API_BASE_URL = "https://rural-resolve-project.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  // -------- GET JWT TOKEN --------
  const token = localStorage.getItem("access_token");

  if (!token) {
    alert("You must be logged in to submit a complaint!");
    window.location.href = "login.html";
    return;
  }

  // -------- DISTRICT → VILLAGE --------
  const villagesByDistrict = {
    Thiruvallur:["Uthukottai","Katchur","Nandhi Mangalam","Periyapalayam"],
    Chennai:["Ananthapuram","Keelapatti","Madhavaram","Velachery","Tondiarpet","Tambaram","Adyar","Mylapore"],
    Coimbatore:["Perur","Sulur","Annur","Kovai","Vellalore","Vadavalli","Palladam"],
    Madurai:["Melur","Vadipatti","Usilampatti","Thirumangalam","Peraiyur","Kottampatti","Samayanallur"],
    Salem:["Attur","Mettur","Yercaud","Edappadi","Omalur"],
    Tiruchirappalli:["Srirangam","Lalgudi","Thuraiyur","Manapparai"],
    Erode:["Gobichettipalayam","Perundurai","Chennimalai","Erode Town"],
    Nilgiris:["Ooty","Coonoor","Kotagiri"],
    Thanjavur:["Kumbakonam","Papanasam"],
    Tuticorin:["Thoothukudi","Sattankulam"],
    Villupuram:["Villupuram","Tindivanam"],
    Kanchipuram:["Kanchipuram","Sriperumbudur"],
    Dharmapuri:["Dharmapuri","Harur"]
  };

  const districtSelect = document.getElementById("district");
  const villageSelect = document.getElementById("village");

  districtSelect.innerHTML = `<option value="">-- Select District --</option>`;

  Object.keys(villagesByDistrict).forEach((district) => {
    const opt = document.createElement("option");
    opt.value = opt.textContent = district;
    districtSelect.appendChild(opt);
  });

  districtSelect.addEventListener("change", () => {
    villageSelect.innerHTML = `<option value="">-- Select Village --</option>`;
    (villagesByDistrict[districtSelect.value] || []).forEach(v => {
      const opt = document.createElement("option");
      opt.value = opt.textContent = v;
      villageSelect.appendChild(opt);
    });
  });

  // -------- SUBMIT --------
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("problem_type", document.getElementById("problem-name").value);
    formData.append("description", document.getElementById("description").value);
    formData.append("district", districtSelect.value);
    formData.append("village", villageSelect.value);
    formData.append("door_no", document.getElementById("doorno").value);

    const img = document.getElementById("image");
    if (img.files.length > 0) {
      formData.append("image", img.files[0]);
    }

    try {
      const res = await fetch(`${API_BASE_URL}/complaints/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.detail || "Failed to submit complaint");

      alert("Complaint submitted successfully ✅");
      form.reset();

    } catch (err) {
      alert(err.message);
    }
  });
});
