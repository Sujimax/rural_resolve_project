import API_BASE_URL from "./config.js";

document.addEventListener("DOMContentLoaded", () => {

  const form = document.querySelector("form");
  const token = localStorage.getItem("access_token");
  if (!token) {
    alert("You must be logged in to submit a complaint!");
    window.location.href = "login.html";
    return;
  }

  // Problem Type "Other" input handling
  const problemSelect = document.getElementById("problem-name");
  const otherContainer = document.getElementById("other-problem-container");
  const otherInput = document.getElementById("other-problem");

  problemSelect.addEventListener("change", () => {
    if (problemSelect.value === "other") {
      otherContainer.style.display = "block";
      otherInput.required = true;
    } else {
      otherContainer.style.display = "none";
      otherInput.required = false;
    }
  });

  // District -> Village mapping
  const villagesByDistrict = {
    Thiruvallur: ["Uthukottai","Katchur","Nandhi Mangalam","Periyapalayam","Seethanjery","suloorpettai"],
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

  // Load districts
  districtSelect.innerHTML = `<option value="">-- Select District --</option>`;
  Object.keys(villagesByDistrict).forEach(district => {
    const option = document.createElement("option");
    option.value = district;
    option.textContent = district;
    districtSelect.appendChild(option);
  });

  districtSelect.addEventListener("change", () => {
    villageSelect.innerHTML = `<option value="">-- Select Village --</option>`;
    (villagesByDistrict[districtSelect.value] || []).forEach(village => {
      const option = document.createElement("option");
      option.value = village;
      option.textContent = village;
      villageSelect.appendChild(option);
    });
  });

  // Form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const problemType = problemSelect.value === "other" ? otherInput.value : problemSelect.value;

    const formData = new FormData();
    formData.append("problem_type", problemType);
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
        const err = await res.json();
        throw new Error(err.detail || "Failed to submit complaint");
      }

      alert("Complaint submitted successfully");
      form.reset();
      otherContainer.style.display = "none";
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  });

});






// import API_BASE_URL from "./config.js";

// document.addEventListener("DOMContentLoaded", () => {

//   const form = document.querySelector("form");

//   const token = localStorage.getItem("access_token");
//   if (!token) {
//     alert("You must be logged in to submit a complaint!");
//     window.location.href = "login.html";
//     return;
//   }

//   const villagesByDistrict = {
//     Thiruvallur: ["Uthukottai","Katchur","Nandhi Mangalam","Periyapalayam","Seethanjery","suloorpettai"],
//     Chennai: ["Ananthapuram","Keelapatti","Madhavaram","Velachery","Tondiarpet","Tambaram","Adyar","Mylapore"],
//     Coimbatore: ["Perur","Sulur","Annur","Kovai","Vellalore","Vadavalli","Palladam"],
//     Madurai: ["Melur","Vadipatti","Usilampatti","Thirumangalam","Peraiyur","Kottampatti","Samayanallur"],
//     Salem: ["Attur","Mettur","Yercaud","Edappadi","Omalur","Salem North","Salem South"],
//     Tiruchirappalli: ["Srirangam","Lalgudi","Thuraiyur","Manapparai","Musiri","Thottiyam"],
//     Erode: ["Gobichettipalayam","Perundurai","Chennimalai","Erode Town","Modakurichi"],
//     Nilgiris: ["Ooty","Coonoor","Kotagiri","Gudalur","Udhagamandalam"],
//     Thanjavur: ["Kumbakonam","Papanasam","Thiruvaiyaru","Orathanadu","Thanjavur Town"],
//     Tuticorin: ["Thoothukudi","Sattankulam","Vilathikulam","Srivaikundam","Kovilpatti"],
//     Villupuram: ["Villupuram","Thiruvennainallur","Tindivanam","Kandamangalam"],
//     Kanchipuram: ["Kanchipuram","Sriperumbudur","Uthiramerur","Chengalpattu"],
//     Dharmapuri: ["Dharmapuri","Harur","Palacode","Pappireddipatti"]
//   };

//   const districtSelect = document.getElementById("district");
//   const villageSelect = document.getElementById("village");

//   // Load districts
//   districtSelect.innerHTML = `<option value="">-- Select District --</option>`;
//   Object.keys(villagesByDistrict).forEach(district => {
//     const option = document.createElement("option");
//     option.value = district;
//     option.textContent = district;
//     districtSelect.appendChild(option);
//   });

//   districtSelect.addEventListener("change", () => {
//     villageSelect.innerHTML = `<option value="">-- Select Village --</option>`;
//     (villagesByDistrict[districtSelect.value] || []).forEach(village => {
//       const option = document.createElement("option");
//       option.value = village;
//       option.textContent = village;
//       villageSelect.appendChild(option);
//     });
//   });

//   // Submit complaint
//   form.addEventListener("submit", async (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append("problem_type", document.getElementById("problem-name").value);
//     formData.append("description", document.getElementById("description").value);
//     formData.append("district", districtSelect.value);
//     formData.append("village", villageSelect.value);
//     formData.append("address", document.getElementById("address").value); // CHANGED

//     const imageInput = document.getElementById("image");
//     if (imageInput.files.length > 0) {
//       formData.append("image", imageInput.files[0]);
//     }

//     try {
//       const res = await fetch(`${API_BASE_URL}/complaints/`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`
//         },
//         body: formData
//       });

//       if (!res.ok) {
//         const err = await res.json();
//         throw new Error(err.detail || "Failed to submit complaint");
//       }

//       alert("Complaint submitted successfully");
//       form.reset();

//     } catch (error) {
//       console.error(error);
//       alert(error.message);
//     }
//   });

// });
