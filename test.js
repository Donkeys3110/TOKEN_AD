document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetUrl = this.href;
  
      // Удаляем активный класс у всех ссылок
      document.querySelectorAll('.nav-link').forEach(item => {
        item.classList.remove('active');
      });
      
      // Добавляем активный класс текущей ссылке
      this.classList.add('active');
      
      // Анимируем фон
      const activeBg = document.querySelector('.active-bg');
      const linkRect = this.getBoundingClientRect();
      const navbarRect = document.querySelector('.navbar').getBoundingClientRect();
      const translateX = linkRect.left - navbarRect.left;
      const scaleX = linkRect.width;
  
      activeBg.style.transform = `translateX(${translateX}px) scaleX(${scaleX})`;
      
      // Переход после завершения анимации
      setTimeout(() => {
        window.location.href = targetUrl;
      }, 50);
    });
  });
  
  // Инициализация при загрузке страницы
  window.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname.split('/').pop();
    const activeLink = document.querySelector(`.nav-link[href="${currentPath}"]`);
    const activeBg = document.querySelector('.active-bg');
  
    if (activeLink && activeBg) {
      const linkRect = activeLink.getBoundingClientRect();
      const navbarRect = document.querySelector('.navbar').getBoundingClientRect();
      const translateX = linkRect.left - navbarRect.left;
      const scaleX = linkRect.width;
  
      activeBg.style.transform = `translateX(${translateX}px) scaleX(${scaleX})`;
      activeLink.classList.add('active');
    }
  });