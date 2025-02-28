document.addEventListener("DOMContentLoaded", function() {
    if (!localStorage.getItem("visited")) {
        localStorage.setItem("visited", "true");
        window.location.href = "https://tonken-ad.netlify.app/landing"; // замените URL на нужный
    }
});
