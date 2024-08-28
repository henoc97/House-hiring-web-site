/**
 * Makes an authentication request to the server.
 */
function makeRequest() {
  // Collect email and password from form inputs
  let email = document.getElementById('email').value;
  let pwd = document.getElementById('pwd').value;
  const messageDiv = document.getElementById('message');

  fetch(hostAdmin + 'admin-auth', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: email, pwd: pwd })
  })
  .then(response => {
      if (!response.ok) {
          handleAuthError(response, messageDiv);
          throw new Error(`Erreur de réseau: ${response.status}`);
      }
      return response.json();
  })
  .then(data => {
      // Handle successful authentication
      if (data.accessToken) {
          localStorage.setItem('accessTokenAdmin', data.accessToken);
          setCookie("refreshTokenAdmin", data.refreshToken, 7);
          window.location.href = adminDashboardURL;
      } else {
          // If no accessToken is returned
          messageDiv.textContent = 'Erreur de login. Veuillez vérifier vos informations.';
          messageDiv.classList.add('red-message');
          messageDiv.classList.remove('green-message');
      }
  })
  .catch(error => {
      // Handle any errors that occur during the fetch
      console.error('Erreur:', error);
      messageDiv.textContent = 'Une erreur est survenue. Veuillez réessayer.';
      messageDiv.classList.add('red-message');
      messageDiv.classList.remove('green-message');
  });
}

/**
* Handles authentication errors based on HTTP status codes.
* @param {Response} response - The response object from the fetch request.
* @param {HTMLElement} messageDiv - The HTML element to display messages.
*/
function handleAuthError(response, messageDiv) {
  if (response.status === 401) {
      messageDiv.textContent = 'Accès interdit. Vérifiez vos informations de connexion.';
      messageDiv.classList.add('red-message');
      messageDiv.classList.remove('green-message');
  } else if (response.status === 404) {
      messageDiv.textContent = 'Mot de passe ou email incorrect.';
      messageDiv.classList.add('red-message');
      messageDiv.classList.remove('green-message');
  } else {
      messageDiv.textContent = 'Le serveur est temporairement indisponible. Veuillez réessayer plus tard.';
      messageDiv.classList.add('red-message');
      messageDiv.classList.remove('green-message');
  }
}


// Add event listener for form submission
document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent default form submission
  makeRequest();
});
