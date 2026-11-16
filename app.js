(() => {
  'use strict';

  function initialize() {
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');

    if (menuToggle && mainNav) {
      const setMenuOpen = (open) => {
        mainNav.classList.toggle('is-open', open);
        menuToggle.setAttribute('aria-expanded', String(open));
        menuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      };

      menuToggle.addEventListener('click', () => {
        setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
      });

      mainNav.addEventListener('click', (event) => {
        if (event.target instanceof Element && event.target.closest('a')) {
          setMenuOpen(false);
        }
      });

      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
          setMenuOpen(false);
          menuToggle.focus();
        }
      });

      window.addEventListener('resize', () => {
        if (window.innerWidth > 800) setMenuOpen(false);
      });
    }

    const craving = document.getElementById('antojo');
    const detail = document.getElementById('detalle');
    const inquiryLink = document.getElementById('inquiry-link');
    const inquiryPreview = document.getElementById('inquiry-preview');
    const labels = {
      helados: 'Helados',
      frutas: 'Ensaladas de frutas',
      salpicon: 'Salpicón',
      malteadas: 'Malteadas',
    };

    if (craving && inquiryLink && inquiryPreview) {
      const updateInquiry = () => {
        const selected = labels[craving.value] || labels.helados;
        const extra = detail ? detail.value.trim().slice(0, 300) : '';
        const message = `Hola, Helados Los Pekes. Quisiera consultar las opciones, los precios y la disponibilidad de ${selected.toLowerCase()}.${extra ? `\n\n${extra}` : ''}`;
        inquiryPreview.textContent = message;
        inquiryLink.href = `https://wa.me/573158936313?text=${encodeURIComponent(message)}`;
      };

      craving.addEventListener('change', updateInquiry);
      if (detail) detail.addEventListener('input', updateInquiry);

      document.querySelectorAll('[data-craving]').forEach((shortcut) => {
        shortcut.addEventListener('click', () => {
          const value = shortcut.getAttribute('data-craving');
          if (Object.prototype.hasOwnProperty.call(labels, value)) {
            craving.value = value;
            updateInquiry();
          }
        });
      });

      updateInquiry();
    }

    const privacyOpen = document.getElementById('privacy-open');
    const privacyClose = document.getElementById('privacy-close');
    const privacyDialog = document.getElementById('privacy-dialog');

    if (privacyOpen && privacyDialog && typeof privacyDialog.showModal === 'function') {
      let previousFocus = privacyOpen;

      privacyOpen.addEventListener('click', () => {
        if (privacyDialog.open) return;
        previousFocus = document.activeElement;
        privacyDialog.showModal();
      });

      if (privacyClose) {
        privacyClose.addEventListener('click', () => privacyDialog.close());
      }

      privacyDialog.addEventListener('click', (event) => {
        if (event.target !== privacyDialog) return;
        const bounds = privacyDialog.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right ||
            event.clientY < bounds.top || event.clientY > bounds.bottom) {
          privacyDialog.close();
        }
      });

      privacyDialog.addEventListener('close', () => {
        if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
          previousFocus.focus();
        } else {
          privacyOpen.focus();
        }
      });
    }

    const currentYear = document.getElementById('current-year');
    if (currentYear) currentYear.textContent = String(new Date().getFullYear());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
})();
