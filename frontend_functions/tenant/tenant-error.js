

document.addEventListener('DOMContentLoaded', function() {
    // Sélectionner le bouton
    const btnHome = document.querySelector('.btn-home');
    // Ajouter un écouteur d'événements pour le clic
    btnHome.addEventListener('click', function() {
        // Rediriger vers la page d'accueil (ou une autre page spécifique)
        window.location.href = tenantDashboardURL; // page d'accueil
    });
});