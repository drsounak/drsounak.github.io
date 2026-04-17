(function () {
  // Active nav link
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mob-menu a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });

  // Hamburger
  const ham = document.querySelector('.nav-ham');
  const mob = document.querySelector('.mob-menu');
  if (ham && mob) {
    ham.addEventListener('click', () => {
      ham.classList.toggle('open');
      mob.classList.toggle('open');
    });
    mob.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        ham.classList.remove('open');
        mob.classList.remove('open');
      });
    });
  }
})();
