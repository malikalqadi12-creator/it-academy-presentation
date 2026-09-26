/* ===== عناصر الصفحة ===== */
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

let currentIndex = 0;

/* ===== تهيئة ===== */
totalEl.textContent = totalSlides;
buildOverview();
showSlide(0);

/* ===== عرض شريحة معينة ===== */
function showSlide(index) {
  if (index < 0) index = 0;
  if (index >= totalSlides) index = totalSlides - 1;

  slides.forEach((slide, i) => {
    slide.classList.toggle('is-active', i === index);
  });

  currentIndex = index;
  currentEl.textContent = index + 1;

  // شريط التقدم
  const percent = ((index + 1) / totalSlides) * 100;
  progressBar.style.width = percent + '%';

  // تحديث الملاحظات إذا كان الدرج مفتوحاً
  if (notesDrawer.classList.contains('is-open')) {
    updateNotes();
  }

  // تحديث الفهرس
  updateOverviewActive();

  // إعادة التمرير للأعلى داخل الشريحة
  const activeSlide = slides[index];
  if (activeSlide) activeSlide.scrollTop = 0;
}

/* ===== التنقل ===== */
function nextSlide() {
  if (currentIndex < totalSlides - 1) {
    showSlide(currentIndex + 1);
  }
}

function prevSlide() {
  if (currentIndex > 0) {
    showSlide(currentIndex - 1);
  }
}

btnNext.addEventListener('click', nextSlide);
btnPrev.addEventListener('click', prevSlide);

/* ===== لوحة المفاتيح ===== */
document.addEventListener('keydown', (e) => {
  // تجاهل إذا كان المستخدم يكتب في حقل إدخال
  if (e.target.matches('input, textarea, select')) return;

  switch (e.key) {
    case 'ArrowLeft':
      // في RTL: السهم الأيسر = التالي
      nextSlide();
      break;
    case 'ArrowRight':
      // في RTL: السهم الأيمن = السابق
      prevSlide();
      break;
    case ' ':
    case 'PageDown':
      e.preventDefault();
      nextSlide();
      break;
    case 'PageUp':
      e.preventDefault();
      prevSlide();
      break;
    case 'Home':
      e.preventDefault();
      showSlide(0);
      break;
    case 'End':
      e.preventDefault();
      showSlide(totalSlides - 1);
      break;
    case 'n':
    case 'N':
      toggleNotes();
      break;
    case 'o':
    case 'O':
      toggleOverview();
      break;
    case 'f':
    case 'F':
      toggleFullscreen();
      break;
    case 'Escape':
      if (overview.classList.contains('is-open')) {
        closeOverview();
      } else if (notesDrawer.classList.contains('is-open')) {
        closeNotes();
      }
      break;
  }
});

/* ===== اللمس (السحب) ===== */
let touchStartX = 0;
let touchStartY = 0;

deck.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

deck.addEventListener('touchend', (e) => {
  const dx = e.changedTouches[0].screenX - touchStartX;
  const dy = e.changedTouches[0].screenY - touchStartY;

  // تجاهل السحب العمودي
  if (Math.abs(dy) > Math.abs(dx)) return;
  if (Math.abs(dx) < 50) return;

  if (dx > 0) {
    // سحب لليمين = السابق (في RTL)
    prevSlide();
  } else {
    // سحب لليسار = التالي (في RTL)
    nextSlide();
  }
}, { passive: true });

/* ===== ملاحظات المتحدث ===== */
function updateNotes() {
  const activeSlide = slides[currentIndex];
  const notesEl = activeSlide.querySelector('.notes');
  if (notesEl) {
    notesBody.innerHTML = notesEl.innerHTML;
  } else {
    notesBody.innerHTML = '<p>لا توجد ملاحظات لهذه الشريحة.</p>';
  }
}

function openNotes() {
  updateNotes();
  notesDrawer.classList.add('is-open');
  notesDrawer.setAttribute('aria-hidden', 'false');
}

function closeNotes() {
  notesDrawer.classList.remove('is-open');
  notesDrawer.setAttribute('aria-hidden', 'true');
}

function toggleNotes() {
  if (notesDrawer.classList.contains('is-open')) {
    closeNotes();
  } else {
    openNotes();
  }
}

btnNotes.addEventListener('click', toggleNotes);
btnCloseNotes.addEventListener('click', closeNotes);

/* ===== الفهرس ===== */
function buildOverview() {
  overviewGrid.innerHTML = '';
  slides.forEach((slide, i) => {
    const title = slide.dataset.title || `شريحة ${i + 1}`;
    const item = document.createElement('div');
    item.className = 'overview__item';
    item.dataset.index = i;
    item.innerHTML = `<span>${i + 1}</span><span>${title}</span>`;
    item.addEventListener('click', () => {
      showSlide(i);
      closeOverview();
    });
    overviewGrid.appendChild(item);
  });
}

function updateOverviewActive() {
  const items = overviewGrid.querySelectorAll('.overview__item');
  items.forEach((item, i) => {
    item.classList.toggle('is-current', i === currentIndex);
  });
}

function openOverview() {
  updateOverviewActive();
  overview.classList.add('is-open');
  overview.setAttribute('aria-hidden', 'false');
}

function closeOverview() {
  overview.classList.remove('is-open');
  overview.setAttribute('aria-hidden', 'true');
}

function toggleOverview() {
  if (overview.classList.contains('is-open')) {
    closeOverview();
  } else {
    openOverview();
  }
}

btnOverview.addEventListener('click', toggleOverview);
btnCloseOverview.addEventListener('click', closeOverview);

// إغلاق الفهرس عند النقر خارج اللوحة
overview.addEventListener('click', (e) => {
  if (e.target === overview) closeOverview();
});

/* ===== ملء الشاشة ===== */
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen().catch(() => {});
  }
}

btnFull.addEventListener('click', toggleFullscreen);

/* ===== مراقبة تغيير حجم النافذة ===== */
window.addEventListener('resize', () => {
  // لا حاجة لإجراءات خاصة حالياً
});