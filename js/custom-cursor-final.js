/**
 * ============================================================
 * Custom Cursor - المؤشر المخصص للمنصة
 * ============================================================
 * يعمل فقط على أجهزة الديسكتوب (شاشات غير لمسية)
 * يتكون من:
 * - دائرة خارجية (16px) تتبع الماوس بسلاسة
 * - تكبير إلى 32px عند المرور على الأزرار والروابط
 * ============================================================
 */

/**
 * تهيئة المؤشر المخصص
 */
function initCustomCursor() {
  // التحقق من أن المستخدم لا يفضل تقليل الحركة
  if (prefersReducedMotion()) return;
  
  // التحقق من أن الجهاز ليس جهاز لمس (شاشة لمسية)
  if (!window.matchMedia("(pointer: fine)").matches) return;

  // العناصر التي يجب أن تكبر الدائرة عند المرور عليها
  const HOVER_SELECTOR =
    "a, button, input, textarea, select, label, [role='button'], [data-enroll-id], .course-card, [onclick]";

  // إنشاء الدائرة الخارجية
  const cursor = document.createElement("div");
  cursor.id = "custom-cursor";
  cursor.setAttribute("aria-hidden", "true");
  document.body.appendChild(cursor);

  // متغيرات لتخزين مواقع الماوس والدائرة
  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;

  // تتبع حركة الماوس
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // إظهار الدائرة
    cursor.classList.add("is-visible");
    
    // إضافة/إزالة class عند المرور على العناصر القابلة للنقر
    const isHovering = !!e.target.closest(HOVER_SELECTOR);
    cursor.classList.toggle("is-hover", isHovering);
  });

  // إخفاء المؤشر عند مغادرة الصفحة
  document.addEventListener("mouseleave", () => {
    cursor.classList.remove("is-visible", "is-hover");
  });

  // الدائرة - حركة ناعمة (easing)
  function followMouse() {
    // easing factor: 0.15 = حركة ناعمة وسلسة
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    
    requestAnimationFrame(followMouse);
  }

  // بدء الحركة
  followMouse();
}

/**
 * التحقق من تفضيل المستخدم لتقليل الحركات
 * @returns {boolean}
 */
function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
