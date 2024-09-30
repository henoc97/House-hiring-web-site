/**
 * Handles the submission of the signup form.
 * Validates the passwords and sends a POST request to get an OTP for email verification.
 */
document
  .getElementById('signup-form')
  .addEventListener('submit', function (event) {
    event.preventDefault(); // Prevents the default form submission

    const email = document.getElementById('signup-email').value;
    const pwd = document.getElementById('signup-pwd').value;
    const pwd1 = document.getElementById('signup-pwd1').value;
    const messageDiv = document.getElementById('signup-message');

    // Reset the message
    messageDiv.textContent = '';

    const value = validatePassword(pwd, pwd1, messageDiv);

    if (value === false) return;

    // Send a POST request via fetch
    fetch(host + 'get-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        pwd: pwd,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401) {
            alert('Accès interdit. Vérifiez vos informations de connexion.');
          } else if (response.status === 504) {
            alert(
              'Le serveur est temporairement indisponible. Veuillez réessayer plus tard.'
            );
          } else {
            alert(
              "Erreur de réseau ou serveur inaccessible. Code d'erreur : " +
                response.status
            );
          }
          throw new Error(`Network error: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Handle the response here
        if (data.message === 'Request successful') {
          document.getElementById('signup-form').reset();
          messageDiv.textContent =
            "Veuillez vérifier vos courriers pour valider l'inscription.";
          messageDiv.classList.remove('red-message');
          messageDiv.classList.add('green-message');
        } else {
          messageDiv.textContent = 'Erreur: ' + data.message;
          messageDiv.classList.add('red-message');
          messageDiv.classList.remove('green-message');
        }
      })
      .catch((error) => {
        messageDiv.textContent =
          "Une erreur s'est produite. Veuillez réessayer.";
        messageDiv.classList.add('red-message');
        messageDiv.classList.remove('green-message');
      });
  });

/**
 * Sends an authentication request with email and password.
 * Stores tokens in localStorage if authentication is successful and redirects to the owner dashboard.
 */
function makeRequest() {
  let email = document.getElementById('email').value;
  let pwd = document.getElementById('pwd').value;
  const messageDiv = document.getElementById('login-message');

  fetch(host + 'user-auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ email: email, pwd: pwd }),
  })
    .then((response) => {
      if (!response.ok) {
        if (response.status === 401) {
          alert('Accès interdit. Vérifiez vos informations de connexion.');
        } else if (response.status === 404) {
          messageDiv.textContent = 'Mot de passe ou email incorrect.';
          messageDiv.classList.add('red-message');
          messageDiv.classList.remove('green-message');
        } else {
          alert(
            'e serveur est temporairement indisponible. Veuillez réessayer plus tard.'
          );
        }
        throw new Error(`Network error: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // Store tokens if authentication is successful
      if (data.message == 'Request successful') {
        localStorage.setItem('sold', data.user.sold);
        window.location.href = ownerDashboardURL;
      } else {
        alert('Erreur de login. Veuillez vérifier vos informations.');
      }
    })
    .catch((error) => {});
}

/**
 * Handles the submission of the login form.
 * Prevents the default form submission and calls the makeRequest function.
 */
document
  .getElementById('login-form')
  .addEventListener('submit', function (event) {
    event.preventDefault();
    makeRequest();
  });
