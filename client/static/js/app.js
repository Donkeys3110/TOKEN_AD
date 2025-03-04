document.addEventListener('DOMContentLoaded', function() {
    // Инициализация Telegram WebApp
    const tg = window.Telegram.WebApp;
    tg.ready();
    
    // Установка высоты viewport для iOS
    const setViewportHeight = () => {
        document.documentElement.style.setProperty(
            '--tg-viewport-height',
            `${tg.viewportHeight}px`
        );
    };
    
    // Обновляем высоту при изменении размера окна
    window.addEventListener('resize', setViewportHeight);
    setViewportHeight();
});