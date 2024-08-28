document.getElementById('reset-form').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevents the default form submission

  const params = new URLSearchParams(window.location.search);
  const email = params.get('email');
  const otp = params.get('otp');

  const pwd = document.getElementById('reset-pwd').value;
  const pwd1 = document.getElementById('reset-pwd1').value;
  const messageDiv = document.getElementById('message');

  // Reset the message display
  messageDiv.textContent = '';

  // Check if the passwords match
  if (pwd !== pwd1) {
      messageDiv.textContent = "Les mots de passe ne correspondent pas."; // Alerts in French
      messageDiv.classList.remove('green-message');
      messageDiv.classList.add('red-message');
      return;
  }

  // Send the POST request via fetch
  fetch(host + 'reset-pwd', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          email: email,
          otp: otp,
          pwd: pwd
      })
  })
  .then(response => {
    if (!response.ok) {
      if (response.status === 401) {
        alert('Accès interdit. Vérifiez vos informations.'); // Alert for forbidden access
      } else if (response.status === 504) {
        alert('Le serveur est temporairement indisponible. Veuillez réessayer plus tard.'); // Alert for server unavailability
      } else {
        alert('Erreur de réseau ou serveur inaccessible. Code d\'erreur : ' + response.status); // General network or server error
      }
      throw new Error(`Network error: ${response.status}`); // Throws an error to trigger the .catch
    }
    return response.json();
  })
  .then(data => {
      // Handle the response from the request
      if (data.message === 'Mot de passe réinitialisé avec succès') {
          document.getElementById('reset-form').reset(); // Reset the form upon success
          window.location.href = ownerLogSignURL; // Redirect on success
      } else {
          messageDiv.textContent = "Erreur : " + data.message;
          messageDiv.classList.add('red-message');
          messageDiv.classList.remove('green-message');
      }
  })
  .catch(error => {
      console.error('Erreur:', error); // Logs the error
      messageDiv.textContent = "Une erreur s'est produite. Veuillez réessayer."; // Alert in French
      messageDiv.classList.add('red-message');
      messageDiv.classList.remove('green-message');
  });
});
