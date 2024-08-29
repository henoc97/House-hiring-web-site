/**
 * Handles the form submission for resetting the password.
 * This function prevents the default form submission, validates the password fields,
 * sends a POST request to the server to reset the password, and updates the UI based on the response.
 * @function
 * @returns {void}
 */
document.getElementById('reset-form').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevents the default form submission

  // Get form field values
  const code = document.getElementById('reset-code').value;
  const pwd = document.getElementById('reset-pwd').value;
  const pwd1 = document.getElementById('reset-pwd1').value;
  const messageDiv = document.getElementById('message');

  // Reset the message
  messageDiv.textContent = '';

  const value  = validatePassword(pwd, pwd1, messageDiv);

  if (value === false) return;

  // Send the POST request using fetch
  fetch(hostTenant + 'reset-pwd', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          code: code,
          pwd: pwd
      })
  })
  .then(response => {
    if (!response.ok) {
      if (response.status === 401) {
        alert('Accès interdit. Vérifiez vos informations de connexion.');
      } 
      if (response.status === 404 || response.status === 500) {
        messageDiv.textContent = "Une erreur s'est produite. Code incorrect.";
        messageDiv.classList.add('red-message');
        messageDiv.classList.remove('green-message');
      } else {
        alert('Le serveur est temporairement indisponible. Veuillez réessayer plus tard.');
        throw new Error(`Network error: ${response.status}`);
      }
    }
    return response.json();
  })
  .then(data => {
      // Handle the server response here
      if (data.message === 'Request successful') {
          document.getElementById('reset-form').reset();
          window.location.href = tenantLogSignURL;
      } else {
        messageDiv.textContent = "Une erreur s'est produite. Code incorrect.";
        messageDiv.classList.add('red-message');
        messageDiv.classList.remove('green-message');
      }
  })
  .catch(error => {
      messageDiv.textContent = "Une erreur s'est produite. Veuillez réessayer.";
      messageDiv.classList.add('red-message');
      messageDiv.classList.remove('green-message');
  });
});
