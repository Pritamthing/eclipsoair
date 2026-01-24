/** main JS file */
const SUPPORTED_LANGUAGES = ["en", "fr", "ar"];

(function () {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector("body");
    const selectHeader = document.querySelector("#header");
    if (
      !selectHeader.classList.contains("scroll-up-sticky") &&
      !selectHeader.classList.contains("sticky-top") &&
      !selectHeader.classList.contains("fixed-top")
    )
      return;
    window.scrollY > 100
      ? selectBody.classList.add("scrolled")
      : selectBody.classList.remove("scrolled");
  }

  document.addEventListener("scroll", toggleScrolled);
  window.addEventListener("load", toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector(".mobile-nav-toggle");

  function mobileNavToogle() {
    document.querySelector("body").classList.toggle("mobile-nav-active");
    mobileNavToggleBtn.classList.toggle("bi-list");
    mobileNavToggleBtn.classList.toggle("bi-x");
  }
  mobileNavToggleBtn.addEventListener("click", mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll("#navmenu a").forEach((navmenu) => {
    navmenu.addEventListener("click", () => {
      if (document.querySelector(".mobile-nav-active")) {
        mobileNavToogle();
      }
    });
  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll(".navmenu .toggle-dropdown").forEach((navmenu) => {
    navmenu.addEventListener("click", function (e) {
      e.preventDefault();
      // Get the parent li.dropdown element
      const parentLi = this.closest("li.dropdown");
      if (parentLi) {
        parentLi.classList.toggle("active");
        // Find the dropdown ul which is a child of the li, not a sibling
        const dropdownMenu = parentLi.querySelector(":scope > ul");
        if (dropdownMenu) {
          dropdownMenu.classList.toggle("dropdown-active");
        }
      }
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector("#preloader");
  if (preloader) {
    window.addEventListener("load", () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector(".scroll-top");

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100
        ? scrollTop.classList.add("active")
        : scrollTop.classList.remove("active");
    }
  }
  scrollTop.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  window.addEventListener("load", toggleScrollTop);
  document.addEventListener("scroll", toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  }
  window.addEventListener("load", aosInit);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: ".glightbox",
  });

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim(),
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Frequently Asked Questions Toggle
   */
  document
    .querySelectorAll(".faq-item h3, .faq-item .faq-toggle")
    .forEach((faqItem) => {
      faqItem.addEventListener("click", () => {
        faqItem.parentNode.classList.toggle("faq-active");
      });
    });

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener("load", function (e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: "smooth",
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll(".navmenu a");

  function navmenuScrollspy() {
    navmenulinks.forEach((navmenulink) => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let scrollPosition = window.scrollY + 110;
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;

      if (scrollPosition >= top && scrollPosition <= bottom) {
        navmenulinks.forEach((l) => l.classList.remove("active"));
        navmenulink.classList.add("active");
      } else {
        navmenulink.classList.remove("active");
      }
    });
  }
  window.addEventListener("load", navmenuScrollspy);
  document.addEventListener("scroll", navmenuScrollspy);
})();

document.addEventListener("DOMContentLoaded", function () {
  const isProd = true;
  //localStorage for testing cookies in local machine for local files with file://
  if (!isProd) {
    // Check if cookies have already been accepted
    if (!localStorage.getItem("cookie")) {
      if (localStorage.getItem("deCookie")) {
        return;
      }
      $(".cookie-banner").css("display", "block");
    }
  } else {
    // Check if cookies have already been accepted
    if (!getCookie("cookie")) {
      if (getCookie("deCookie")) {
        return;
      }
      $(".cookie-banner").css("display", "block");
    }
  }

  $(".accept").on("click", () => {
    $(".cookie-banner").css("display", "none");
    setCookie("cookie", true, 30, isProd);
  });
  $(".decline").on("click", () => {
    $(".cookie-banner").css("display", "none");
    setCookie("deCookie", true, 30, isProd);
  });

  //redirect URL or home page
  const redirectUrl =
    "https://eclipsoair-limited.github.io/eclipso-air-website";
  const indexUrl = window.origin;
  // Attach the event listeners to bothe News and BBC elements
  handleBBCNewsClick("bbc_news", redirectUrl);
  handleBBCNewsClick("bbc_news_footer", redirectUrl);
});
setCookie = (cookieName, cookieVal, expDays, isProd = false) => {
  let date = new Date();
  date.setTime(date.getTime() + expDays * 24 * 3600 * 1000);
  const expires = "expires=" + date.toUTCString();
  const secure = isProd ? "; Secure; SameSite=Strict" : "";
  if (isProd) {
    document.cookie = `${cookieName}=${cookieVal}; ${expires}; path=/ ${secure}`;
  } else {
    localStorage.setItem(cookieName, true);
    localStorage.setItem(
      "cookies",
      cookieName + "=" + cookieVal + "; " + expires + "; path=/",
    );
  }
};
getCookie = (cookieName) => {
  const name = cookieName + "=";
  const cDecoded = decodeURIComponent(document.cookie);
  const cArr = cDecoded.split(";");
  let value;
  cArr.forEach((val) => {
    if (val.indexOf(name) === 0) value = val.substring(name.length);
  });
  return value;
};

let forms = document.querySelectorAll(".email-form");
forms.forEach(function (e) {
  e.addEventListener("submit", function (event) {
    event.preventDefault();

    let thisForm = this;

    let recaptcha = thisForm.getAttribute("data-recaptcha-site-key");
    thisForm.querySelector(".loading").classList.add("d-block");
    thisForm.querySelector(".error-message").classList.remove("d-block");
    thisForm.querySelector(".sent-message").classList.remove("d-block");

    let formData = new FormData(thisForm);

    if (recaptcha) {
      if (typeof grecaptcha !== "undefined") {
        grecaptcha.ready(function () {
          try {
            grecaptcha
              .execute(recaptcha, { action: "php_email_form_submit" })
              .then((token) => {
                formData.set("recaptcha-response", token);
                php_email_form_submit(thisForm, action, formData);
              });
          } catch (error) {
            displayError(thisForm, error);
          }
        });
      } else {
        displayError(
          thisForm,
          "The reCaptcha javascript API url is not loaded!",
        );
      }
    } else {
      email_form_submit(thisForm, formData);
    }
  });
});

function email_form_submit(thisForm, formData) {
  if (!$("#emailPublicKey").val()) {
    alert("no public key is provided");
  }
  emailjs.init({
    publicKey: $("#emailPublicKey").val(),
  });
  const EMAIL_SERVICE_ID = $("#serviceId").val();
  let EMAIL_TEMPLATE_ID = $("#templateId").val();
  if (thisForm.id === "subscription") {
    EMAIL_TEMPLATE_ID = $("#subTemplateId").val();
  }
  const templateParams = {
    subject: formData.get("subject"),
    name: formData.get("name"),
    message: formData.get("message"),
    email: formData.get("email"),
    from_name: formData.get("name"),
    from_email: formData.get("email"),
  };
  var data = {
    service_id: EMAIL_SERVICE_ID,
    template_id: EMAIL_TEMPLATE_ID,
    user_id: $("#emailPublicKey").val(),
    template_params: templateParams,
  };

  $.ajax("https://api.emailjs.com/api/v1.0/email/send", {
    type: "POST",
    data: JSON.stringify(data),
    contentType: "application/json",
  })
    .done(function (data) {
      thisForm.querySelector(".loading").classList.remove("d-block");
      if (data.trim() == "OK") {
        thisForm.querySelector(".sent-message").classList.add("d-block");
        thisForm.reset();
      } else {
        throw new Error(
          data ? data : "Form submission failed and no error message returned",
        );
      }
    })
    .catch((error) => {
      displayError(thisForm, error);
    });
}

function displayError(thisForm, error) {
  const errorMessage =
    typeof error === "object"
      ? "Something went wrong! please email info@eclipsoair.com"
      : error;
  thisForm.querySelector(".loading").classList.remove("d-block");
  thisForm.querySelector(".error-message").innerHTML = errorMessage;
  thisForm.querySelector(".error-message").classList.add("d-block");
}

/**
 * Redirect to home page
 * @param {*} elementId
 * @param {*} redirectUrl
 */
function handleBBCNewsClick(elementId, redirectUrl) {
  const element = document.getElementById(elementId);
  if (element) {
    element.addEventListener("click", function () {
      console.log("Opening BBC News...");
      const bbcWindow = window.open("https://www.bbc.com/news", "_blank");

      if (bbcWindow) {
        const checkWindowClosed = setInterval(function () {
          try {
            // Check if the BBC window is closed or navigated away
            if (
              bbcWindow.closed ||
              bbcWindow.location.hostname !== "www.bbc.com"
            ) {
              clearInterval(checkWindowClosed);
              console.log(
                "BBC News window closed or user navigated away. Redirecting...",
              );
              window.location.href = redirectUrl;
            }
          } catch (error) {
            // Cross-origin errors occur if the user navigates away
            console.warn(
              "Unable to access BBC window location. Assuming user navigated away.",
            );
            clearInterval(checkWindowClosed);
            window.location.href = redirectUrl;
          }
        }, 500); // Check every 500 milliseconds
      } else {
        console.error("Popup blocked! Unable to open BBC News.");
      }
    });
  } else {
    console.error(`Element with ID "${elementId}" not found.`);
  }
}

// function changeLanguage(lng) {
//   alert(`Language changed to: ${lng}`);
//   document.documentElement.lang = lng;
// };

// i18next initialization and language handling
document.addEventListener("DOMContentLoaded", async function () {
  const lng = await resolveLanguage();
  fetch("translations.csv")
    .then((res) => res.text())
    .then((csv) => {
      const translations = csvToJson(csv);
      const resources = convertToI18next(translations);

      console.log("i18next resources loaded:", resources);

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
          updateContent();
        },
      );

      function updateContent() {
        document.querySelectorAll("[data-i18n]").forEach((el) => {
          const key = el.getAttribute("data-i18n");
          el.innerHTML = i18next.t(key);
        });
      }

      // Language switch function
      window.changeLanguage = function (lng) {
        i18next.changeLanguage(lng, () => {
          console.log("Language changed to:", lng);
          updateContent();
          saveLanguage(lng);
          document.documentElement.lang = lng;

          // Optional: if you want to auto-wrap Arabic content
          document.querySelectorAll("[data-i18n]").forEach((el) => {
            if (lng === "ar") {
              el.setAttribute("dir", "rtl");
              el.style.textAlign = "right";
            } else {
              el.setAttribute("dir", "ltr");
              el.style.textAlign = "left";
            }
          });
        });
      };
    })
    .catch((err) => console.error("CSV load error:", err));
});

// Convert CSV to JSON
function csvToJson(csv) {
  const lines = csv.trim().split("\n").filter(Boolean);
  const headers = lines[0].split(",").map((h) => h.trim());
  console.log("CSV Headers:", headers);

  const result = {};

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(",");
    const key = row[0].trim();

    const obj = {};
    for (let j = 1; j < headers.length; j++) {
      obj[headers[j]] = row[j] ? row[j].trim() : "";
    }

    result[key] = obj;
  }

  return result;
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

    resources.en.translation[key] = item["UK English"] || "";
    resources.fr.translation[key] = item["French"] || "";
    resources.ar.translation[key] = item["Arabic"] || "";
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
    const res = await fetch("https://ipwho.is/");
    const data = await res.json();

    const countryCode = (data.country_code || "").toUpperCase();

    if (SUPPORTED_LANGUAGES.includes(countryCode)) {
      return countryCode;
    }
  } catch (e) {
    console.warn("IP detection failed", e);
  }

  return "en"; // default fallback to 'en'
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
    return detected;
  }

  // 3) fallback → English
  return "en";
}
