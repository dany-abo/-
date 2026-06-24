/**
 * Mobile Navbar Fix - نسخة بسيطة جداً
 */

(function() {
  'use strict';

  function isMobile() {
    return window.innerWidth <= 640;
  }

  function fixNavbar() {
    if (!isMobile()) return;

    const navbar = document.getElementById('main-navbar');
    if (!navbar) return;

    // تطبيق مباشر
    navbar.style.width = '100vw';
    navbar.style.left = '0';
    navbar.style.right = '0';
    navbar.style.margin = '0';
    navbar.style.padding = '0';
    navbar.style.transform = 'none';

    const container = navbar.querySelector('.navbar-container') || navbar.querySelector('div');
    if (container) {
      container.style.width = '100%';
      container.style.maxWidth = 'none';
      container.style.margin = '0';
      container.style.paddingLeft = '1rem';
      container.style.paddingRight = '1rem';
    }

    // طباعة للتأكد
    console.log('✅ Navbar Fixed:', {
      navbarWidth: navbar.offsetWidth,
      windowWidth: window.innerWidth,
      match: navbar.offsetWidth === window.innerWidth
    });
  }

  // تطبيق فوراً
  fixNavbar();

  // تطبيق عند DOMContentLoaded
  document.addEventListener('DOMContentLoaded', fixNavbar);

  // تطبيق عند load
  window.addEventListener('load', fixNavbar);

  // تطبيق عند scroll (بدون تعقيد)
  window.addEventListener('scroll', fixNavbar, { passive: true });

  // تطبيق عند resize
  window.addEventListener('resize', fixNavbar);

})();
