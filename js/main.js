/**

 * ============================================================

 * main.js — المنطق الرئيسي للمنصة + الحركات والتأثيرات

 * ============================================================

 * هذا الملف يتحكم في:

 * - تهيئة الصفحات (الرئيسية / الكورسات / لوحة التحكم)

 * - إدارة LocalStorage (الكورسات المسجلة + الوضع الليلي)

 * - الحركات والتأثيرات البصرية (AOS, GSAP, Typing, Counters)

 * - الإشعارات المنبثقة (Toast) وشاشة التحميل

 * ============================================================

 */



/** مفتاح LocalStorage لحفظ الكورسات التي سجل فيها الطالب */

const ENROLLED_KEY = "enrolledCourses";

/** مفتاح LocalStorage لحفظ تفضيل الوضع الليلي */

const THEME_KEY = "darkMode";

/** مفتاح LocalStorage لتتبع ما إذا ظهرت شاشة التحميل مسبقاً */

const LOADING_KEY = "siteLoadingShown";



/**

 * نقطة الدخول الرئيسية — تُنفَّذ عند اكتمال تحميل DOM

 * تهيّئ جميع المكونات المشتركة ثم تفعّل منطق الصفحة الحالية

 */

document.addEventListener("DOMContentLoaded", () => {

  initLoadingScreen();

  initPageTransition();

  initDarkMode();

  initMobileMenu();

  initNavbarScroll();

  initRippleEffect();

  initMagneticButtons();

  initScrollToTop();

  initSmoothScroll();

  initFooterLinks();

  initFormValidation();

  initAOS();

  initCustomCursor();



  const page = document.body.dataset.page;



  if (page === "home") {

    initTypingAnimation();

    initAnimatedCounters();

    renderLatestCourses();

  } else if (page === "courses") {

    initCoursesPage();

  } else if (page === "dashboard") {

    renderDashboard();

    animateProgressBars();

    animateDashboardStagger();

  }

});



/**

 * التحقق من تفضيل المستخدم لتقليل الحركات (إمكانية الوصول)

 * @returns {boolean} true إذا كان المستخدم يفضّل تقليل الحركات

 */

function prefersReducedMotion() {

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;

}



/**

 * شاشة التحميل — تظهر عند أول زيارة للموقع لمدة ~1.5 ثانية ثم تختفي

 * تُحفظ الحالة في localStorage حتى لا تتكرر في الزيارات اللاحقة

 */

function initLoadingScreen() {

  const loader = document.getElementById("loading-screen");

  if (!loader || localStorage.getItem(LOADING_KEY) === "true") return;



  document.body.classList.add("loading-active");

  const duration = prefersReducedMotion() ? 300 : 1500;



  setTimeout(() => {

    loader.classList.add("loading-screen-hide");

    document.body.classList.remove("loading-active");

    localStorage.setItem(LOADING_KEY, "true");



    setTimeout(() => loader.remove(), prefersReducedMotion() ? 0 : 600);

  }, duration);

}



/**

 * حركة fade-in عند تحميل الصفحة + fade-out عند الانتقال بين الصفحات

 */

function initPageTransition() {

  if (prefersReducedMotion()) {

    document.body.classList.add("page-loaded");

    return;

  }



  requestAnimationFrame(() => {

    document.body.classList.add("page-loaded");

  });



  document.querySelectorAll('a[href$=".html"]').forEach((link) => {

    const href = link.getAttribute("href");

    if (!href || href.startsWith("#") || link.target === "_blank") return;



    link.addEventListener("click", (e) => {

      if (e.ctrlKey || e.metaKey || e.shiftKey) return;

      e.preventDefault();

      document.body.classList.remove("page-loaded");

      document.body.classList.add("page-exit");

      setTimeout(() => {

        window.location.href = href;

      }, prefersReducedMotion() ? 0 : 280);

    });

  });

}



/**

 * Custom Cursor — دائرة صغيرة تتبع الماوس وتكبر على الأزرار والروابط

 * يعمل فقط على أجهزة سطح المكتب (pointer: fine)

 */

function initCustomCursor() {

  if (prefersReducedMotion() || !window.matchMedia("(pointer: fine)").matches) return;



  const HOVER_SELECTOR =

    "a, button, input, textarea, select, label, [role='button'], [data-enroll-id]";



  const cursor = document.createElement("div");

  cursor.id = "custom-cursor";

  cursor.setAttribute("aria-hidden", "true");

  document.body.appendChild(cursor);

  document.body.classList.add("custom-cursor-active");



  let mouseX = 0;

  let mouseY = 0;

  let cursorX = 0;

  let cursorY = 0;



  document.addEventListener("mousemove", (e) => {

    mouseX = e.clientX;

    mouseY = e.clientY;

    cursor.classList.add("is-visible");

    cursor.classList.toggle("is-hover", !!e.target.closest(HOVER_SELECTOR));

  });



  document.addEventListener("mouseleave", () => {

    cursor.classList.remove("is-visible", "is-hover");

  });



  function followMouse() {

    cursorX += (mouseX - cursorX) * 0.18;

    cursorY += (mouseY - cursorY) * 0.18;

    cursor.style.left = `${cursorX}px`;

    cursor.style.top = `${cursorY}px`;

    requestAnimationFrame(followMouse);

  }



  followMouse();

}



/**

 * تفعيل مكتبة AOS (Animate On Scroll) للحركات عند التمرير

 */

function initAOS() {

  if (typeof AOS !== "undefined" && !prefersReducedMotion()) {

    AOS.init({

      duration: 500,

      once: true,

      offset: 60,

      easing: "ease-out-cubic"

    });

  }

}



/**

 * Navbar — يصغر ويصبح أكثر شفافية عند التمرير للأسفل

 */

function initNavbarScroll() {

  const navbar = document.getElementById("main-navbar");

  if (!navbar) return;



  const onScroll = () => {

    if (window.scrollY > 50) {

      navbar.classList.add("navbar-scrolled");

    } else {

      navbar.classList.remove("navbar-scrolled");

    }

  };



  window.addEventListener("scroll", onScroll, { passive: true });

  onScroll();

}



/**

 * Smooth Scroll — تمرير ناعم للروابط الداخلية (#section)

 */

function initSmoothScroll() {

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {

    anchor.addEventListener("click", (e) => {

      const targetId = anchor.getAttribute("href");

      if (targetId === "#") return;



      const target = document.querySelector(targetId);

      if (target) {

        e.preventDefault();

        target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });

      }

    });

  });

}



/**

 * روابط Footer — تفعيل الروابط ذات href="#" لمنع القفز وعرض رسالة

 */

function initFooterLinks() {

  document.querySelectorAll("footer a[href='#']").forEach((link) => {

    link.addEventListener("click", (e) => {

      e.preventDefault();

      const label = link.getAttribute("aria-label") || link.querySelector("i")?.className || "";

      let message = "سيتم إطلاق هذا الرابط قريباً!";



      if (label.includes("twitter") || link.querySelector(".fa-twitter")) {

        message = "حساب Twitter — قريباً!";

      } else if (label.includes("instagram") || link.querySelector(".fa-instagram")) {

        message = "حساب Instagram — قريباً!";

      } else if (label.includes("youtube") || link.querySelector(".fa-youtube")) {

        message = "قناة YouTube — قريباً!";

      } else if (label.includes("linkedin") || link.querySelector(".fa-linkedin")) {

        message = "حساب LinkedIn — قريباً!";

      }



      showToast(message, "info");

    });

  });

}



/**

 * التحقق من صحة النماذج — يدعم نموذج الاشتراك في النشرة البريدية

 */

function initFormValidation() {

  const form = document.getElementById("newsletter-form");

  if (!form) return;



  const emailInput = form.querySelector("#newsletter-email");

  const errorEl = form.querySelector("#newsletter-error");



  form.addEventListener("submit", (e) => {

    e.preventDefault();



    const email = emailInput?.value.trim() || "";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;



    if (!email) {

      showFieldError(errorEl, emailInput, "يرجى إدخال البريد الإلكتروني");

      return;

    }



    if (!emailRegex.test(email)) {

      showFieldError(errorEl, emailInput, "يرجى إدخال بريد إلكتروني صحيح");

      return;

    }



    clearFieldError(errorEl, emailInput);

    form.reset();

    showToast("تم الاشتراك في النشرة البريدية بنجاح!", "success");

  });



  emailInput?.addEventListener("input", () => {

    if (errorEl && !errorEl.classList.contains("hidden")) {

      clearFieldError(errorEl, emailInput);

    }

  });

}



/**

 * عرض رسالة خطأ تحت حقل الإدخال

 * @param {HTMLElement} errorEl - عنصر رسالة الخطأ

 * @param {HTMLElement} inputEl - حقل الإدخال

 * @param {string} message - نص الخطأ

 */

function showFieldError(errorEl, inputEl, message) {

  if (errorEl) {

    errorEl.textContent = message;

    errorEl.classList.remove("hidden");

  }

  inputEl?.classList.add("border-red-500", "ring-1", "ring-red-500");

  inputEl?.focus();

}



/**

 * إزالة رسالة الخطأ من حقل الإدخال

 * @param {HTMLElement} errorEl - عنصر رسالة الخطأ

 * @param {HTMLElement} inputEl - حقل الإدخال

 */

function clearFieldError(errorEl, inputEl) {

  errorEl?.classList.add("hidden");

  inputEl?.classList.remove("border-red-500", "ring-1", "ring-red-500");

}



/**

 * زر العودة للأعلى — يظهر تلقائياً عند التمرير لأسفل أكثر من 400px

 */

function initScrollToTop() {

  const btn = document.getElementById("scroll-top-btn");

  if (!btn) return;



  window.addEventListener(

    "scroll",

    () => {

      if (window.scrollY > 400) {

        btn.classList.add("scroll-top-visible");

      } else {

        btn.classList.remove("scroll-top-visible");

      }

    },

    { passive: true }

  );



  btn.addEventListener("click", () => {

    window.scrollTo({

      top: 0,

      behavior: prefersReducedMotion() ? "auto" : "smooth"

    });

  });

}



/**

 * تأثير Ripple — موجة بيضاء تنتشر عند الضغط على الأزرار ذات class btn-ripple

 */

function initRippleEffect() {

  document.addEventListener("click", (e) => {

    const btn = e.target.closest(".btn-ripple");

    if (!btn || prefersReducedMotion()) return;



    const rect = btn.getBoundingClientRect();

    const ripple = document.createElement("span");

    ripple.className = "ripple-wave";

    const size = Math.max(rect.width, rect.height);

    ripple.style.width = ripple.style.height = `${size}px`;

    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;

    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

    btn.appendChild(ripple);

    ripple.addEventListener("animationend", () => ripple.remove());

  });

}



/**

 * تأثير Magnetic — الزر يتحرك باتجاه مؤشر الماوس بشكل خفيف

 */

function initMagneticButtons() {

  if (prefersReducedMotion()) return;



  document.querySelectorAll(".btn-magnetic").forEach((btn) => {

    btn.addEventListener("mousemove", (e) => {

      const rect = btn.getBoundingClientRect();

      const x = e.clientX - rect.left - rect.width / 2;

      const y = e.clientY - rect.top - rect.height / 2;

      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;

    });



    btn.addEventListener("mouseleave", () => {

      btn.style.transform = "";

    });

  });

}



/**

 * Typing Animation — يكتب ويمسح كلمات متتابعة في Hero Section

 */

function initTypingAnimation() {

  const el = document.getElementById("typing-text");

  if (!el) return;



  const words = ["المستقبل", "البرمجة", "التصميم", "التسويق", "الأعمال"];



  if (prefersReducedMotion()) {

    el.textContent = words[0];

    return;

  }



  let wordIndex = 0;

  let charIndex = 0;

  let isDeleting = false;



  function typeLoop() {

    const currentWord = words[wordIndex];



    if (!isDeleting) {

      el.textContent = currentWord.substring(0, charIndex + 1);

      charIndex++;



      if (charIndex === currentWord.length) {

        isDeleting = true;

        setTimeout(typeLoop, 1800);

        return;

      }

      setTimeout(typeLoop, 100);

    } else {

      el.textContent = currentWord.substring(0, charIndex - 1);

      charIndex--;



      if (charIndex === 0) {

        isDeleting = false;

        wordIndex = (wordIndex + 1) % words.length;

        setTimeout(typeLoop, 400);

        return;

      }

      setTimeout(typeLoop, 50);

    }

  }



  typeLoop();

}



/**

 * Animated Counters — عدّ تصاعدي للإحصائيات عند ظهورها في viewport

 */

function initAnimatedCounters() {

  const section = document.getElementById("stats-section");

  if (!section) return;



  const counters = section.querySelectorAll("[data-count]");



  const observer = new IntersectionObserver(

    (entries) => {

      entries.forEach((entry) => {

        if (entry.isIntersecting) {

          counters.forEach((counter) => animateCounter(counter));

          observer.disconnect();

        }

      });

    },

    { threshold: 0.3 }

  );



  observer.observe(section);

}



/**

 * تحريك عداد واحد من 0 إلى الرقم المستهدف

 * @param {HTMLElement} el - عنصر العداد

 */

function animateCounter(el) {

  const target = parseInt(el.dataset.count, 10);

  const prefix = el.dataset.prefix || "";

  const suffix = el.dataset.suffix || "";

  const duration = 2000;



  if (prefersReducedMotion()) {

    el.textContent = `${prefix}${target}${suffix}`;

    return;

  }



  const startTime = performance.now();



  function update(now) {

    const progress = Math.min((now - startTime) / duration, 1);

    const eased = 1 - Math.pow(1 - progress, 3);

    const current = Math.floor(target * eased);

    el.textContent = `${prefix}${current.toLocaleString("en-US")}${suffix}`;



    if (progress < 1) {

      requestAnimationFrame(update);

    } else {

      el.textContent = `${prefix}${target.toLocaleString("en-US")}${suffix}`;

    }

  }



  requestAnimationFrame(update);

}



/**

 * تهيئة الوضع الليلي — قراءة التفضيل المحفوظ وربط زر التبديل

 */

function initDarkMode() {

  const isDark = localStorage.getItem(THEME_KEY) === "true";

  applyTheme(isDark, false);



  const toggleBtn = document.getElementById("theme-toggle");

  if (toggleBtn) {

    toggleBtn.addEventListener("click", () => {

      const currentlyDark = document.documentElement.classList.contains("dark");

      applyTheme(!currentlyDark, true);

      localStorage.setItem(THEME_KEY, String(!currentlyDark));

    });

  }

}



/**

 * تطبيق الوضع الليلي أو النهاري وتحديث أيقونة الزر

 * @param {boolean} isDark - true للوضع الليلي

 * @param {boolean} showNotification - هل نعرض Toast؟

 */

function applyTheme(isDark, showNotification = false) {

  const html = document.documentElement;

  const icon = document.getElementById("theme-icon");



  if (isDark) {

    html.classList.add("dark");

    if (icon) {

      icon.classList.remove("fa-moon");

      icon.classList.add("fa-sun");

    }

    if (showNotification) showToast("تم تفعيل الوضع الليلي 🌙", "info");

  } else {

    html.classList.remove("dark");

    if (icon) {

      icon.classList.remove("fa-sun");

      icon.classList.add("fa-moon");

    }

    if (showNotification) showToast("تم تفعيل الوضع النهاري ☀️", "info");

  }

}



/**

 * القائمة المتجاوبة للموبايل — فتح وإغلاق

 */

function initMobileMenu() {

  const menuBtn = document.getElementById("mobile-menu-btn");

  const mobileMenu = document.getElementById("mobile-menu");

  const closeBtn = document.getElementById("mobile-menu-close");



  if (menuBtn && mobileMenu) {

    menuBtn.addEventListener("click", () => {

      mobileMenu.classList.remove("hidden");

      mobileMenu.classList.add("flex");

    });

  }



  if (closeBtn && mobileMenu) {

    closeBtn.addEventListener("click", () => {

      mobileMenu.classList.add("hidden");

      mobileMenu.classList.remove("flex");

    });

  }



  mobileMenu?.querySelectorAll("a").forEach((link) => {

    link.addEventListener("click", () => {

      mobileMenu.classList.add("hidden");

      mobileMenu.classList.remove("flex");

    });

  });

}



// ============================================================

// إدارة LocalStorage — الكورسات المسجلة

// ============================================================



/**

 * جلب قائمة الكورسات المسجلة من LocalStorage

 * @returns {Array} مصفوفة الكورسات أو [] إذا فارغ

 */

function getEnrolledCourses() {

  try {

    const stored = localStorage.getItem(ENROLLED_KEY);

    return stored ? JSON.parse(stored) : [];

  } catch {

    return [];

  }

}



/**

 * حفظ قائمة الكورسات المسجلة في LocalStorage

 * @param {Array} courses - مصفوفة الكورسات

 */

function saveEnrolledCourses(courses) {

  localStorage.setItem(ENROLLED_KEY, JSON.stringify(courses));

}



/**

 * التحقق مما إذا كان الطالب مسجلاً في كورس معيّن

 * @param {number} courseId - معرّف الكورس

 * @returns {boolean}

 */

function isEnrolled(courseId) {

  return getEnrolledCourses().some((c) => c.id === courseId);

}



/**

 * تسجيل الطالب في كورس جديد — يُضاف للـ LocalStorage ويُعرض Toast

 * @param {number} courseId - معرّف الكورس

 */

function enrollCourse(courseId) {

  const course = coursesData.find((c) => c.id === courseId);

  if (!course) return;



  const enrolled = getEnrolledCourses();



  if (enrolled.some((c) => c.id === courseId)) {

    showToast("أنت مسجل بالفعل في هذا الكورس!", "info");

    return;

  }



  const enrolledCourse = {

    ...course,

    progress: Math.floor(Math.random() * 51) + 10,

    enrolledAt: new Date().toISOString()

  };



  enrolled.push(enrolledCourse);

  saveEnrolledCourses(enrolled);

  showToast("تم التسجيل بنجاح!", "success");

  updateEnrollButton(courseId);

}



/**

 * إزالة كورس من لوحة التحكم — يُحدّث LocalStorage ويعيد رسم الصفحة

 * @param {number} courseId - معرّف الكورس

 */

function removeCourse(courseId) {

  const course = getEnrolledCourses().find((c) => c.id === courseId);

  if (!course) return;



  const enrolled = getEnrolledCourses().filter((c) => c.id !== courseId);

  saveEnrolledCourses(enrolled);

  showToast(`تم إزالة "${course.title}" من لوحة التحكم`, "info");



  renderDashboard();

  animateProgressBars();

  animateDashboardStagger();

}



/**

 * تحديث مظهر زر "اشترك الآن" بعد التسجيل

 * @param {number} courseId - معرّف الكورس

 */

function updateEnrollButton(courseId) {

  const btn = document.querySelector(`[data-enroll-id="${courseId}"]`);

  if (btn) {

    btn.textContent = "مسجل ✓";

    btn.disabled = true;

    btn.classList.remove("hover:bg-indigo-700", "hover:-translate-y-1");

    btn.classList.add("bg-green-600", "cursor-not-allowed", "opacity-80");

  }

}



// ============================================================

// بناء وعرض بطاقات الكورسات

// ============================================================



/**

 * تحديد نوع حركة AOS لكل بطاقة (متناوبة)

 * @param {number} index - ترتيب البطاقة

 * @returns {string} اسم الحركة

 */

function getCardAosAnimation(index) {

  const animations = ["fade-right", "fade-left", "fade-up"];

  return animations[index % 3];

}



/**

 * إنشاء HTML لبطاقة كورس واحدة

 * @param {Object} course - بيانات الكورس

 * @param {Object} options - خيارات العرض (زر اشتراك، تقدم، إزالة...)

 * @returns {string} HTML جاهز للإدراج

 */

function createCourseCard(course, options = {}) {

  const {

    showEnrollBtn = true,

    showProgress = false,

    showRemoveBtn = false,

    delay = 0,

    index = 0,

    skipAos = false

  } = options;

  const enrolled = isEnrolled(course.id);

  const progress = course.progress || 0;

  const aosAnim = getCardAosAnimation(index);

  const aosAttrs = skipAos ? "" : `data-aos="${aosAnim}" data-aos-delay="${delay}"`;

  const stars = generateStars(course.rating);



  const enrollButton = showEnrollBtn

    ? `<button

        data-enroll-id="${course.id}"

        onclick="enrollCourse(${course.id})"

        ${enrolled ? "disabled" : ""}

        class="btn-ripple w-full mt-4 py-2.5 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${

          enrolled

            ? "bg-green-600 text-white cursor-not-allowed opacity-80"

            : "bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-1 hover:shadow-lg"

        }">

        ${enrolled ? "مسجل ✓" : "اشترك الآن"}

      </button>`

    : "";



  const removeButton = showRemoveBtn

    ? `<button

        onclick="removeCourse(${course.id})"

        class="btn-ripple w-full mt-3 py-2 px-4 rounded-xl font-semibold text-sm border-2 border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300">

        <i class="fas fa-trash-alt ml-1"></i> إزالة من لوحتي

      </button>`

    : "";



  const progressBar = showProgress

    ? `<div class="mt-4">

        <div class="flex justify-between text-sm mb-1.5">

          <span class="text-gray-600 dark:text-gray-400">التقدم</span>

          <span class="font-bold text-indigo-600 dark:text-indigo-400 progress-label" data-progress="${progress}">0%</span>

        </div>

        <div class="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">

          <div

            class="progress-bar-fill h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 will-change-transform"

            data-progress="${progress}"

            style="width: 0%">

          </div>

        </div>

      </div>`

    : "";



  return `

    <article

      class="course-card group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-700 will-change-transform"

      ${aosAttrs}>

      <div class="course-image-wrapper relative overflow-hidden">

        <img

          src="${course.image}"

          alt="${course.title}"

          class="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500 will-change-transform"

          loading="lazy">

        <div class="shimmer-overlay" aria-hidden="true"></div>

        <span class="absolute top-3 right-3 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10">

          ${course.category}

        </span>

      </div>

      <div class="p-5">

        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">

          ${course.title}

        </h3>

        <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">

          <i class="fas fa-user-tie ml-1"></i> ${course.instructor}

        </p>

        <div class="flex items-center justify-between mb-3">

          <div class="flex items-center gap-1 text-yellow-400 text-sm">

            ${stars}

            <span class="text-gray-600 dark:text-gray-400 mr-1">${course.rating}</span>

          </div>

          <span class="text-indigo-600 dark:text-indigo-400 font-bold text-lg">

            ${course.price} ر.س

          </span>

        </div>

        ${progressBar}

        ${enrollButton}

        ${removeButton}

      </div>

    </article>

  `;

}



/**

 * إنشاء HTML لنجوم التقييم (ممتلئة / نصف / فارغة)

 * @param {number} rating - التقييم من 5

 * @returns {string} HTML الأيقونات

 */

function generateStars(rating) {

  const fullStars = Math.floor(rating);

  const hasHalf = rating % 1 >= 0.5;

  let html = "";



  for (let i = 0; i < fullStars; i++) {

    html += '<i class="fas fa-star"></i>';

  }

  if (hasHalf) {

    html += '<i class="fas fa-star-half-alt"></i>';

  }

  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  for (let i = 0; i < emptyStars; i++) {

    html += '<i class="far fa-star"></i>';

  }



  return html;

}



/**

 * إنشاء HTML لبطاقة Skeleton أثناء انتظار تحميل الكورسات

 * @returns {string} HTML البطاقة الوهمية

 */

function createSkeletonCard() {

  return `

    <div class="skeleton-card bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-700">

      <div class="skeleton-shimmer h-48 w-full"></div>

      <div class="p-5 space-y-3">

        <div class="skeleton-shimmer h-5 w-3/4 rounded-lg"></div>

        <div class="skeleton-shimmer h-4 w-1/2 rounded-lg"></div>

        <div class="skeleton-shimmer h-4 w-full rounded-lg"></div>

        <div class="skeleton-shimmer h-10 w-full rounded-xl mt-4"></div>

      </div>

    </div>

  `;

}



/**

 * عرض أحدث 3 كورسات في الصفحة الرئيسية

 */

function renderLatestCourses() {

  const container = document.getElementById("latest-courses");

  if (!container) return;



  const latest = coursesData.slice(0, 3);

  container.innerHTML = latest

    .map((course, index) =>

      createCourseCard(course, { delay: index * 120, index })

    )

    .join("");



  latest.forEach((course) => {

    if (isEnrolled(course.id)) updateEnrollButton(course.id);

  });



  if (typeof AOS !== "undefined") AOS.refresh();

}



/**

 * تهيئة صفحة الكورسات — Skeleton + البحث + الفلترة

 */

function initCoursesPage() {

  const container = document.getElementById("courses-grid");

  const skeleton = document.getElementById("courses-skeleton");



  if (skeleton && container) {

    skeleton.innerHTML = Array(6)

      .fill(0)

      .map(() => createSkeletonCard())

      .join("");

    skeleton.classList.remove("hidden");

    container.classList.add("opacity-0");



    setTimeout(() => {

      skeleton.classList.add("hidden");

      container.classList.remove("opacity-0");

      renderAllCourses(coursesData, true);

    }, 1000);

  } else {

    renderAllCourses(coursesData, true);

  }



  const searchInput = document.getElementById("search-input");

  const filterBtns = document.querySelectorAll("[data-filter]");



  searchInput?.addEventListener("input", () => applyFilters());



  filterBtns.forEach((btn) => {

    btn.addEventListener("click", () => {

      filterBtns.forEach((b) => {

        b.classList.remove("bg-indigo-600", "text-white");

        b.classList.add("bg-gray-100", "dark:bg-gray-700", "text-gray-700", "dark:text-gray-300");

      });

      btn.classList.add("bg-indigo-600", "text-white");

      btn.classList.remove("bg-gray-100", "dark:bg-gray-700", "text-gray-700", "dark:text-gray-300");

      applyFilters();

    });

  });

}



/**

 * تطبيق البحث النصي والفلترة حسب التصنيف معاً

 */

function applyFilters() {

  const searchTerm =

    document.getElementById("search-input")?.value.trim().toLowerCase() || "";

  const activeFilter = document.querySelector("[data-filter].bg-indigo-600");

  const category = activeFilter?.dataset.filter || "all";



  let filtered = coursesData;



  if (category !== "all") {

    filtered = filtered.filter((c) => c.category === category);

  }



  if (searchTerm) {

    filtered = filtered.filter(

      (c) =>

        c.title.toLowerCase().includes(searchTerm) ||

        c.instructor.toLowerCase().includes(searchTerm) ||

        c.category.toLowerCase().includes(searchTerm)

    );

  }



  renderAllCourses(filtered);

}



/**

 * عرض الكورسات في الشبكة مع حركة fade + scale

 * @param {Array} courses - الكورسات المراد عرضها

 * @param {boolean} isInitial - هل هذا التحميل الأول؟

 */

function renderAllCourses(courses, isInitial = false) {

  const container = document.getElementById("courses-grid");

  const emptyState = document.getElementById("empty-state");

  if (!container) return;



  const renderContent = () => {

    if (courses.length === 0) {

      container.innerHTML = "";

      emptyState?.classList.remove("hidden");

      return;

    }



    emptyState?.classList.add("hidden");

    container.innerHTML = courses

      .map((course, index) =>

        createCourseCard(course, { delay: (index % 3) * 100, index, skipAos: true })

      )

      .join("");



    courses.forEach((course) => {

      if (isEnrolled(course.id)) updateEnrollButton(course.id);

    });



    animateCoursesGridIn(container);

  };



  if (container.children.length > 0 && !isInitial) {

    animateCoursesGridOut(container, renderContent);

  } else {

    renderContent();

  }

}



/**

 * حركة اختفاء الكورسات قبل تحديث الفلترة (GSAP)

 * @param {HTMLElement} container - حاوية الشبكة

 * @param {Function} callback - دالة التنفيذ بعد الاختفاء

 */

function animateCoursesGridOut(container, callback) {

  if (prefersReducedMotion() || typeof gsap === "undefined") {

    callback();

    return;

  }



  gsap.to(container.children, {

    opacity: 0,

    scale: 0.92,

    duration: 0.25,

    stagger: 0.04,

    ease: "power2.in",

    onComplete: callback

  });

}



/**

 * حركة ظهور الكورسات بعد التحديث (GSAP)

 * @param {HTMLElement} container - حاوية الشبكة

 */

function animateCoursesGridIn(container) {

  if (prefersReducedMotion() || typeof gsap === "undefined") return;



  gsap.fromTo(

    container.children,

    { opacity: 0, scale: 0.92 },

    {

      opacity: 1,

      scale: 1,

      duration: 0.4,

      stagger: 0.06,

      ease: "power2.out",

      clearProps: "opacity,transform"

    }

  );

}



/**

 * عرض لوحة تحكم الطالب — الإحصائيات + الكورسات المسجلة

 */

function renderDashboard() {

  const container = document.getElementById("enrolled-courses");

  const emptyState = document.getElementById("dashboard-empty");

  const statsContainer = document.getElementById("dashboard-stats");



  if (!container) return;



  const enrolled = getEnrolledCourses();



  if (statsContainer) {

    const avgProgress =

      enrolled.length > 0

        ? Math.round(enrolled.reduce((sum, c) => sum + c.progress, 0) / enrolled.length)

        : 0;



    statsContainer.innerHTML = `

      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-100 dark:border-gray-700" data-aos="fade-up">

        <div class="flex items-center gap-4">

          <div class="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center">

            <i class="fas fa-book-open text-2xl text-indigo-600 dark:text-indigo-400"></i>

          </div>

          <div>

            <p class="text-sm text-gray-500 dark:text-gray-400">الكورسات المسجلة</p>

            <p class="text-3xl font-bold text-gray-900 dark:text-white">${enrolled.length}</p>

          </div>

        </div>

      </div>

      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-100 dark:border-gray-700" data-aos="fade-up" data-aos-delay="100">

        <div class="flex items-center gap-4">

          <div class="w-14 h-14 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center">

            <i class="fas fa-chart-line text-2xl text-purple-600 dark:text-purple-400"></i>

          </div>

          <div>

            <p class="text-sm text-gray-500 dark:text-gray-400">متوسط التقدم</p>

            <p class="text-3xl font-bold text-gray-900 dark:text-white">${avgProgress}%</p>

          </div>

        </div>

      </div>

      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-100 dark:border-gray-700" data-aos="fade-up" data-aos-delay="200">

        <div class="flex items-center gap-4">

          <div class="w-14 h-14 bg-green-100 dark:bg-green-900/50 rounded-xl flex items-center justify-center">

            <i class="fas fa-certificate text-2xl text-green-600 dark:text-green-400"></i>

          </div>

          <div>

            <p class="text-sm text-gray-500 dark:text-gray-400">كورسات مكتملة</p>

            <p class="text-3xl font-bold text-gray-900 dark:text-white">${enrolled.filter((c) => c.progress >= 100).length}</p>

          </div>

        </div>

      </div>

    `;

  }



  if (enrolled.length === 0) {

    container.innerHTML = "";

    emptyState?.classList.remove("hidden");

    return;

  }



  emptyState?.classList.add("hidden");

  container.innerHTML = enrolled

    .map((course, index) =>

      createCourseCard(course, {

        showEnrollBtn: false,

        showProgress: true,

        showRemoveBtn: true,

        delay: index * 120,

        index,

        skipAos: true

      })

    )

    .join("");

}



/**

 * ملء أشرطة التقدم بحركة GSAP عند ظهورها في viewport

 */

function animateProgressBars() {

  const bars = document.querySelectorAll(".progress-bar-fill");

  const labels = document.querySelectorAll(".progress-label");



  if (bars.length === 0) return;



  const applyInstant = () => {

    bars.forEach((bar, i) => {

      const target = bar.dataset.progress;

      bar.style.width = `${target}%`;

      if (labels[i]) labels[i].textContent = `${target}%`;

    });

  };



  if (prefersReducedMotion()) {

    applyInstant();

    return;

  }



  const observer = new IntersectionObserver(

    (entries) => {

      entries.forEach((entry) => {

        if (entry.isIntersecting) {

          const bar = entry.target;

          const target = parseInt(bar.dataset.progress, 10);

          const label = bar.closest(".mt-4")?.querySelector(".progress-label");



          if (typeof gsap !== "undefined") {

            gsap.to(bar, {

              width: `${target}%`,

              duration: 1.2,

              ease: "power2.out",

              onUpdate: function () {

                if (label) {

                  const current = Math.round(this.progress() * target);

                  label.textContent = `${current}%`;

                }

              },

              onComplete: () => {

                if (label) label.textContent = `${target}%`;

              }

            });

          } else {

            bar.style.width = `${target}%`;

            if (label) label.textContent = `${target}%`;

          }



          observer.unobserve(bar);

        }

      });

    },

    { threshold: 0.2 }

  );



  bars.forEach((bar) => observer.observe(bar));

}



/**

 * حركة staggered fade-in لكورسات Dashboard (GSAP)

 */

function animateDashboardStagger() {

  const container = document.getElementById("enrolled-courses");

  if (!container || !container.children.length) return;



  if (prefersReducedMotion() || typeof gsap === "undefined") return;



  gsap.from(container.children, {

    opacity: 0,

    y: 30,

    duration: 0.5,

    stagger: 0.12,

    ease: "power2.out",

    delay: 0.2

  });

}



/**

 * Toast Notification — إشعار منبثق مؤقت في أسفل الشاشة

 * @param {string} message - نص الإشعار

 * @param {string} type - النوع: success | info | error

 */

function showToast(message, type = "success") {

  const existing = document.getElementById("toast");

  if (existing) existing.remove();



  const colors = {

    success: "bg-green-600",

    info: "bg-blue-600",

    error: "bg-red-600"

  };



  const icons = {

    success: "fa-check-circle",

    info: "fa-info-circle",

    error: "fa-exclamation-circle"

  };



  const toast = document.createElement("div");

  toast.id = "toast";

  toast.className = `fixed bottom-6 left-1/2 -translate-x-1/2 z-[99999] ${colors[type]} text-white px-6 py-3 rounded-xl shadow-2xl text-sm font-semibold transition-all duration-300 opacity-0 translate-y-4 flex items-center gap-2`;

  toast.innerHTML = `<i class="fas ${icons[type]}"></i><span>${message}</span>`;

  document.body.appendChild(toast);



  requestAnimationFrame(() => {

    toast.classList.remove("opacity-0", "translate-y-4");

  });



  setTimeout(() => {

    toast.classList.add("opacity-0", "translate-y-4");

    setTimeout(() => toast.remove(), 300);

  }, 3000);

}


