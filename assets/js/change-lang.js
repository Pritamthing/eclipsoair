const SUPPORTED_LANGUAGES = ["en", "fr", "ar"];
// i18next initialization and language handling
document.addEventListener("DOMContentLoaded", async function () {
  const lng = await resolveLanguage();
  fetch("assets/translations.csv")
    .then((res) => res.text())
    .then((csv) => {
      const translations = csvToJson(csv);
      const resources = convertToI18next(translations);

      // Initialize i18next AFTER resources are ready
      i18next.init(
        {
          lng: lng, // Default language
          debug: false,
          keySeparator: false, // dots are part of keys
          resources: resources,
        },
        function (err, t) {
          if (err) console.error("i18next init error:", err);
          updateContent(lng);
        },
      );

      function updateContent(lng) {
        if (document.getElementById("language")) {
          document.getElementById("language").innerText = lng.toUpperCase();
        }
        const dir = i18next.dir(lng);

        document.querySelectorAll("[data-i18n]").forEach((el) => {
          const key = el.getAttribute("data-i18n");
          el.innerHTML = i18next.t(key);
          // el.innerHTML = resources[lng]?.translation[key] || key;
          el.classList.remove("text-rtl", "text-ltr");
          el.classList.add(dir === "ltr" ? "text-ltr" : "text-rtl");
        });
      }

      // Language switch function
      window.changeLanguage = function (lng) {
        i18next.changeLanguage(lng, () => {
          updateContent(lng);
          saveLanguage(lng);
          document.documentElement.lang = lng;
        });
      };
    })
    .catch((err) => console.error("CSV load error:", err));
});

// Convert CSV to JSON
function csvToJson(csv) {
  const parsed = Papa.parse(csv, {
    header: true,
    skipEmptyLines: true,
  });
  return parsed.data;
}

// Convert flat JSON to i18next resources format
function convertToI18next(flat) {
  const resources = {
    en: { translation: {} },
    fr: { translation: {} },
    ar: { translation: {} },
  };

  Object.keys(flat).forEach((key) => {
    const item = flat[key];

    resources.en.translation[item.Key] = item["UK English"] || "";
    resources.fr.translation[item.Key] = item["French"] || "";
    resources.ar.translation[item.Key] = item["Arabic"] || "";
  });

  return resources;
}

// Get saved preference if exists
function getSavedLanguage() {
  return localStorage.getItem("site_language");
}

// Save language preference
function saveLanguage(lng) {
  localStorage.setItem("site_language", lng);
}

// Get country by IP and map to language
async function detectLanguageByIP() {
  try {
    // free for all usage, no key required
    const res = await fetch("https://api.country.is");
    const data = await res.json();

    const countryCode = (data.country || "").toLowerCase();
    debugger;

    if (SUPPORTED_LANGUAGES.includes(countryCode)) {
      return countryCode;
    }
  } catch (e) {
    console.warn("IP detection failed", e);
  }

  return "en";
}

// ⭐ Main language resolver
async function resolveLanguage() {
  // 1) preference exists? yes, use it else continue
  const saved = getSavedLanguage();
  if (saved && SUPPORTED_LANGUAGES.includes(saved)) {
    return saved;
  }

  // 2) detect from IP address of the user
  const detected = await detectLanguageByIP();
  if (detected) {
    saveLanguage(detected);
    return detected;
  }

  // 3) fallback → English
  return "en";
}
