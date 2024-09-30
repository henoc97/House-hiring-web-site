/**
 * Initializes event listeners for the page buttons.
 * Redirects to specified URLs when buttons are clicked.
 */
document.addEventListener('DOMContentLoaded', function () {
  /**
   * Selects the 'Home' and 'Sign' buttons from the DOM.
   * Adds click event listeners to redirect users to the appropriate pages.
   */

  // Select the 'Home' button from the DOM
  const btnHome = document.querySelector('.btn-home');

  // Select the 'Sign' button from the DOM
  const btnSign = document.querySelector('.btn-sign');

  /**
   * Redirects to the admin dashboard URL when the 'Home' button is clicked.
   * @event
   * @type {Event}
   */
  btnHome.addEventListener('click', function () {
    // Redirect to the admin dashboard page
    window.location.href = adminDashboardURL; // Page URL to redirect to
  });

  /**
   * Redirects to the admin sign-in URL when the 'Sign' button is clicked.
   * @event
   * @type {Event}
   */
  btnSign.addEventListener('click', function () {
    // Redirect to the admin sign-in page
    window.location.href = adminLogSignURL; // Page URL to redirect to
  });
});
