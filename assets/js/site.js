(() => {
  if (window.__praktikaSiteJsReady) return;
  window.__praktikaSiteJsReady = true;
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    const close = () => { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); };
    toggle.addEventListener('click', () => {
      const open = !nav.classList.contains('open');
      nav.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('keydown', event => { if (event.key === 'Escape') { close(); toggle.focus(); } });
    nav.addEventListener('click', event => { if (event.target.closest('a')) close(); });
  }

  document.querySelectorAll('.accordion-button').forEach(button => {
    button.addEventListener('click', () => {
      const panel = document.getElementById(button.getAttribute('aria-controls'));
      const expanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!expanded));
      if (panel) panel.hidden = expanded;
    });
  });

  const courseSelection = document.querySelector('[data-course-selection]');
  const selectedCourse = document.querySelector('[data-selected-course]');
  if (courseSelection && selectedCourse) {
    const course = new URLSearchParams(window.location.search).get('course')?.trim();
    if (course) {
      selectedCourse.textContent = course;
      courseSelection.hidden = false;
    }
  }

  const catalog = document.querySelector('[data-catalog]');
  if (catalog) {
    const inputs = [...catalog.querySelectorAll('input, select')];
    const cards = [...document.querySelectorAll('[data-course-card]')];
    const count = document.querySelector('[data-result-count]');
    const empty = document.querySelector('[data-empty-state]');
    const filterToggle = document.querySelector('[data-filter-toggle]');
    const normalize = value => value.toLocaleLowerCase('ru-RU').trim();
    const params = new URLSearchParams(window.location.search);
    const controls = {
      search: document.getElementById('course-search'),
      direction: document.getElementById('course-direction'),
      level: document.getElementById('course-level'),
      format: document.getElementById('course-format')
    };
    const restore = (control, value, allowed = []) => {
      if (!value || (allowed.length && !allowed.includes(value))) return;
      control.value = value;
    };
    restore(controls.search, params.get('q'));
    restore(controls.direction, params.get('direction'), ['design', 'development', 'marketing']);
    restore(controls.level, params.get('level'), ['beginner', 'advanced']);
    restore(controls.format, params.get('format'), ['group', 'self']);
    filterToggle?.addEventListener('click', () => {
      const expanded = filterToggle.getAttribute('aria-expanded') === 'true';
      filterToggle.setAttribute('aria-expanded', String(!expanded));
      catalog.classList.toggle('is-open', !expanded);
    });
    const apply = () => {
      const search = normalize(controls.search.value);
      const direction = controls.direction.value;
      const level = controls.level.value;
      const format = controls.format.value;
      let visible = 0;
      cards.forEach(card => {
        const matches = (!search || normalize(card.dataset.search).includes(search)) &&
          (!direction || card.dataset.direction === direction) &&
          (!level || card.dataset.level === level) &&
          (!format || card.dataset.format === format);
        card.hidden = !matches;
        if (matches) visible += 1;
      });
      count.textContent = `Найдено курсов: ${visible}`;
      empty.hidden = visible !== 0;
      const next = new URL(window.location.href);
      const nextParams = { q: controls.search.value.trim(), direction, level, format };
      Object.entries(nextParams).forEach(([key, value]) => {
        value ? next.searchParams.set(key, value) : next.searchParams.delete(key);
      });
      history.replaceState(null, '', `${next.pathname}${next.search}${next.hash}`);
    };
    inputs.forEach(input => input.addEventListener(input.tagName === 'SELECT' ? 'change' : 'input', apply));
    document.querySelectorAll('[data-reset-filters]').forEach(reset => reset.addEventListener('click', () => {
      inputs.forEach(input => { input.value = ''; });
      apply();
      controls.search.focus();
    }));
    apply();
  }

  const form = document.querySelector('[data-contact-form]');
  if (form) {
    const status = form.querySelector('[data-form-status]');
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      status.textContent = 'Сайт работает в статическом режиме. Скопируйте сообщение и отправьте его по указанному адресу электронной почты.';
      status.hidden = false;
      status.focus();
    });
  }
})();
