/* ═══════════════════════════════════════
   PREMIUM JS v3
═══════════════════════════════════════ */
(function(){
  'use strict';

  /* ── Cursor ── */
  const cur  = document.createElement('div'); cur.className = 'cur';
  const ring = document.createElement('div'); ring.className = 'cur-ring';
  document.body.append(cur, ring);
  let mx=-100,my=-100,rx=-100,ry=-100;
  document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; });
  (function tick(){
    cur.style.cssText += `left:${mx-5}px;top:${my-5}px;`;
    rx += (mx-rx)*0.12; ry += (my-ry)*0.12;
    ring.style.cssText += `left:${rx-20}px;top:${ry-20}px;`;
    requestAnimationFrame(tick);
  })();
  document.addEventListener('mouseleave', () => { cur.style.opacity='0'; ring.style.opacity='0'; });
  document.addEventListener('mouseenter', () => { cur.style.opacity='1'; ring.style.opacity='1'; });

  /* ── Progress bar ── */
  const prog = document.getElementById('prog');
  const updateProg = () => {
    if(!prog) return;
    const s = document.documentElement;
    prog.style.width = (s.scrollTop / (s.scrollHeight - s.clientHeight) * 100) + '%';
  };
  window.addEventListener('scroll', updateProg, {passive:true});

  /* ── Nav solid on scroll ── */
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => {
    nav && nav.classList.toggle('solid', window.scrollY > 16);
  }, {passive:true});

  /* ── Active link ── */
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mob a').forEach(a => {
    if(a.getAttribute('href') === page) a.classList.add('active');
  });

  /* ── Hamburger ── */
  const ham = document.querySelector('.ham');
  const mob = document.querySelector('.mob');
  if(ham && mob){
    ham.addEventListener('click', () => {
      ham.classList.toggle('open');
      mob.classList.toggle('open');
      document.body.style.overflow = mob.classList.contains('open') ? 'hidden' : '';
    });
    mob.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        ham.classList.remove('open');
        mob.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Scroll reveals ── */
  const revEls = document.querySelectorAll('.r, .rl, .rs');
  if('IntersectionObserver' in window){
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if(e.isIntersecting){ e.target.classList.add('on'); io.unobserve(e.target); }
      });
    }, {threshold:0.1});
    revEls.forEach(el => io.observe(el));
  } else { revEls.forEach(el => el.classList.add('on')); }

  /* ── Counters ── */
  const ease3 = t => 1 - Math.pow(1-t, 3);
  document.querySelectorAll('[data-cnt]').forEach(el => {
    const io = new IntersectionObserver(([e]) => {
      if(!e.isIntersecting) return;
      io.unobserve(el);
      const target = parseFloat(el.dataset.cnt);
      const suf = el.dataset.suf || '';
      const dec = String(target).includes('.');
      const dur = 1600;
      const t0 = performance.now();
      (function frame(now){
        const p = Math.min((now-t0)/dur, 1);
        const v = target * ease3(p);
        el.textContent = (dec ? v.toFixed(1) : Math.floor(v)) + suf;
        if(p < 1) requestAnimationFrame(frame);
        else el.textContent = (dec ? target.toFixed(1) : target) + suf;
      })(t0);
    }, {threshold:0.6});
    io.observe(el);
  });

  /* ── Pub filter ── */
  document.querySelectorAll('.pf').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pf').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.f;
      document.querySelectorAll('.pub-card[data-t]').forEach(c => {
        c.style.display = (f === 'all' || c.dataset.t === f) ? '' : 'none';
        if(f === 'all' || c.dataset.t === f)
          c.style.animation = 'fadeIn .3s ease both';
      });
    });
  });

  /* ── Note filter ── */
  document.querySelectorAll('.nfb').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nfb').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.c;
      document.querySelectorAll('.note-card[data-cat]').forEach(c => {
        c.style.display = (cat === 'all' || c.dataset.cat === cat) ? '' : 'none';
      });
    });
  });

  /* ── Mouse parallax on hero decorative letter ── */
  const letter = document.querySelector('.hero-bg-letter');
  if(letter){
    document.addEventListener('mousemove', e => {
      const dx = (e.clientX / window.innerWidth - .5) * 18;
      const dy = (e.clientY / window.innerHeight - .5) * 10;
      letter.style.transform = `translateY(calc(-50% + ${dy}px)) translateX(${dx}px)`;
    });
  }

  /* ── Stagger children inside grids on reveal ── */
  document.querySelectorAll('[data-stagger]').forEach(parent => {
    const kids = [...parent.children];
    kids.forEach((k, i) => {
      k.style.transitionDelay = `${i * 0.09}s`;
    });
  });

  /* ── Hover tilt on cards ── */
  document.querySelectorAll('.bento-cell, .pl-card, .note-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      card.style.transform = `translateY(-5px) rotateX(${-y*5}deg) rotateY(${x*5}deg)`;
      card.style.transformOrigin = 'center';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ── Typewriter for hero kicker ── */
  const kicker = document.querySelector('.hero-kicker-text');
  if(kicker){
    const phrases = [
      'Available for Research Collaboration',
      'Mathematical Oncology Researcher',
      'Assistant Professor · CS & Engg.',
      'Ph.D. · Banaras Hindu University',
    ];
    let pi = 0, ci = 0, deleting = false;
    function type(){
      const phrase = phrases[pi];
      if(!deleting){
        kicker.textContent = phrase.slice(0, ++ci);
        if(ci === phrase.length){ deleting = true; setTimeout(type, 1800); return; }
      } else {
        kicker.textContent = phrase.slice(0, --ci);
        if(ci === 0){ deleting = false; pi = (pi+1) % phrases.length; }
      }
      setTimeout(type, deleting ? 36 : 68);
    }
    type();
  }

})();
