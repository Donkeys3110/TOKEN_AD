document.querySelectorAll('.nav-link').forEach((link, index) => {
    link.addEventListener('click', function(e) {
      // Убрали e.preventDefault() 
      
      // Удаляем класс active у всех ссылок
      document.querySelectorAll('.nav-link').forEach(item => {
        item.classList.remove('active');
      });
      
      // Добавляем active текущей ссылке
      this.classList.add('active');
      
      // Анимируем фон
      const activeBg = document.querySelector('.active-bg');
      const linkRect = this.getBoundingClientRect();
      const navbarRect = document.querySelector('.navbar').getBoundingClientRect();
      
      activeBg.style.width = `${linkRect.width}px`;
      activeBg.style.left = `${linkRect.left - navbarRect.left}px`;
    });
  });