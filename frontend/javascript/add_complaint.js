document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  // -------- GET JWT TOKEN --------
  const token = localStorage.getItem("access_token"); // token from login
  if (!token) {
    alert("You must be logged in to submit a complaint!");
    window.location.href = "login.html";
    return;
  }

  // -------- DISTRICT → VILLAGE (Tamil Nadu) --------
  const villagesByDistrict = {
    Thiruvallur:["Uthukottai","Katchur","Nandhi Mangalam","Periyapalayam"],
    Chennai: ["Ananthapuram", "Keelapatti", "Madhavaram", "Velachery", "Tondiarpet", "Tambaram", "Adyar", "Mylapore"],
    Coimbatore: ["Perur", "Sulur", "Annur", "Kovai", "Vellalore", "Vadavalli", "Palladam"],
    Madurai: ["Melur", "Vadipatti", "Usilampatti", "Thirumangalam", "Peraiyur", "Kottampatti", "Samayanallur"],
    Salem: ["Attur", "Mettur", "Yercaud", "Edappadi", "Omalur", "Salem North", "Salem South"],
    Tiruchirappalli: ["Srirangam", "Lalgudi", "Thuraiyur", "Manapparai", "Musiri", "Thottiyam"],
    Erode: ["Gobichettipalayam", "Perundurai", "Chennimalai", "Erode Town", "Modakurichi"],
    Nilgiris: ["Ooty", "Coonoor", "Kotagiri", "Gudalur", "Udhagamandalam"],
    Thanjavur: ["Kumbakonam", "Papanasam", "Thiruvaiyaru", "Orathanadu", "Thanjavur Town"],
    Tuticorin: ["Thoothukudi", "Sattankulam", "Vilathikulam", "Srivaikundam", "Kovilpatti"],
    Villupuram: ["Villupuram", "Thiruvennainallur", "Tindivanam", "Kandamangalam"],
    Kanchipuram: ["Kanchipuram", "Sriperumbudur", "Uthiramerur", "Chengalpattu"],
    Dharmapuri: ["Dharmapuri", "Harur", "Palacode", "Pappireddipatti"]
  };

  const districtSelect = document.getElementById("district");
  const villageSelect = document.getElementById("village");
      
  districtSelect.innerHTML = `<option value="">-- Select District --</option>`;
  Object.keys(villagesByDistrict).forEach((district) => {
    const option = document.createElement("option");
    option.value = district;
    option.textContent = district;
    districtSelect.appendChild(option);
  });

  districtSelect.addEventListener("change", () => {
    villageSelect.innerHTML = `<option value="">-- Select Village --</option>`;
    const villages = villagesByDistrict[districtSelect.value] || [];
    villages.forEach(village => {
      const option = document.createElement("option");
      option.value = village;
      option.textContent = village;
      villageSelect.appendChild(option);
    });
  });

  // -------- FORM SUBMIT --------
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData();
    // formData.append("name", document.getElementById("name").value);
    formData.append("problem_type", document.getElementById("problem-name").value);
    formData.append("description", document.getElementById("description").value);
    formData.append("district", districtSelect.value);
    formData.append("village", villageSelect.value);
    formData.append("door_no", document.getElementById("doorno").value);

    const imageInput = document.getElementById("image");
    if (imageInput && imageInput.files.length > 0) {
      formData.append("image", imageInput.files[0]);
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/complaints/", {
        method: "POST",
        body: formData,
        headers: {
          "Authorization": `Bearer ${token}` // Send JWT token
        }
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Failed to submit complaint ❌");
      }

      alert("Complaint submitted successfully ✅");
      form.reset();

    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  });
});
