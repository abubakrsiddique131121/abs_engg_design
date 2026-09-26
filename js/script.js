(function () {
  'use strict';

  /* =====================================================
     0. CONFIG — Google Apps Script Web App URL
     ===================================================== */
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyg35DQLXaz0KI2wfx5BXI6lBA75cw1G8Re886WmnuHj7kaXjxQ4uVUjTNyZakpw2yX/exec";

  /* =====================================================
     1. STICKY HEADER SHADOW
     ===================================================== */
  const header = document.getElementById('siteHeader');
  function onScrollHeader() {
    if (window.scrollY > 8) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  /* =====================================================
     2. MOBILE MENU
     ===================================================== */
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  function closeMobileMenu() {
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  function toggleMobileMenu() {
    const isOpen = mobileMenu.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', toggleMobileMenu);
  }

  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMobileMenu);
  });

  /* =====================================================
     3. SMOOTH SCROLL FOR ANCHOR LINKS (with sticky header offset)
     ===================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const headerHeight = header ? header.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 12;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* =====================================================
     4. ACTIVE NAV LINK ON SCROLL
     ===================================================== */
  const navLinks = Array.from(document.querySelectorAll('.main-nav .nav-link'));
  const navSections = navLinks
    .map(function (link) {
      const id = link.getAttribute('href');
      const el = document.querySelector(id);
      return el ? { link: link, el: el } : null;
    })
    .filter(Boolean);

  function updateActiveNav() {
    const scrollPos = window.scrollY + (header ? header.offsetHeight : 0) + 40;
    let current = navSections[0];
    navSections.forEach(function (entry) {
      if (entry.el.offsetTop <= scrollPos) current = entry;
    });
    navLinks.forEach(function (l) { l.classList.remove('active-link'); });
    if (current) current.link.classList.add('active-link');
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  /* =====================================================
     5. SCROLL-REVEAL ANIMATIONS
     ===================================================== */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* =====================================================
     6. FAQ ACCORDION
     ===================================================== */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    const btn = item.querySelector('.faq-question');
    btn.addEventListener('click', function () {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (openItem) {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        }
      });
      item.classList.toggle('open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  /* =====================================================
     7. "HOW WE WORK" PROCESS TABS
     ===================================================== */
  const processData = {
    1: {
      stage: 'STAGE 01 // REQUIREMENTS INTAKE',
      duration: 'PHASE DURATION: 24 - 48H',
      title: '01 — Understand Requirements',
      desc: 'We receive your requirements, sketches, CAD files, specifications, and reference information. We align on scope, deliverables, manufacturing constraints, and timelines.',
      tags: ['Input Verification', 'Scope Boundary', 'NDA Execution'],
      deliverableTitle: 'Project Statement of Work & Modeling Plan',
      deliverableDesc: 'No ambiguity: interfaces, fits, and datum structures are established before modeling begins.'
    },
    2: {
      stage: 'STAGE 02 // ENGINEERING ANALYSIS',
      duration: 'PHASE DURATION: 24 - 72H',
      title: '02 — Analyze Constraints',
      desc: 'We evaluate functional requirements, load paths, interfaces, and manufacturing constraints so every downstream design choice is grounded in engineering reality rather than assumption.',
      tags: ['Tolerance Planning', 'Interface Mapping', 'Material Review'],
      deliverableTitle: 'Engineering Feasibility & Constraint Summary',
      deliverableDesc: 'Confirms datum strategy, tolerance targets, and manufacturing approach ahead of modeling.'
    },
    3: {
      stage: 'STAGE 03 // MODEL & DRAWING DEVELOPMENT',
      duration: 'PHASE DURATION: VARIES BY SCOPE',
      title: '03 — Design the Solution',
      desc: 'Parts, assemblies, and manufacturing drawings are developed with a parametric, feature-based approach so the model stays editable and production-ready throughout revisions.',
      tags: ['Parametric Modeling', 'Assembly Constraints', 'Drawing Development'],
      deliverableTitle: 'Working CAD Model & Draft Drawings',
      deliverableDesc: 'A reviewable model and drawing set aligned to the agreed scope and specifications.'
    },
    4: {
      stage: 'STAGE 04 // DFM & INTERFERENCE REVIEW',
      duration: 'PHASE DURATION: 24 - 48H',
      title: '04 — Review for Manufacturing',
      desc: 'Every model is checked against design-for-manufacturing principles and reviewed for interference, tolerance stack-up, and shop-floor practicality before release.',
      tags: ['DFM Check', 'Interference Verification', 'Tolerance Stack-Up'],
      deliverableTitle: 'Design Review Report',
      deliverableDesc: 'A documented pass/fail review against manufacturability and assembly criteria.'
    },
    5: {
      stage: 'STAGE 05 // DOCUMENTATION',
      duration: 'PHASE DURATION: 24 - 48H',
      title: '05 — Document the Deliverable',
      desc: 'Manufacturing drawings, BOMs, and supporting technical documentation are finalized with clear revision control so the deliverable is ready for the shop floor.',
      tags: ['BOM Structuring', 'Drawing Finalization', 'Revision Control'],
      deliverableTitle: 'Complete Drawing Package & BOM',
      deliverableDesc: 'Shop-ready 2D drawings, structured BOM, and revision history in one package.'
    },
    6: {
      stage: 'STAGE 06 // RELEASE & HANDOFF',
      duration: 'PHASE DURATION: 24H',
      title: '06 — Deliver the Project',
      desc: 'Final native and neutral files, drawings, and documentation are packaged and delivered, with support available for any follow-up revisions or clarifications.',
      tags: ['Native & Neutral Export', 'Final QA Pass', 'Handoff Support'],
      deliverableTitle: 'Native & Neutral Release Archive',
      deliverableDesc: 'Complete, shop-floor ready deliverable package with ongoing revision support.'
    }
  };

  const processTabs = document.querySelectorAll('.process-tab');
  const processPanel = document.getElementById('processPanel');

  function renderProcessStep(step) {
    const d = processData[step];
    if (!d || !processPanel) return;
    processPanel.innerHTML =
      '<div class="process-panel-head">' +
        '<span class="mono-label blue">' + d.stage + '</span>' +
        '<span class="mono-label gray">' + d.duration + '</span>' +
      '</div>' +
      '<div class="process-panel-body">' +
        '<div>' +
          '<h3>' + d.title + '</h3>' +
          '<p>' + d.desc + '</p>' +
          '<div class="process-tags">' + d.tags.map(function (t) { return '<span>' + t + '</span>'; }).join('') + '</div>' +
        '</div>' +
        '<div class="process-deliverable">' +
          '<div class="mono-label">STAGE DELIVERABLE</div>' +
          '<h4>' + d.deliverableTitle + '</h4>' +
          '<p>' + d.deliverableDesc + '</p>' +
        '</div>' +
      '</div>';
  }

  processTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      processTabs.forEach(function (t) {
        t.classList.remove('active-tab');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active-tab');
      tab.setAttribute('aria-selected', 'true');
      renderProcessStep(tab.getAttribute('data-step'));
    });
  });

  renderProcessStep('1');

  /* =====================================================
     8. ENQUIRY FORM — Google Apps Script (no-cors GET)
     ===================================================== */
  const form = document.getElementById('enquiryForm');
  const submitBtn = document.getElementById('submitBtn');
  const formStatus = document.getElementById('formStatus');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('fieldName').value.trim();
      const email = document.getElementById('fieldEmail').value.trim();
      const phone = document.getElementById('fieldPhone').value.trim();

      formStatus.textContent = '';
      formStatus.className = 'form-status';

      if (!name || !email || !phone) {
        formStatus.textContent = 'Please fill in your name, email, and phone number.';
        formStatus.classList.add('error');
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        formStatus.textContent = 'Please enter a valid email address.';
        formStatus.classList.add('error');
        return;
      }

      submitBtn.disabled = true;
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span class="btn-text">Submitting…</span>';

      const params = new URLSearchParams({ name: name, email: email, phone: phone });
      const url = SCRIPT_URL + '?' + params.toString();

      fetch(url, {
        method: 'GET',
        mode: 'no-cors'
      })
        .then(function () {
          // Response is opaque under no-cors — treat completion as success.
          formStatus.textContent = 'Thank you. Your enquiry has been received. Our team will get back to you shortly.';
          formStatus.classList.add('success');
          form.reset();
        })
        .catch(function () {
          formStatus.textContent = 'We could not send your enquiry. Please check your connection and try again, or email us directly at absenggdesignsolution@gmail.com.';
          formStatus.classList.add('error');
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        });
    });
  }

})();