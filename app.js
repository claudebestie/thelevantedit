// Language switcher
let currentLang = 'en';

function changeLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;
  
  // RTL for Hebrew and Arabic
  if (lang === 'he' || lang === 'ar') {
    document.documentElement.dir = 'rtl';
    document.body.classList.add('rtl');
  } else {
    document.documentElement.dir = 'ltr';
    document.body.classList.remove('rtl');
  }
  
  // Update all translatable elements
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        element.placeholder = translations[lang][key];
      } else {
        element.innerHTML = translations[lang][key];
      }
    }
  });
  
  // Save preference
  localStorage.setItem('preferred-language', lang);
}

// Language selector
const langSelector = document.getElementById('language-selector');
if (langSelector) {
  langSelector.addEventListener('change', (e) => {
    changeLanguage(e.target.value);
  });

  // Load saved language or default
  const savedLang = localStorage.getItem('preferred-language') || 'en';
  langSelector.value = savedLang;
  changeLanguage(savedLang);
}

// Track Calendly clicks (Google Analytics)
document.addEventListener('DOMContentLoaded', function() {
  // Track all Calendly links
  document.querySelectorAll('a[href*="calendly.com"]').forEach(function(link) {
    link.addEventListener('click', function() {
      const linkText = this.textContent.trim();
      const linkHref = this.href;
      
      // Determine which consultation type
      let consultationType = 'unknown';
      if (linkHref.includes('30min')) {
        consultationType = 'quick_audit';
      } else if (linkHref.includes('transformation-plan')) {
        consultationType = 'transformation_plan';
      } else if (linkHref.includes('full-transformation')) {
        consultationType = 'full_transformation';
      }
      
      // Send event to Google Analytics
      if (typeof gtag !== 'undefined') {
        gtag('event', 'calendly_click', {
          'event_category': 'consultation',
          'event_label': consultationType,
          'value': consultationType === 'quick_audit' ? 147 : (consultationType === 'transformation_plan' ? 397 : 1297)
        });
      }
    });
  });
});
