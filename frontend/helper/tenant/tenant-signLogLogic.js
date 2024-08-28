/**
 * Handles the authentication request for a tenant account.
 * Retrieves the username and password from the form, sends a POST request to authenticate the user,
 * and manages the response by storing tokens and redirecting to the dashboard.
 * Also updates the UI with messages based on the response.
 * @function
 * @returns {void}
 */
function makeRequest() {
  let userName = document.getElementById('user-name-field').value;
  let pwd = document.getElementById('pwd').value;
  const messageDiv = document.getElementById('message');

  fetch(hostTenant + 'auth-tenant-account', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userName: userName, pwd: pwd })
  })
  .then(response => {
    if (!response.ok) {
      if (response.status === 401) {
        alert('Accès interdit. Vérifiez vos informations de connexion.');
      } else if (response.status === 404) {
        messageDiv.textContent = "Mot de passe ou nom d'utilisateur incorrect.";
        messageDiv.classList.add('red-message');
        messageDiv.classList.remove('green-message');
      } else {
        alert('Le serveur est temporairement indisponible. Veuillez réessayer plus tard.');
      }
      throw new Error(`Network error: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    // console.log(data);
    // Store tokens if authentication is successful
    if (data.accessToken) {
      // console.log(data.accessToken);
      localStorage.setItem('accessTokenTenant', data.accessToken);
      setCookie("refreshTokenTenant", data.refreshToken, 7);
      window.location.href = tenantDashboardURL; 
    } else {
      alert('Erreur de login. Veuillez vérifier vos informations.');
    }
  })
  .catch(error => {
    // console.error('Error:', error);
    // alert('Une erreur est survenue. Veuillez réessayer.');
  });
}

// Event listener for form submission
document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault(); 
  makeRequest();
});

// Link to reset password
const passLink = document.querySelector("form .pass-link a");
passLink.onclick = () => {
  window.location.href = tenantResetPwdURL;
};
