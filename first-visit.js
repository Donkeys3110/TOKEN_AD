document.addEventListener("DOMContentLoaded", function() {
    if (!localStorage.getItem("visited")) {
        window.location.href = "landing.html"; // замените URL на нужный
        localStorage.setItem("visited", "true");
        
    }
});
