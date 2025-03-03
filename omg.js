document.addEventListener('DOMContentLoaded', function() {
    // Получаем текущий URL страницы
    const currentUrl = window.location.href;
  
    // Находим все ссылки в навбаре
    const navLinks = document.querySelectorAll('.nav-link');
  
    navLinks.forEach(link => {
      // Сравниваем URL ссылки с текущим URL
      if (link.href === currentUrl) {
        link.classList.add('active');
      }
  
      // Опционально: Удаляем active при клике на другие ссылки
      link.addEventListener('click', function() {
        navLinks.forEach(item => item.classList.remove('active'));
        this.classList.add('active');
      });
    });
  });