document.addEventListener('DOMContentLoaded', function() {
    const currentUrl = window.location.href;
    document.querySelectorAll('.nav-link').forEach(link => {
      const cleanLinkUrl = link.href.split(/[?#]/)[0];
      const cleanCurrentUrl = currentUrl.split(/[?#]/)[0];
      
      if (cleanLinkUrl === cleanCurrentUrl) {
        // Задержка 50 мс для корректного запуска анимации
        setTimeout(() => {
          link.classList.add('active');
        }, 50);
      }
    });
  });