// Add an event listener for when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Select the home button
    const btnHome = document.querySelector('.btn-home');
    // Select the sign-in button
    const btnSign = document.querySelector('.btn-sign');
    
    // Add a click event listener to the home button
    btnHome.addEventListener('click', function() {
        // Redirect to the home page
        window.location.href = ownerDashboardURL; // Home page URL
    });
    
    // Add a click event listener to the sign-in button
    btnSign.addEventListener('click', function() {
        // Redirect to the sign-in page
        window.location.href = ownerLogSignURL; // Sign-in page URL
    });
});
