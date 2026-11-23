/**
 * Viana & Alencar Advogados Associados — Shared Interactive Controller
 * Smooth scroll (Lenis), GSAP ScrollTrigger reveals, Mobile Drawer,
 * Multichannel Consultation Modal & Clipboard helpers.
 */

const FIRM_CONFIG = {
  name: 'Viana & Alencar',
  fullName: 'Viana & Alencar Advogados Associados',
  oab: 'OAB/SP 41.892-J',
  phoneDisplay: '(11) 3042-8800',
  phoneRaw: '551130428800',
  whatsappRaw: '5511999990000',
  whatsappDisplay: '(11) 99999-0000',
  email: 'contato@vianaalencar.adv.br',
  address: 'Av. Brigadeiro Faria Lima, 3.477 — 14º andar, Itaim Bibi, São Paulo - SP'
};

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initActiveNavLink();
  initMobileDrawer();
  initConsultationModal();
  initSmoothScrollAndAnimations();
  initCounters();
});

/* --------------------------------------------------------------------------
   1. Header Glassmorphism on Scroll
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const isHeroTransparent = header.dataset.transparent === 'true';

  const updateHeader = () => {
    if (!isHeroTransparent) {
      header.classList.add('is-solid');
      return;
    }
    if (window.scrollY > 40) {
      header.classList.remove('is-transparent');
      header.classList.add('is-scrolled');
    } else {
      header.classList.add('is-transparent');
      header.classList.remove('is-scrolled');
    }
  };

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
}

/* --------------------------------------------------------------------------
   2. Active Navigation Highlight
   -------------------------------------------------------------------------- */
function initActiveNavLink() {
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-nav-page]').forEach(link => {
    if (link.dataset.navPage === currentFile) {
      link.classList.add('active');
    }
  });
}

/* --------------------------------------------------------------------------
   3. Mobile Drawer Menu
   -------------------------------------------------------------------------- */
function initMobileDrawer() {
  const openBtn = document.getElementById('mobile-menu-open');
  const closeBtn = document.getElementById('mobile-menu-close');
  const drawer = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('mobile-drawer-backdrop');

  if (!openBtn || !drawer || !backdrop) return;

  const openDrawer = () => {
    drawer.classList.add('open');
    backdrop.classList.add('open');
    document.body.classList.add('no-scroll');
    openBtn.setAttribute('aria-expanded', 'true');
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.classList.remove('no-scroll');
    openBtn.setAttribute('aria-expanded', 'false');
  };

  openBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);

  drawer.querySelectorAll('a, button[data-open-consult]').forEach(el => {
    el.addEventListener('click', () => {
      closeDrawer();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

/* --------------------------------------------------------------------------
   4. Global Multichannel Consultation Modal
   -------------------------------------------------------------------------- */
function initConsultationModal() {
  const modal = document.getElementById('consult-modal');
  if (!modal) return;

  const form = document.getElementById('consult-form');
  const formView = document.getElementById('consult-form-view');
  const successView = document.getElementById('consult-success-view');
  const closeBtns = modal.querySelectorAll('[data-close-modal]');
  const formatInput = document.getElementById('consult-format');
  const periodInput = document.getElementById('consult-period');
  const areaSelect = document.getElementById('consult-area');

  const openModal = (presetArea) => {
    if (presetArea && areaSelect) {
      areaSelect.value = presetArea;
    }
    if (formView && successView) {
      formView.classList.remove('hidden');
      successView.classList.add('hidden');
    }
    modal.classList.add('open');
    document.body.classList.add('no-scroll');
  };

  const closeModal = () => {
    modal.classList.remove('open');
    document.body.classList.remove('no-scroll');
  };

  document.querySelectorAll('[data-open-consult]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const area = trigger.dataset.consultArea || '';
      openModal(area);
    });
  });

  // Hero Quick-Triage Bar integration
  const heroTriageBtn = document.getElementById('hero-triage-btn');
  const heroAreaSelect = document.getElementById('hero-area-select');
  if (heroTriageBtn) {
    heroTriageBtn.addEventListener('click', () => {
      openModal(heroAreaSelect ? heroAreaSelect.value : '');
    });
  }

  closeBtns.forEach(btn => btn.addEventListener('click', closeModal));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  // Segmented pills for Meeting Format & Period
  modal.querySelectorAll('[data-format-pill]').forEach(pill => {
    pill.addEventListener('click', () => {
      modal.querySelectorAll('[data-format-pill]').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      if (formatInput) formatInput.value = pill.dataset.formatPill;
    });
  });

  modal.querySelectorAll('[data-period-pill]').forEach(pill => {
    pill.addEventListener('click', () => {
      modal.querySelectorAll('[data-period-pill]').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      if (periodInput) periodInput.value = pill.dataset.periodPill;
    });
  });

  // Form Submission -> Formal Protocol Confirmation + Optional WhatsApp summary
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nome = document.getElementById('consult-name')?.value.trim() || 'Cliente';
      const empresa = document.getElementById('consult-company')?.value.trim();
      const email = document.getElementById('consult-email')?.value.trim() || '';
      const area = areaSelect?.value || 'Consulta Geral';
      const formato = formatInput?.value || 'Videoconferência';
      const periodo = periodInput?.value || 'Manhã (09h–12h)';
      const resumo = document.getElementById('consult-notes')?.value.trim() || '';

      const protocolo = 'VA-' + Math.floor(100000 + Math.random() * 900000);
      const protoEl = document.getElementById('consult-protocol-code');
      const summaryEl = document.getElementById('consult-protocol-summary');
      const waFallback = document.getElementById('consult-wa-fallback');

      if (protoEl) protoEl.textContent = protocolo;
      if (summaryEl) {
        summaryEl.textContent = `${formato} • ${periodo} • Área: ${area}. Enviaremos a confirmação para ${email}.`;
      }

      if (waFallback) {
        const msg = [
          `Olá, recepção da ${FIRM_CONFIG.fullName}.`,
          `Registrei uma solicitação no site (Protocolo ${protocolo}):`,
          `• Nome: ${nome}${empresa ? ` (${empresa})` : ''}`,
          `• Área: ${area}`,
          `• Preferência: ${formato} — ${periodo}`,
          resumo ? `• Resumo: ${resumo}` : ''
        ].filter(Boolean).join('\n');
        waFallback.href = `https://wa.me/${FIRM_CONFIG.whatsappRaw}?text=${encodeURIComponent(msg)}`;
      }

      formView.classList.add('hidden');
      successView.classList.remove('hidden');
      form.reset();
    });
  }
}

/* --------------------------------------------------------------------------
   5. Lenis Smooth Scroll & GSAP ScrollTrigger Reveals
   -------------------------------------------------------------------------- */
function initSmoothScrollAndAnimations() {
  // Lenis Smooth Scroll (graceful check)
  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
    }
  }

  // GSAP ScrollTrigger staggered animations (uses .from so content is visible even if JS lags)
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Hero entrance
    const heroItems = document.querySelectorAll('.hero-reveal');
    if (heroItems.length) {
      gsap.from(heroItems, {
        y: 26,
        opacity: 0,
        duration: 0.85,
        stagger: 0.12,
        ease: 'power3.out',
        clearProps: 'transform,opacity'
      });
    }

    // Section staggered reveals
    document.querySelectorAll('.reveal-group').forEach(group => {
      const children = group.querySelectorAll('.reveal-item');
      if (!children.length) return;
      gsap.from(children, {
        y: 28,
        opacity: 0,
        duration: 0.75,
        stagger: 0.1,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: group,
          start: 'top 95%',
          once: true
        }
      });
    });

    // Single block reveals
    document.querySelectorAll('.reveal-block').forEach(block => {
      gsap.from(block, {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: block,
          start: 'top 95%',
          once: true
        }
      });
    });
  }
}

/* --------------------------------------------------------------------------
   6. Animated Authority Counters
   -------------------------------------------------------------------------- */
function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.counter, 10);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    if (isNaN(target)) return;

    let start = 0;
    const duration = 1400;
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = `${prefix}${current}${suffix}`;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = `${prefix}${target}${suffix}`;
      }
    };
    requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });

    counters.forEach(c => observer.observe(c));
  } else {
    counters.forEach(animateCounter);
  }
}

/* --------------------------------------------------------------------------
   7. Clipboard & Toast Helper (Used across Contact & Footer)
   -------------------------------------------------------------------------- */
window.copyToClipboard = function(text, label = 'Copiado para a área de transferência!') {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => showToast(label)).catch(() => showToast(label));
  } else {
    showToast(label);
  }
};

window.showToast = function(message) {
  let toast = document.getElementById('global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'global-toast';
    toast.className = 'toast-banner';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i class="fa-solid fa-check text-[#B8924A]"></i><span>${message}</span>`;
  toast.classList.add('show');
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
};
