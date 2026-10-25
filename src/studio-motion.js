/* Small, opt-in animation layer for Decision Studio.
   No scroll-jacking, infinite render loops or animation needed to read content. */
export function setupStudioMotion(gsap, ScrollTrigger, reducedMotion = false, finePointer = false) {
  if (!reducedMotion) {
    const blocks = [...document.querySelectorAll('[data-studio-reveal]')];
    blocks.forEach((el) => {
      gsap.fromTo(el, { opacity: 0, y: 24 }, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 94%', once: true },
        clearProps: 'opacity,transform'
      });
    });
    document.querySelectorAll('[data-illustration]').forEach((frame) => {
      const svg = frame.querySelector('svg');
      if (!svg) return;
      const paths = svg.querySelectorAll('path, line, polyline, rect, circle');
      gsap.fromTo(paths, { opacity: 0.18 }, {
        opacity: 1, duration: 0.65, stagger: 0.008, ease: 'power2.out',
        scrollTrigger: { trigger: frame, start: 'top 86%', once: true },
        clearProps: 'opacity'
      });
    });
    const board = document.querySelector('[data-studio-board]');
    if (board) {
      gsap.fromTo(board.children, { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.95, stagger: 0.13, ease: 'power3.out',
        delay: 0.1, clearProps: 'opacity,transform'
      });
      if (finePointer) {
        const main = board.querySelector('.studio-board__main');
        if (main) {
          const x = gsap.quickTo(main, 'x', { duration: 0.65, ease: 'power3.out' });
          const y = gsap.quickTo(main, 'y', { duration: 0.65, ease: 'power3.out' });
          board.addEventListener('pointermove', (e) => {
            const bounds = board.getBoundingClientRect();
            x(((e.clientX - bounds.left) / bounds.width - 0.5) * 8);
            y(((e.clientY - bounds.top) / bounds.height - 0.5) * 8);
          }, { passive: true });
          board.addEventListener('pointerleave', () => { x(0); y(0); });
        }
      }
    }
  }
  const form = document.getElementById('studio-form');
  if (!form) return;
  const status = document.getElementById('studio-form-status');
  const submit = form.querySelector('button[type="submit"]');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    if (!String(data.get('name') || '').trim() ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.get('email') || '')) ||
        !String(data.get('message') || '').trim()) {
      status.textContent = 'Please enter your name, a valid email and a message.';
      return;
    }
    if (data.get('botcheck')) return;
    submit.disabled = true;
    status.textContent = 'Sending your note…';
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);
      let response;
      try {
        response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST', body: data, headers: { Accept: 'application/json' }, signal: controller.signal
        });
      } finally { clearTimeout(timeout); }
      if (!response.ok || !(await response.json()).success) throw new Error('Failed to send');
      status.textContent = 'Message sent. Thanks for reaching out.';
      form.reset();
    } catch {
      const subject = encodeURIComponent('Portfolio enquiry');
      const body = encodeURIComponent(String(data.get('message') || '') + '\n\n' + String(data.get('name') || '') + ' / ' + String(data.get('email') || ''));
      status.textContent = 'The form could not send. You can email directly instead.';
      const fallback = document.createElement('a');
      fallback.href = 'mailto:anjort2000@gmail.com?subject=' + subject + '&body=' + body;
      fallback.textContent = ' Open your email app ↗';
      status.append(fallback);
    } finally { submit.disabled = false; }
  });
}
