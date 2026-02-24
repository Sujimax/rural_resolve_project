// ===============================
// CUSTOM FIX WORDS (IMPORTANT)
// ===============================

const customTamilWords = {
    "Home": "முகப்பு",
    "Login": "உள்நுழைவு",
    "Register": "பதிவு",
    "Contact": "தொடர்பு"
};
\
function translatePage(language) {

    if (language === "en") {
        localStorage.removeItem("selectedLanguage");
        location.reload();
        return;
    }

    if (language === "ta") {
        localStorage.setItem("selectedLanguage", "ta");
        applyTamil();
    }
}


// ===============================
// APPLY TAMIL
// ===============================

function applyTamil() {

    document.body.classList.add("tamil-mode");

    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );

    while (walker.nextNode()) {

        const node = walker.currentNode;

      {

            const originalText = node.nodeValue.trim();

            // 🔥 FIRST CHECK CUSTOM WORD
            if (customTamilWords[originalText]) {
                node.nodeValue = customTamilWords[originalText];
                continue; // skip google translate
            }

            // 🔥 OTHERWISE USE GOOGLE API
            fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=ta&dt=t&q=${encodeURIComponent(originalText)}`)
                .then(res => res.json())
                .then(data => {
                    if (data && data[0] && data[0][0]) {
                        node.nodeValue = data[0][0][0];
                    }
                })
                .catch(err => console.log(err));
        }
    }
}


// ===============================
// DOM READY
// ===============================

document.addEventListener("DOMContentLoaded", function () {

    const langIcon = document.getElementById("langIcon");
    const dropdown = document.getElementById("languageDropdown");

    if (langIcon && dropdown) {

        langIcon.addEventListener("click", function (e) {
            e.stopPropagation();
            dropdown.classList.toggle("show");
        });

        document.addEventListener("click", function (e) {
            if (!e.target.closest(".language")) {
                dropdown.classList.remove("show");
            }
        });
    }

    const savedLanguage = localStorage.getItem("selectedLanguage");

    if (savedLanguage === "ta") {
        setTimeout(() => {
            applyTamil();
        }, 600);
    }

});
