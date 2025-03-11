document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const activeBg = document.querySelector('.active-bg');

    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            const rect = link.getBoundingClientRect();
            activeBg.style.width = `${rect.width}px`;
            activeBg.style.height = `${rect.height}px`;
            activeBg.style.left = `${rect.left + window.scrollX}px`;
            activeBg.style.top = `${rect.top + window.scrollY}px`;
        });
    });
});