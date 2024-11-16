/**
 * Initializes the process to verify an owner's account once the DOM has fully loaded.
 * This function retrieves the email from the URL parameters, sends it in a POST request
 * to verify the owner's account, and handles the response accordingly.
 */
document.addEventListener('DOMContentLoaded', function () {
  const url = host + 'verify-owner';
  const params = new URLSearchParams(window.location.search);
  const email = params.get('email');

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })
    .then(async (response) => {
      if (!response.ok) {
        const errorData = await response.json();
        alert('Erreur lors de la vérification du compte'); // Shows an error message in French
        throw new Error(errorData.message || 'Erreur inconnue'); // Throws an error with message
      }
      return response.json();
    })
    .then((data) => {
      localStorage.setItem('tempId', data.id); // Stores the temporary ID in localStorage
      window.location.href = ownerResetPwdURL; // Redirects to the password reset URL
    })
    .catch((error) => {
      alert('Erreur lors de la vérification du compte : ' + error.message); // Shows an error message in French
    });
});
