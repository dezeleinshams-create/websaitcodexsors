/**
 * CODEXSORS — Core Interactive Engine
 * Handles WhatsApp routing, Project Scope Calculator, Lead Storage, and UI Interactions
 */

const CODEXSORS_CONFIG = {
  phone: "0542572634",
  whatsappBase: "https://wa.me/966542572634",
  brandName: "CODEXSORS",
  officialWebsite: "codexsors.com"
};

// ==========================================================================
// WhatsApp Direct Message Builder
// ==========================================================================
function getWhatsAppUrl(customMessage) {
  const encoded = encodeURIComponent(customMessage.trim());
  return `${CODEXSORS_CONFIG.whatsappBase}?text=${encoded}`;
}

function openWhatsAppForService(serviceName) {
  const isAr = (window.i18n ? window.i18n.currentLang : 'ar') === 'ar';
  let msg = '';
  
  if (isAr) {
    msg = `السلام عليكم ورحمة الله،
أود الاستفسار من فريق CODEXSORS عن خدمة:
👉 *${serviceName}*

أرجو تزويدي بتفاصيل خطة العمل وطلب عرض سعر لمشروعي.`;
  } else {
    msg = `Hello CODEXSORS Team,
I am interested in your service:
👉 *${serviceName}*

Please provide me with project scope details and a tailored proposal.`;
  }

  window.open(getWhatsAppUrl(msg), '_blank');
}

// ==========================================================================
// Project Scope Calculator Logic
// ==========================================================================
const Calculator = {
  currentType: 'ecommerce',
  selectedFeatures: new Set(['payments', 'speed', 'responsive']),

  init() {
    const typeInputs = document.querySelectorAll('input[name="calc_project_type"]');
    typeInputs.forEach(input => {
      input.addEventListener('change', (e) => {
        this.currentType = e.target.value;
        document.querySelectorAll('.calc-opt-card, .type-option-label').forEach(lbl => lbl.classList.remove('active'));
        const card = e.target.closest('.calc-opt-card, .type-option-label');
        if (card) card.classList.add('active');
        this.updateSummary();
      });
    });

    const featureCheckboxes = document.querySelectorAll('input[name="calc_feature"]');
    featureCheckboxes.forEach(box => {
      box.addEventListener('change', (e) => {
        const lbl = e.target.closest('.calc-feat-label, .feature-check-label');
        if (e.target.checked) {
          this.selectedFeatures.add(e.target.value);
          if (lbl) lbl.classList.add('checked');
        } else {
          this.selectedFeatures.delete(e.target.value);
          if (lbl) lbl.classList.remove('checked');
        }
        this.updateSummary();
      });
    });

    const btnWa = document.getElementById('calcBtnWhatsApp');
    if (btnWa) {
      btnWa.addEventListener('click', () => this.sendToWhatsApp());
    }

    const btnQuote = document.getElementById('calcBtnQuote');
    if (btnQuote) {
      btnQuote.addEventListener('click', () => this.openQuoteWithCalcData());
    }

    this.updateSummary();
  },

  getProjectTypeName(type) {
    const map = {
      'website': { ar: 'موقع إلكتروني تعريفي / شركات', en: 'Corporate Website' },
      'ecommerce': { ar: 'متجر إلكتروني متكامل', en: 'E-Commerce Store' },
      'app': { ar: 'تطبيق جوال (iOS & Android)', en: 'Mobile App' },
      'custom': { ar: 'نظام برمجي خاص / لوحة تحكم', en: 'Custom Software / Dashboard' },
      'seo_ads': { ar: 'تهيئة SEO وحملات إعلانية', en: 'SEO & Google Ads' }
    };
    const isAr = (window.i18n ? window.i18n.currentLang : 'ar') === 'ar';
    return (map[type] && map[type][isAr ? 'ar' : 'en']) || type;
  },

  getFeatureName(code) {
    const map = {
      'payments': { ar: 'بوابات دفع إلكتروني سعودية (مدى / Apple Pay)', en: 'Saudi Payment Gateways' },
      'shipping': { ar: 'ربط شركات الشحن والتوصيل', en: 'Courier & Shipping APIs' },
      'dashboard': { ar: 'لوحة تحكم إدارية مخصصة', en: 'Custom Admin Dashboard' },
      'speed': { ar: 'تحسين سرعة وأداء استثنائي', en: 'Ultra-fast Performance Optimization' },
      'seo': { ar: 'تهيئة كاملة لمحركات البحث SEO', en: 'Complete SEO Optimization' },
      'responsive': { ar: 'تصميم متوافق بنسبة 100% مع الجوال', en: '100% Mobile Responsive' },
      'security': { ar: 'حماية وتأمين متقدم وشهادات SSL', en: 'Advanced Security & SSL' },
      'notifications': { ar: 'نظام إشعارات وتنبيهات فورية', en: 'Push Notifications System' }
    };
    const isAr = (window.i18n ? window.i18n.currentLang : 'ar') === 'ar';
    return (map[code] && map[code][isAr ? 'ar' : 'en']) || code;
  },

  updateSummary() {
    const typeEl = document.getElementById('calcSummaryType');
    const countEl = document.getElementById('calcSummaryFeaturesCount');
    if (typeEl) typeEl.textContent = this.getProjectTypeName(this.currentType);
    if (countEl) countEl.textContent = `${this.selectedFeatures.size} ميزات مختارة`;
  },

  generateSummaryText() {
    const isAr = (window.i18n ? window.i18n.currentLang : 'ar') === 'ar';
    const type = this.getProjectTypeName(this.currentType);
    const featuresList = Array.from(this.selectedFeatures).map(f => `• ${this.getFeatureName(f)}`).join('\n');

    if (isAr) {
      return `مرحباً CODEXSORS،
قمت بتحديد مواصفات مشروعي عبر حاسبة الموقع وأود مناقشة تفاصيله وعرض السعر:

📌 نوع المشروع:
*${type}*

⚙️ الخصائص والميزات المطلوبة:
${featuresList}

بانتظار تواصلكم لمناقشة خطة التنفيذ. شكراً لكم.`;
    } else {
      return `Hello CODEXSORS Team,
I scoped my project requirements via your website calculator:

📌 Project Type:
*${type}*

⚙️ Selected Key Features:
${featuresList}

Looking forward to your tailored proposal and discussion. Thank you.`;
    }
  },

  sendToWhatsApp() {
    const text = this.generateSummaryText();
    window.open(getWhatsAppUrl(text), '_blank');
  },

  openQuoteWithCalcData() {
    const typeName = this.getProjectTypeName(this.currentType);
    const featuresList = Array.from(this.selectedFeatures).map(f => this.getFeatureName(f)).join(', ');
    const note = `نوع المشروع: ${typeName}\nالميزات المختارة: ${featuresList}`;
    
    QuoteModal.open(typeName, note);
  }
};

// ==========================================================================
// Quote Modal Controller
// ==========================================================================
const QuoteModal = {
  overlay: null,

  init() {
    this.overlay = document.getElementById('quoteModalOverlay');
    const closeBtn = document.getElementById('modalCloseBtn');
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());

    if (this.overlay) {
      this.overlay.addEventListener('click', (e) => {
        if (e.target === this.overlay) this.close();
      });
    }

    // Connect trigger buttons
    document.querySelectorAll('.open-quote-modal-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const service = btn.getAttribute('data-service') || '';
        this.open(service);
      });
    });
  },

  open(serviceName = '', notes = '') {
    if (!this.overlay) return;
    const select = document.getElementById('modalFormService');
    const textarea = document.getElementById('modalFormDetails');

    if (select && serviceName) {
      // Find matching option or set value
      for (let opt of select.options) {
        if (opt.text.includes(serviceName) || opt.value.includes(serviceName)) {
          select.value = opt.value;
          break;
        }
      }
    }
    if (textarea && notes) {
      textarea.value = notes;
    }

    this.overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  },

  close() {
    if (!this.overlay) return;
    this.overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
};

// ==========================================================================
// Lead Management & Local Storage Persistence
// ==========================================================================
const LeadManager = {
  STORAGE_KEY: 'codexsors_leads',

  getLeads() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  saveLead(lead) {
    const leads = this.getLeads();
    const newLead = {
      id: 'LEAD-' + Date.now().toString(36).toUpperCase(),
      date: new Date().toISOString(),
      status: 'new', // new, contacted, in_progress, closed
      ...lead
    };
    leads.unshift(newLead);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(leads));
    return newLead;
  }
};

// ==========================================================================
// Form Submission Handlers
// ==========================================================================
function setupForms() {
  // Main Contact Form
  const mainForm = document.getElementById('mainContactForm');
  if (mainForm) {
    mainForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleFormSubmit(mainForm, false);
    });

    const waBtn = document.getElementById('mainFormWhatsAppBtn');
    if (waBtn) {
      waBtn.addEventListener('click', () => {
        handleFormSubmit(mainForm, true);
      });
    }
  }

  // Modal Form
  const modalForm = document.getElementById('modalQuoteForm');
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleFormSubmit(modalForm, false, true);
    });

    const modalWaBtn = document.getElementById('modalFormWhatsAppBtn');
    if (modalWaBtn) {
      modalWaBtn.addEventListener('click', () => {
        handleFormSubmit(modalForm, true, true);
      });
    }
  }
}

function handleFormSubmit(form, sendViaWhatsApp = false, isModal = false) {
  const name = form.querySelector('[name="client_name"]')?.value.trim();
  const phone = form.querySelector('[name="client_phone"]')?.value.trim();
  const service = form.querySelector('[name="client_service"]')?.value || 'عام';
  const budget = form.querySelector('[name="client_budget"]')?.value || 'غير محدد';
  const details = form.querySelector('[name="client_details"]')?.value.trim();

  if (!name || !phone) {
    showToast('يرجى كتابة الاسم ورقم الجوال للتواصل', 'error');
    return;
  }

  // Save to local storage for Admin Dashboard
  LeadManager.saveLead({
    name,
    phone,
    service,
    budget,
    details
  });

  if (sendViaWhatsApp) {
    const isAr = (window.i18n ? window.i18n.currentLang : 'ar') === 'ar';
    let text = '';
    if (isAr) {
      text = `السلام عليكم ورحمة الله،
طلب عرض سعر مشروع جديد - CODEXSORS:

👤 الاسم: *${name}*
📱 الجوال: *${phone}*
🛠 الخدمة المطلوبة: *${service}*
💰 الميزانية التقديرية: *${budget}*
📝 تفاصيل المشروع:
${details || 'لا توجد ملاحظات إضافية'}`;
    } else {
      text = `Hello CODEXSORS Team,
New Project Quote Request:

👤 Name: *${name}*
📱 Phone: *${phone}*
🛠 Service: *${service}*
💰 Budget: *${budget}*
📝 Details:
${details || 'No additional notes'}`;
    }

    window.open(getWhatsAppUrl(text), '_blank');
  }

  showToast('تم استلام طلبك بنجاح! سيتواصل معك فريق CODEXSORS فوراً.', 'success');
  form.reset();

  if (isModal) {
    QuoteModal.close();
  }
}

// Toast notification
function showToast(message, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(50px)';
    toast.style.transition = '0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ==========================================================================
// FAQ Accordion
// ==========================================================================
function setupFAQ() {
  const faqItems = document.querySelectorAll('.faq-box-item, .faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-box-btn, .faq-question');
    const answer = item.querySelector('.faq-box-answer, .faq-answer');
    if (!btn || !answer) return;
    
    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all others
      faqItems.forEach(other => {
        other.classList.remove('active');
        const otherAnswer = other.querySelector('.faq-box-answer, .faq-answer');
        if (otherAnswer) otherAnswer.style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });
}

// ==========================================================================
// Mobile Nav & Scroll Spy
// ==========================================================================
function setupNavigation() {
  // Bottom Nav Dock active link updater
  const bnavItems = document.querySelectorAll('.bnav-item');
  const sections = ['hero', 'services', 'calculator', 'process', 'contact'];

  function updateBnavOnScroll() {
    const scrollPos = window.scrollY + 180;
    let currentSec = 'hero';

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= scrollPos) {
        currentSec = id;
      }
    });

    bnavItems.forEach(item => {
      const href = item.getAttribute('href');
      if (href === `#${currentSec}`) {
        item.classList.add('is-active');
      } else {
        item.classList.remove('is-active');
      }
    });
  }

  window.addEventListener('scroll', updateBnavOnScroll, { passive: true });

  // Language Switcher
  const langBtn = document.getElementById('langSwitcher');
  if (langBtn) {
    langBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.i18n.toggle();
      Calculator.updateSummary();
    });
  }
}

// ==========================================================================
// Secret 5-Click Admin Access Trigger
// ==========================================================================
function setupSecretAdminTrigger() {
  let clickCount = 0;
  let resetTimer = null;

  document.querySelectorAll('.admin-secret-trigger').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      clickCount++;

      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        clickCount = 0;
      }, 3500);

      if (clickCount >= 5) {
        clickCount = 0;
        const isServicesSub = window.location.pathname.includes('/services/');
        window.location.href = isServicesSub ? '../admin.html' : 'admin.html';
      }
    });
  });
}

// ==========================================================================
// DOM Ready Initialization
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  window.i18n.init();
  setupNavigation();
  Calculator.init();
  QuoteModal.init();
  setupForms();
  setupFAQ();
  setupSecretAdminTrigger();
});
