/* =====================================================
   هوشیکس — اسکریپت اصلی
   ===================================================== */
(function () {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const toFa = (n) => String(n).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  /* ---------- Toast ---------- */
  const toastEl = $('#toast');
  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3200);
  }

  /* =====================================================
     هدر: سایه اسکرول + منوی موبایل
     ===================================================== */
  const header = $('#site-header');
  const nav = $('#main-nav');
  const menuToggle = $('#menu-toggle');

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });

  function closeMenu() {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
  menuToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });
  $$('a', nav).forEach((a) => a.addEventListener('click', closeMenu));

  $('#auth-button').addEventListener('click', () => {
    toast('بخش ثبت‌نام / ورود به‌زودی فعال می‌شود ✨');
  });

  /* =====================================================
     مارکی: تکثیر گروه لوگوها برای حلقه بی‌نهایت
     ===================================================== */
  const track = $('.marquee-track');
  if (track) {
    const group = $('.marquee-group', track);
    track.appendChild(group.cloneNode(true));
  }

  /* =====================================================
     انیمیشن ظهور (IntersectionObserver)
     ===================================================== */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  $$('.reveal').forEach((el) => revealObserver.observe(el));

  /* =====================================================
     فریم ۱: چت‌بات — مکالمه‌ی شبیه‌سازی‌شده
     ===================================================== */
  const chatScript = [
    { who: 'bot', text: 'سلام! 👋 من دستیار هوشمند نوین‌پوش هستم. چطور می‌تونم کمکت کنم؟' },
    { who: 'user', text: 'سلام، سفارش ۴۸۲۱ من کی می‌رسه؟' },
    { who: 'bot', text: 'سفارشت رو پیدا کردم ✅ دیروز تحویل پست شد و تا فردا عصر به دستت می‌رسه. کد رهگیری: ۵۶۷۸۹۰۱۲' },
    { who: 'user', text: 'عالی! می‌شه سایز کاپشن رو تغییر بدم؟' },
    { who: 'bot', text: 'حتماً 😊 چون هنوز مرحله‌ی تحویل نهایی نشده، می‌تونم سایز رو به L تغییر بدم. تأیید می‌کنی؟' },
    { who: 'user', text: 'بله، تأیید می‌کنم.' },
    { who: 'bot', text: 'انجام شد! سایز به L تغییر کرد و پیامک تأیید برات ارسال شد. کار دیگه‌ای هست؟ 💜' },
  ];

  async function runChat(container) {
    const box = $('#chat-messages', container);
    while (true) {
      box.innerHTML = '';
      for (const m of chatScript) {
        if (m.who === 'bot') {
          const typing = document.createElement('div');
          typing.className = 'msg bot typing';
          typing.innerHTML = '<i></i><i></i><i></i>';
          box.appendChild(typing);
          await sleep(1000);
          typing.remove();
        } else {
          await sleep(900);
        }
        const el = document.createElement('div');
        el.className = 'msg ' + m.who;
        el.textContent = m.text;
        box.appendChild(el);
        // Keep the last messages visible
        while (box.children.length > 5) box.removeChild(box.firstChild);
        await sleep(1400);
      }
      await sleep(3500);
    }
  }

  /* =====================================================
     فریم ۲: ایجنت — اجرای مرحله‌به‌مرحله‌ی تسک
     ===================================================== */
  async function runAgent(container) {
    const steps = $$('#agent-steps li', container);
    const log = $('#agent-log', container);
    const status = $('#agent-status', container);
    while (true) {
      steps.forEach((s) => s.classList.remove('active', 'done'));
      log.innerHTML = '';
      status.textContent = 'در حال اجرا';
      status.classList.remove('done');
      for (const step of steps) {
        step.classList.add('active');
        await sleep(1300);
        step.classList.remove('active');
        step.classList.add('done');
        const line = document.createElement('div');
        const t = new Date();
        line.innerHTML = `${step.dataset.log}<span class="t">${toFa(String(t.getHours()).padStart(2, '0'))}:${toFa(String(t.getMinutes()).padStart(2, '0'))}:${toFa(String(t.getSeconds()).padStart(2, '0'))}</span>`;
        log.appendChild(line);
        await sleep(500);
      }
      status.textContent = 'تکمیل شد ✓';
      status.classList.add('done');
      const done = document.createElement('div');
      done.textContent = 'تسک با موفقیت به پایان رسید — زمان کل: ۹ ثانیه';
      log.appendChild(done);
      await sleep(4000);
    }
  }

  /* =====================================================
     فریم ۳: اتوماسیون — جریان سناریو
     ===================================================== */
  async function runFlow(container) {
    const nodes = $$('.flow-node', container);
    const links = $$('.flow-link', container);
    const counter = $('#flow-counter');
    let count = 128;
    while (true) {
      nodes.forEach((n) => n.classList.remove('active'));
      links.forEach((l) => l.classList.remove('active'));
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].classList.add('active');
        await sleep(800);
        if (links[i]) {
          links[i].classList.add('active');
          await sleep(750);
        }
      }
      count += 1;
      counter.textContent = toFa(count);
      await sleep(1800);
    }
  }

  /* =====================================================
     فریم ۴: تولید محتوا — تایپ‌رایتر
     ===================================================== */
  const contentText = 'دیگه لازم نیست ساعت‌ها منتظر جواب بمونی! 💜\nدستیار هوشمند نوین‌پوش ۲۴ ساعته آنلاینه؛ سفارشت رو پیگیری می‌کنه، سایز مناسبت رو پیشنهاد می‌ده و سریع‌تر از هر وقتی جواب می‌ده.\nهمین حالا از دایرکت امتحانش کن 👇';

  async function runTypewriter(container) {
    const el = $('#content-typewriter', container);
    while (true) {
      el.textContent = '';
      for (const ch of contentText) {
        el.textContent += ch;
        await sleep(ch === '\n' ? 350 : 35);
      }
      await sleep(5000);
    }
  }

  /* شروع انیمیشن فریم‌ها فقط وقتی دیده می‌شوند (هر کدام یک‌بار) */
  const frameRunners = {
    'frame-chatbot': runChat,
    'frame-agent': runAgent,
    'frame-automation': runFlow,
    'frame-content': runTypewriter,
  };
  const frameObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        frameRunners[e.target.id](e.target);
        frameObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.25 });
  Object.keys(frameRunners).forEach((id) => {
    const el = document.getElementById(id);
    if (el) frameObserver.observe(el);
  });

  /* =====================================================
     FAQ: فقط یک مورد باز باشد
     ===================================================== */
  const faqItems = $$('.faq-item');
  faqItems.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) faqItems.forEach((o) => { if (o !== item) o.open = false; });
    });
  });

  /* =====================================================
     مودال فرم مشاوره چندمرحله‌ای
     ===================================================== */
  const modal = $('#consult-modal');
  const form = $('#consult-form');
  const stepperItems = $$('#stepper li');
  const prevBtn = $('#prev-btn');
  const nextBtn = $('#next-btn');
  const submitBtn = $('#submit-btn');
  const errorEl = $('#form-error');
  const successEl = $('#form-success');
  let currentStep = 1;
  let openedFrom = '';
  let lastFocused = null;

  const branch = () => (form.elements['business_status'].value || '');

  function visibleStepEl(step) {
    if (step === 2) return $(`.form-step[data-step="2"][data-branch="${branch()}"]`);
    return $(`.form-step[data-step="${step}"]`);
  }

  function showStep(step) {
    currentStep = step;
    $$('.form-step').forEach((fs) => fs.classList.remove('active'));
    const target = visibleStepEl(step);
    if (target) target.classList.add('active');
    stepperItems.forEach((li, i) => {
      li.classList.toggle('active', i + 1 === step);
      li.classList.toggle('done', i + 1 < step);
    });
    prevBtn.hidden = step === 1;
    nextBtn.hidden = step === 3;
    submitBtn.hidden = step !== 3;
    errorEl.textContent = '';
    $$('.invalid', form).forEach((el) => el.classList.remove('invalid'));
    modal.querySelector('.modal').scrollTop = 0;
  }

  function openModal(preset, source) {
    lastFocused = document.activeElement;
    openedFrom = source || '';
    form.reset();
    form.hidden = false;
    successEl.hidden = true;
    $('#stepper').hidden = false;
    if (preset) {
      const radio = form.querySelector(`input[name="business_status"][value="${preset}"]`);
      if (radio) radio.checked = true;
    }
    showStep(1);
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    closeMenu();
    setTimeout(() => $('#modal-close').focus(), 60);
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  // همه دکمه‌های «مشاوره بگیر» در سایت → باز کردن مودال
  $$('.open-consult').forEach((btn) => {
    btn.addEventListener('click', () => openModal(btn.dataset.preset, btn.dataset.source));
  });
  $('#modal-close').addEventListener('click', closeModal);
  $('#success-close').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });

  /* --- اعتبارسنجی هر مرحله --- */
  function checkedValues(name) {
    return $$(`input[name="${name}"]:checked`, form).map((i) => i.value);
  }
  function markInvalid(el) { if (el) el.classList.add('invalid'); }

  function validateStep(step) {
    if (step === 1) {
      if (!branch()) return 'لطفاً وضعیت کسب‌وکارت رو انتخاب کن.';
      return '';
    }
    if (step === 2) {
      if (branch() === 'have_business') {
        const type = checkedValues('hb_type')[0] || form.elements['hb_type_text'].value.trim();
        if (!type) { markInvalid($('#hb-type')); return 'نوع کسب‌وکارت رو انتخاب کن یا بنویس.'; }
        if (checkedValues('hb_services').length === 0) return 'حداقل یک خدمت رو انتخاب کن.';
      } else {
        if (!form.elements['sb_type'].value.trim()) { markInvalid($('#sb-type')); return 'نوع کسب‌وکاری که در ذهنت هست رو بنویس.'; }
        if (checkedValues('sb_services').length === 0) return 'حداقل یک خدمت رو انتخاب کن.';
        if (!checkedValues('sb_stage')[0]) return 'مرحله‌ای که در آن هستی رو مشخص کن.';
      }
      return '';
    }
    if (step === 3) {
      const name = form.elements['full_name'].value.trim();
      const phone = normalizePhone(form.elements['phone'].value);
      if (name.length < 3) { markInvalid($('#full-name')); return 'نام و نام‌خانوادگی رو کامل وارد کن.'; }
      if (!/^0?9\d{9}$/.test(phone)) { markInvalid($('#phone')); return 'شماره موبایل معتبر وارد کن (مثلاً ۰۹۱۲۱۲۳۴۵۶۷).'; }
      return '';
    }
    return '';
  }

  function normalizePhone(v) {
    return v
      .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
      .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
      .replace(/[^\d]/g, '')
      .replace(/^98/, '0');
  }

  nextBtn.addEventListener('click', () => {
    const err = validateStep(currentStep);
    if (err) { errorEl.textContent = err; return; }
    showStep(currentStep + 1);
  });
  prevBtn.addEventListener('click', () => showStep(currentStep - 1));

  // با انتخاب گزینه‌ی مرحله ۱، خودکار به مرحله بعد برو
  $$('input[name="business_status"]', form).forEach((r) => {
    r.addEventListener('change', () => setTimeout(() => showStep(2), 250));
  });
  // پاک کردن خطا وقتی کاربر چیزی تغییر می‌دهد
  form.addEventListener('input', () => { errorEl.textContent = ''; });
  form.addEventListener('change', () => { errorEl.textContent = ''; });

  /* --- ارسال --- */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const err = validateStep(3);
    if (err) { errorEl.textContent = err; return; }

    const isHB = branch() === 'have_business';
    const payload = {
      business_status: branch(),
      business_type: isHB
        ? [checkedValues('hb_type')[0], form.elements['hb_type_text'].value.trim()].filter(Boolean).join(' — ')
        : form.elements['sb_type'].value.trim(),
      services: isHB ? checkedValues('hb_services') : checkedValues('sb_services'),
      challenge: isHB ? form.elements['hb_challenge'].value.trim() : '',
      stage: isHB ? '' : (checkedValues('sb_stage')[0] || ''),
      full_name: form.elements['full_name'].value.trim(),
      phone: normalizePhone(form.elements['phone'].value),
      call_time: checkedValues('call_time')[0] || '',
      source: openedFrom,
    };

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> در حال ارسال…';
    try {
      const res = await fetch('tables/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      form.hidden = true;
      $('#stepper').hidden = true;
      successEl.hidden = false;
    } catch (err2) {
      console.error(err2);
      errorEl.textContent = 'ارسال با خطا مواجه شد. لطفاً دوباره تلاش کن یا مستقیماً تماس بگیر.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> ارسال درخواست';
    }
  });
})();
