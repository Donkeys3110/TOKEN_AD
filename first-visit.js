document.addEventListener("DOMContentLoaded", function() {
    if (!localStorage.getItem("visited")) {
        localStorage.setItem("visited", "true");
        window.location.href = "main.html"; // замените URL на нужный
    }
});
