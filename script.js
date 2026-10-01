(() => {
  'use strict';
  const toggle = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#primary-navigation');
  function closeMenu() {
    toggle.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
  }
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    navigation.classList.toggle('is-open', open);
  });
  navigation.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      toggle.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header')) closeMenu();
  });
  window.matchMedia('(min-width: 701px)').addEventListener('change', closeMenu);

  const service = document.querySelector('#service');
  document.querySelectorAll('[data-service]').forEach(link => {
    link.addEventListener('click', () => {
      service.value = link.dataset.service;
      service.dispatchEvent(new Event('change', { bubbles: true }));
    });
  });

  const form = document.querySelector('#quote-form');
  const submit = form.querySelector('[type="submit"]');
  const feedback = document.querySelector('#form-feedback');
  const modeNote = document.querySelector('#form-mode-note');
  const configuredEndpoint = String(window.HEAVENLY_CONFIG?.quoteEndpoint || '').trim();
  let endpoint = '';
  if (configuredEndpoint) {
    try {
      const url = new URL(configuredEndpoint, location.href);
      if (url.protocol === 'https:') endpoint = url.href;
    } catch { /* Invalid configuration keeps the form safely in preview mode. */ }
  }
  if (endpoint) {
    submit.textContent = 'Request My Free Quote';
    modeNote.textContent = 'A quote request does not confirm an appointment.';
  }
  function showFeedback(message, error = false) {
    feedback.textContent = message;
    feedback.dataset.error = String(error);
    feedback.hidden = false;
  }
  form.addEventListener('input', () => { feedback.hidden = true; });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    if (String(data.get('website') || '').trim()) return;
    const payload = {
      name: String(data.get('name') || '').trim(),
      email: String(data.get('email') || '').trim(),
      service: String(data.get('service') || ''),
      details: String(data.get('details') || '').trim(),
      website: ''
    };
    if (!payload.name) {
      document.querySelector('#full-name').focus();
      showFeedback('Please enter your name.', true);
      return;
    }
    if (!endpoint) {
      showFeedback('Your form preview is complete. No quote request has been sent or saved. Online requests will be available once the form is connected.');
      return;
    }
    submit.disabled = true;
    submit.textContent = 'Sending your request…';
    feedback.hidden = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'omit',
        signal: controller.signal
      });
      if (!response.ok) throw new Error('Request rejected');
      const result = await response.json();
      if (result?.ok !== true) throw new Error('Request not confirmed');
      showFeedback('Your quote request has been received. Thank you for reaching out to Heavenly Helpers.');
      form.reset();
    } catch {
      showFeedback('We couldn’t confirm that your request was received. Please try again in a moment.', true);
    } finally {
      clearTimeout(timeout);
      submit.disabled = false;
      submit.textContent = 'Request My Free Quote';
    }
  });

  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const items = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06 });
    document.documentElement.classList.add('js-motion');
    items.forEach(item => observer.observe(item));
    // A fail-safe keeps all content visible if a browser interrupts observation.
    setTimeout(() => document.documentElement.classList.remove('js-motion'), 12000);
  }
})();
