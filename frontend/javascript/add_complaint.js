import API_BASE_URL from "./config.js";

document.addEventListener("DOMContentLoaded", () => {

  const form = document.querySelector("form");

  const token = localStorage.getItem("access_token");
  if (!token) {
    alert("You must be logged in to submit a complaint!");
    window.location.href = "login.html";
    return;
  }

  function replaceSelectWithInput(selectEl, placeholder) {
    const input = document.createElement("input");
    input.type = "text";
    input.id = selectEl.id;     
    input.name = selectEl.name; 
    input.required = true;
    input.placeholder = placeholder;

    selectEl.parentNode.replaceChild(input, selectEl);
    input.focus();
    return input;
  }

  let problemField = document.getElementById("problem-name");

  problemField.addEventListener("change", () => {
    if (problemField.value === "other") {
      problemField = replaceSelectWithInput(
        problemField,
        "Enter your problem type"
      );
    }
  });

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

  let districtField = document.getElementById("district");
  let villageField = document.getElementById("village");

  // fill districts
  Object.keys(villagesByDistrict).forEach(d => {
    const opt = document.createElement("option");
    opt.value = d;
    opt.textContent = d;
    districtField.appendChild(opt);
  });
  districtField.appendChild(new Option("Other", "other"));

  districtField.addEventListener("change", () => {

    if (districtField.value === "other") {
      districtField = replaceSelectWithInput(
        districtField,
        "Enter your district"
      );
      villageField = replaceSelectWithInput(
        villageField,
        "Enter your village"
      );
      return;
    }

    villageField.innerHTML = `<option value="">-- Select Village --</option>`;
    villagesByDistrict[districtField.value].forEach(v => {
      const opt = document.createElement("option");
      opt.value = v;
      opt.textContent = v;
      villageField.appendChild(opt);
    });
    villageField.appendChild(new Option("Other", "other"));
  });

  villageField.addEventListener("change", () => {
    if (villageField.value === "other") {
      villageField = replaceSelectWithInput(
        villageField,
        "Enter your village"
      );
    }
  });

  /* =========================
     FORM SUBMIT
  ========================= */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("problem_type", problemField.value);
    formData.append("description", description.value);
    formData.append("district", districtField.value);
    formData.append("village", villageField.value);
    formData.append("address", address.value);

    if (image.files[0]) {
      formData.append("image", image.files[0]);
    }

    try {
      const res = await fetch(`${API_BASE_URL}/complaints/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (!res.ok) throw new Error("Failed");

      alert("Complaint submitted successfully ✅");
      form.reset();

    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  });

});


