/* Hero page logic:
   - graceful startup animation
   - rotating/typewriter services text
   - subtle parallax on the hero image (mouse move)
   - accessibility: respects prefers-reduced-motion
*/

(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;
  const body = document.body;

  // when DOM ready, reveal hero with stagger
  function readyReveal(){
    // small timeout so fonts & image start loading
    setTimeout(() => {
      body.classList.remove('no-js');
      body.classList.add('is-ready');
    }, 120);
  }

  // Typewriter / rotor
  function typeRotor(targetEl, words = [], opts = {}) {
    if (!targetEl || words.length === 0 || prefersReduced) {
      targetEl.textContent = words[0] || '';
      return;
    }
    const typingDelay = opts.typingDelay || 30;
    const holdDelay = opts.holdDelay || 1600;
    let wordIndex = 0;
    let isDeleting = false;
    let charIndex = 0;

    function tick(){
      const current = words[wordIndex % words.length];
      if (!isDeleting) {
        charIndex++;
        targetEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          isDeleting = true;
          setTimeout(tick, holdDelay);
          return;
        }
      } else {
        charIndex--;
        targetEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          isDeleting = false;
          wordIndex++;
        }
      }
      const delay = isDeleting ? typingDelay / 1.7 : typingDelay + Math.random()*20;
      setTimeout(tick, delay);
    }
    tick();
  }

  // parallax on image based on pointer
  function initParallax(imgEl, containerEl) {
    if (!imgEl || !containerEl || prefersReduced) return;
    let raf = null;
    const strength = 12; // px movement
    function onMove(e){
      const rect = containerEl.getBoundingClientRect();
      const x = (e.clientX ?? (e.touches && e.touches[0].clientX) ?? rect.left + rect.width/2) - (rect.left + rect.width/2);
      const y = (e.clientY ?? (e.touches && e.touches[0].clientY) ?? rect.top + rect.height/2) - (rect.top + rect.height/2);
      const px = (x / rect.width) * strength;
      const py = (y / rect.height) * strength;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        imgEl.style.transform = `translate3d(${px}px, ${py}px, 0) scale(1.03)`;
      });
    }
    function onLeave(){
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => imgEl.style.transform = 'translate3d(0,0,0) scale(1.02)');
    }
    containerEl.addEventListener('pointermove', onMove, {passive:true});
    containerEl.addEventListener('pointerleave', onLeave, {passive:true});
    containerEl.addEventListener('touchstart', () => {}, {passive:true}); // ensure touch is supported
  }

  // wire CTAs
  function wireCTAs() {
    const shopBtn = document.getElementById('shopBtn');
    const contactBtn = document.getElementById('contactBtn');
    shopBtn && shopBtn.addEventListener('click', (e) => {
      // smooth navigate to products (if exists) or fallback to location.href
      e.preventDefault();
      window.location.href = shopBtn.getAttribute('href') || 'products.html';
    });
    contactBtn && contactBtn.addEventListener('click', () => {
      // open whatsapp link (change number later). opens in new tab
      const owner = '962799343102'; // <-- غيّر رقم صاحب السوبرماركت بصيغة دولية بدون +
      const text = encodeURIComponent('طلب/استفسار من موقع سوبرماركت دوار الطيارة');
      window.open(`https://wa.me/${owner}?text=${text}`, '_blank', 'noopener');
    });
  }

  // init
  document.addEventListener('DOMContentLoaded', () => {
    readyReveal();

    // rotor list — عدّل النصوص حسب اللي بدك
    const rotorWords = [
      'توصيل سريع',
      'منتجات طازجة',
      'عروض يومية',
      'أسعار منافسة'
    ];
    
    const rotEl = document.getElementById('rotatingText');
    typeRotor(rotEl, rotorWords, { typingDelay: 32, holdDelay: 1500 });

    // parallax init
    const heroImg = document.getElementById('heroImage');
    const heroVisual = document.querySelector('.hero-visual');
    initParallax(heroImg, heroVisual);

    // lazy reveal of image for better perceived perf
    if (heroImg && heroImg.complete) {
      heroImg.style.transform = 'scale(1.02)';
    } else {
      heroImg.addEventListener('load', () => heroImg.style.transform = 'scale(1.02)');
    }

    wireCTAs();

    // accessibility: focus on title for screen readers when page loads
    const title = document.getElementById('hero-title');
    title && title.focus({preventScroll:true});
  });
})();
