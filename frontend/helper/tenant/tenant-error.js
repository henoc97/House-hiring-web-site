/**
 * Initializes event listeners for buttons once the DOM content is fully loaded.
 */
document.addEventListener('DOMContentLoaded', function() {
    // Selects the home button using its class
    const btnHome = document.querySelector('.btn-home');
    // Selects the sign button using its class
    const btnSign = document.querySelector('.btn-sign');

    // Adds a click event listener to the home button
    btnHome.addEventListener('click', function() {
        // Redirects to the home page or a specific page
        window.location.href = tenantDashboardURL; // Redirects to the tenant dashboard
    });

    // Adds a click event listener to the sign button
    btnSign.addEventListener('click', function() {
        // Redirects to the sign-in or sign-up page
        window.location.href = tenantLogSignURL; // Redirects to the tenant login/sign-up page
    });
});
