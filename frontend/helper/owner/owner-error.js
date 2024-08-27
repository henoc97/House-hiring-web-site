

document.addEventListener('DOMContentLoaded', function() {
    // Sélectionner le bouton
    const btnHome = document.querySelector('.btn-home');
    const btnSign = document.querySelector('.btn-sign');
    // Ajouter un écouteur d'événements pour le clic
    btnHome.addEventListener('click', function() {
        // Rediriger vers la page d'accueil 
        window.location.href = ownerDashboardURL; // page d'accueil
    });
    
    btnSign.addEventListener('click', function() {
        // Rediriger vers la page de sign 
        window.location.href = ownerLogSignURL; 
    });
});