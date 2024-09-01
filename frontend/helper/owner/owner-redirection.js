/**
 * Initializes the process for creating a user owner once the DOM has fully loaded.
 * This function retrieves email, password, and OTP from the URL parameters, sends them
 * in a POST request to create a new user owner, and handles the response accordingly.
 */
document.addEventListener("DOMContentLoaded", function() {
  const url = host + 'create-user-owner';
  const params = new URLSearchParams(window.location.search);
  const email = params.get('email');
  const pwd = params.get('pwd');
  const otp = params.get('otp');

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, pwd, otp })
  })
  .then(async response => {
    if (!response.ok) {
      const errorData = await response.json();
      alert('Erreur lors de la création du compte'); // Shows an error message in French
      throw new Error(errorData.message || 'Erreur inconnue'); // Throws an error with message
    }
    return response.json();
  })
  .then(data => {
    if (data.message == 'Request successful') {
      localStorage.setItem('sold', data.sold);
      localStorage.setItem('numberOfTenants', 0);
      localStorage.setItem('numberOfProperties', 0);
      localStorage.setItem('numberOfTenantsProperties', 0);
      localStorage.setItem('numberOfPayments', 0);
      window.location.href = ownerDashboardURL;
    } else {
      alert('Erreur de login'); // Shows a login error message in French
    }
  })
  .catch(error => {
    alert('Erreur lors de la création du compte : ' + error.message); // Shows an error message in French
  });
});
