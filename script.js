/* ============================================================
   IT Academy — العرض التدريبي التفاعلي
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const slides = document.querySelectorAll('.slide');
  const totalSlides = slides.length;
  const progressBar = document.getElementById('progressBar');
  const currentEl = document.getElementById('current');
  const totalEl = document.getElementById('total');
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  const btnNotes = document.getElementById('btnNotes');
  const btnCloseNotes = document.getElementById('btnCloseNotes');
  const notesDrawer = document.getElementById('notesDrawer');
  const notesBody = document.getElementById('notesBody');
  const btnOverview = document.getElementById('btnOverview');
  const btnCloseOverview = document.getElementById('btnCloseOverview');
  const overview = document.getElementById('overview');
  const overviewGrid = document.getElementById('overviewGrid');
  const btnFull = document.getElementById('btnFull');
  const deck = document.getElementById('deck');
  const btnPresenter = document.getElementById('btnPresenter');
  const btnPrint = document.getElementById('btnPrint');
  const btnShare = document.getElementById('btnShare');
  const btnTheme = document.getElementById('btnTheme');
  const btnFont = document.getElementById('btnFont');
  const fontLabel = document.getElementById('fontLabel');
  const themeIcon = document.getElementById('themeIcon');
  const btnLogout = document.getElementById('btnLogout');

  let currentIndex = 0;
  const urlParams = new URLSearchParams(location.search);
  const isPresenterMode = urlParams.get('presenter') === '1';

  const FONT_SIZES = ['font-sm', 'font-md', 'font-lg', 'font-xl'];
  const FONT_LABELS = ['الخط 85%', 'الخط 100%', 'الخط 115%', 'الخط 125%'];

  function showSlide(index) {
    if (index < 0) index = 0;
    if (index >= totalSlides) index = totalSlides - 1;
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === index);
    });
    currentIndex = index;
    if (currentEl) currentEl.textContent = index + 1;
    if (totalEl) totalEl.textContent = totalSlides;
    if (progressBar) {
      const percent = ((index + 1) / totalSlides) * 100;
      progressBar.style.width = percent + '%';
    }
    if (notesDrawer && notesDrawer.classList.contains('is-open')) {
      updateNotes();
    }
    updateOverviewActive();
    try { localStorage.setItem('it-academy-slide', index); } catch (e) {}
    const activeSlide = slides[index];
    if (activeSlide) activeSlide.scrollTop = 0;
  }

  function nextSlide() {
    if (currentIndex < totalSlides - 1) showSlide(currentIndex + 1);
  }

  function prevSlide() {
    if (currentIndex > 0) showSlide(currentIndex - 1);
  }

  if (btnNext) btnNext.addEventListener('click', nextSlide);
  if (btnPrev) btnPrev.addEventListener('click', prevSlide);

  document.addEventListener('keydown', (e) => {
    if (e.target.matches('input, textarea, select')) return;
    switch (e.key) {
      case 'ArrowLeft': nextSlide(); break;
      case 'ArrowRight': prevSlide(); break;
      case ' ':
      case 'PageDown': e.preventDefault(); nextSlide(); break;
      case 'PageUp': e.preventDefault(); prevSlide(); break;
      case 'Home': e.preventDefault(); showSlide(0); break;
      case 'End': e.preventDefault(); showSlide(totalSlides - 1); break;
      case 'n': case 'N': toggleNotes(); break;
      case 'o': case 'O': toggleOverview(); break;
      case 't': case 'T': toggleTheme(); break;
      case 'p': case 'P': openPresenterMode(); break;
      case 's': case 'S': shareSlideLink(); break;
      case 'Escape':
        if (overview && overview.classList.contains('is-open')) closeOverview();
        else if (notesDrawer && notesDrawer.classList.contains('is-open')) closeNotes();
        break;
    }
  });

  let touchStartX = 0, touchStartY = 0, touchStartTime = 0;

  if (deck) {
    deck.addEventListener('touchstart', (e) => {
      const t = e.changedTouches[0];
      touchStartX = t.screenX;
      touchStartY = t.screenY;
      touchStartTime = Date.now();
    }, { passive: true });

    deck.addEventListener('touchend', (e) => {
      const t = e.changedTouches[0];
      const dx = t.screenX - touchStartX;
      const dy = t.screenY - touchStartY;
      const dt = Date.now() - touchStartTime;
      if (Math.abs(dy) > Math.abs(dx)) return;
      const velocity = Math.abs(dx) / dt;
      if (Math.abs(dx) < 50 && velocity < 0.5) return;
      if (dx > 0) prevSlide();
      else nextSlide();
    }, { passive: true });
  }

  function updateNotes() {
    const activeSlide = slides[currentIndex];
    const notesEl = activeSlide ? activeSlide.querySelector('.notes') : null;
    if (notesBody) {
      notesBody.innerHTML = notesEl ? notesEl.innerHTML : '<p>لا توجد ملاحظات لهذه الشريحة.</p>';
    }
  }

  function openNotes() {
    updateNotes();
    if (notesDrawer) {
      notesDrawer.classList.add('is-open');
      notesDrawer.setAttribute('aria-hidden', 'false');
    }
  }

  function closeNotes() {
    if (notesDrawer) {
      notesDrawer.classList.remove('is-open');
      notesDrawer.setAttribute('aria-hidden', 'true');
    }
  }

  function toggleNotes() {
    if (notesDrawer && notesDrawer.classList.contains('is-open')) closeNotes();
    else openNotes();
  }

  if (btnNotes) btnNotes.addEventListener('click', toggleNotes);
  if (btnCloseNotes) btnCloseNotes.addEventListener('click', closeNotes);

  function buildOverview() {
    if (!overviewGrid) return;
    overviewGrid.innerHTML = '';
    slides.forEach((slide, i) => {
      const title = slide.dataset.title || 'شريحة ' + (i + 1);
      const item = document.createElement('div');
      item.className = 'overview__item';
      item.dataset.index = i;
      item.innerHTML = '<span>' + (i + 1) + '</span><span>' + title + '</span>';
      item.addEventListener('click', () => {
        showSlide(i);
        closeOverview();
      });
      overviewGrid.appendChild(item);
    });
  }

  function updateOverviewActive() {
    if (!overviewGrid) return;
    const items = overviewGrid.querySelectorAll('.overview__item');
    items.forEach((item, i) => {
      item.classList.toggle('is-current', i === currentIndex);
    });
  }

  function openOverview() {
    updateOverviewActive();
    if (overview) {
      overview.classList.add('is-open');
      overview.setAttribute('aria-hidden', 'false');
    }
  }

  function closeOverview() {
    if (overview) {
      overview.classList.remove('is-open');
      overview.setAttribute('aria-hidden', 'true');
    }
  }

  function toggleOverview() {
    if (overview && overview.classList.contains('is-open')) closeOverview();
    else openOverview();
  }

  if (btnOverview) btnOverview.addEventListener('click', toggleOverview);
  if (btnCloseOverview) btnCloseOverview.addEventListener('click', closeOverview);
  if (overview) {
    overview.addEventListener('click', (e) => {
      if (e.target === overview) closeOverview();
    });
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }

  if (btnFull) btnFull.addEventListener('click', toggleFullscreen);

  function openPresenterMode() {
    const url = location.origin + location.pathname + '?presenter=1#slide-' + currentIndex;
    const features = 'width=1400,height=900,menubar=no,toolbar=no,location=no,status=no';
    const win = window.open(url, 'presenter', features);
    if (!win) showToast('⚠️ الرجاء السماح بالنوافذ المنبثقة');
    else showToast('🎬 تم فتح وضع العرض');
  }

  if (btnPresenter) btnPresenter.addEventListener('click', openPresenterMode);

  function exportToPDF() {
  closeNotes();
  closeOverview();
  showToast('🖨️ جاري التحضير للطباعة...');

  // انتظر 1.2 ثانية حتى يظهر Toast بوضوح
  setTimeout(() => {
    window.print();
  }, 3000);
}

  if (btnPrint) btnPrint.addEventListener('click', exportToPDF);

  function shareSlideLink() {
    const url = location.origin + location.pathname + '#slide-' + currentIndex;
    if (navigator.share) {
      navigator.share({
        title: 'تأمين البنية التحتية للشبكات',
        text: 'شريحة ' + (currentIndex + 1) + ': ' + (slides[currentIndex].dataset.title || ''),
        url: url
      }).catch(() => copyToClipboard(url));
    } else {
      copyToClipboard(url);
    }
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => showToast('✓ تم نسخ الرابط'))
        .catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showToast('✓ تم نسخ الرابط');
    } catch (e) {
      showToast('⚠️ تعذّر النسخ');
    }
    document.body.removeChild(ta);
  }

  if (btnShare) btnShare.addEventListener('click', shareSlideLink);

  function toggleTheme() {
    const isLight = document.body.classList.toggle('theme-light');
    try { localStorage.setItem('it-theme', isLight ? 'light' : 'dark'); } catch (e) {}
    updateThemeIcon(isLight);
    showToast(isLight ? '☀️ الوضع الفاتح' : '🌙 الوضع الداكن');
  }

  function updateThemeIcon(isLight) {
    if (!themeIcon) return;
    if (isLight) {
      themeIcon.innerHTML = '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>';
    } else {
      themeIcon.innerHTML = '<path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"/>';
    }
  }

  function applySavedTheme() {
    let saved = 'dark';
    try { saved = localStorage.getItem('it-theme') || 'dark'; } catch (e) {}
    if (saved === 'light') {
      document.body.classList.add('theme-light');
      updateThemeIcon(true);
    }
  }

  if (btnTheme) btnTheme.addEventListener('click', toggleTheme);

  function cycleFontSize() {
    let currentSize = 'md';
    try { currentSize = localStorage.getItem('it-font') || 'md'; } catch (e) {}
    const currentIdx = FONT_SIZES.indexOf('font-' + currentSize);
    const nextIdx = (currentIdx + 1) % FONT_SIZES.length;
    const nextSize = FONT_SIZES[nextIdx].replace('font-', '');
    applyFontSize(nextSize);
  }

  function applyFontSize(size) {
    FONT_SIZES.forEach(cls => document.body.classList.remove(cls));
    document.body.classList.add('font-' + size);
    const idx = FONT_SIZES.indexOf('font-' + size);
    if (fontLabel && idx >= 0) fontLabel.textContent = FONT_LABELS[idx];
    try { localStorage.setItem('it-font', size); } catch (e) {}
    showToast('🔍 ' + (FONT_LABELS[idx] || 'حجم الخط'));
  }

  function applySavedFontSize() {
    let saved = 'md';
    try { saved = localStorage.getItem('it-font') || 'md'; } catch (e) {}
    applyFontSize(saved);
  }

  if (btnFont) btnFont.addEventListener('click', cycleFontSize);

  if (btnLogout) {
    btnLogout.addEventListener('click', async () => {
      if (!confirm('هل تريد تسجيل الخروج؟')) return;
      if (window.__firebaseSignOut) {
        await window.__firebaseSignOut();
      } else {
        window.location.href = 'login.html';
      }
    });
  }

  function showToast(message) {
    const old = document.querySelector('.toast');
    if (old) old.remove();
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('is-visible'));
    setTimeout(() => {
      toast.classList.remove('is-visible');
      setTimeout(() => toast.remove(), 400);
    }, 2500);
  }

  function fixViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', vh + 'px');
  }

  fixViewportHeight();
  window.addEventListener('resize', fixViewportHeight);
  window.addEventListener('orientationchange', () => {
    setTimeout(fixViewportHeight, 100);
    setTimeout(fixViewportHeight, 500);
  });

  applySavedTheme();
  applySavedFontSize();
  buildOverview();

  const hash = location.hash.match(/#slide-(\d+)/);
  if (hash) {
    const idx = parseInt(hash[1], 10);
    if (idx >= 0 && idx < totalSlides) currentIndex = idx;
  }

  showSlide(currentIndex);

  console.log('✅ IT Academy — العرض التدريبي جاهز');
});