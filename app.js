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
        const message = `Te contactamos desde la página de Helados Los Pekes. Queremos consultar las opciones, los precios y la disponibilidad de ${selected.toLowerCase()}.${extra ? `\n\n${extra}` : ''}`;
        inquiryPreview.textContent = message;
        inquiryLink.href = `https://wa.me/573212822922?text=${encodeURIComponent(message)}`;
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

    const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    const galleryMore = document.getElementById('gallery-more');
    const galleryCount = document.getElementById('gallery-count');

    if (galleryMore) {
      galleryMore.addEventListener('click', () => {
        const firstRevealed = galleryItems.find((item) => item.hidden);
        galleryItems.forEach((item) => { item.hidden = false; });
        galleryMore.hidden = true;
        if (galleryCount) galleryCount.textContent = `${galleryItems.length} fotos`;
        // Keep keyboard users at the beginning of the newly revealed photos.
        const nextPhoto = firstRevealed?.querySelector('.gallery-open');
        if (nextPhoto instanceof HTMLElement) nextPhoto.focus({ preventScroll: true });
      });
    }

    const galleryButtons = Array.from(document.querySelectorAll('.gallery-open'))
      .filter((button) => button.getAttribute('data-gallery-src'));
    const galleryDialog = document.getElementById('gallery-dialog');
    const galleryImage = document.getElementById('gallery-image');
    const galleryCaption = document.getElementById('gallery-caption');
    const galleryPosition = document.getElementById('gallery-position');
    const gallerySource = document.getElementById('gallery-source');
    const galleryPrev = document.getElementById('gallery-prev');
    const galleryNext = document.getElementById('gallery-next');
    const galleryClose = document.getElementById('gallery-close');

    if (galleryButtons.length && galleryDialog && galleryImage &&
        typeof galleryDialog.showModal === 'function') {
      let galleryIndex = 0;
      let galleryOpener = null;

      const showGalleryPhoto = (index) => {
        galleryIndex = (index + galleryButtons.length) % galleryButtons.length;
        const button = galleryButtons[galleryIndex];
        galleryImage.alt = button.getAttribute('data-gallery-alt') || 'Foto de Helados Los Pekes';
        galleryImage.src = button.getAttribute('data-gallery-src');
        if (galleryCaption) {
          galleryCaption.textContent = button.getAttribute('data-gallery-caption') || '';
        }
        if (galleryPosition) {
          galleryPosition.textContent = `${galleryIndex + 1} / ${galleryButtons.length}`;
        }
        if (gallerySource) {
          const source = button.getAttribute('data-gallery-link');
          let validSource = false;
          try {
            const url = new URL(source || '');
            validSource = url.protocol === 'https:' &&
              (url.hostname === 'instagram.com' || url.hostname.endsWith('.instagram.com'));
          } catch (_) { /* Leave the source link hidden when no valid URL is present. */ }
          gallerySource.hidden = !validSource;
          if (validSource) {
            gallerySource.href = source;
            gallerySource.target = '_blank';
            gallerySource.rel = 'noopener noreferrer';
          } else {
            gallerySource.removeAttribute('href');
          }
        }
        if (galleryPrev) galleryPrev.disabled = galleryButtons.length < 2;
        if (galleryNext) galleryNext.disabled = galleryButtons.length < 2;
      };

      galleryButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
          galleryOpener = button;
          showGalleryPhoto(index);
          if (!galleryDialog.open) galleryDialog.showModal();
        });
      });

      if (galleryPrev) galleryPrev.addEventListener('click', () => showGalleryPhoto(galleryIndex - 1));
      if (galleryNext) galleryNext.addEventListener('click', () => showGalleryPhoto(galleryIndex + 1));
      if (galleryClose) galleryClose.addEventListener('click', () => galleryDialog.close());

      galleryDialog.addEventListener('keydown', (event) => {
        if (!galleryDialog.open || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
        event.preventDefault();
        showGalleryPhoto(galleryIndex + (event.key === 'ArrowRight' ? 1 : -1));
      });

      galleryDialog.addEventListener('click', (event) => {
        if (event.target !== galleryDialog) return;
        const bounds = galleryDialog.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right ||
            event.clientY < bounds.top || event.clientY > bounds.bottom) {
          galleryDialog.close();
        }
      });

      galleryDialog.addEventListener('close', () => {
        if (galleryOpener instanceof HTMLElement && galleryOpener.isConnected) {
          galleryOpener.focus({ preventScroll: true });
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
