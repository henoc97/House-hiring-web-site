

/**
 * Handles the form submission for sending a reset password email.
 * Prevents the default form submission and sends a POST request to get a reset password OTP.
 * Displays appropriate messages based on the response and handles errors.
 * @param {Event} event - The submit event object.
 */
document.getElementById('send-email-form').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevents the default form submission
  
  const email = document.getElementById('send-email').value;
  const messageDiv = document.getElementById('message');
  
  // Reset the message display
  messageDiv.textContent = '';

  // Send POST request via fetch
  fetch(host + 'get-reset-pwd-otp', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          email: email,
      })
  })
  .then(response => {
      if (!response.ok) {
          if (response.status === 401) {
              alert('Accès interdit. Vérifiez vos informations.'); // Alert for forbidden access
          } 
          if (response.status === 504) {
              alert('Le serveur est temporairement indisponible. Veuillez réessayer plus tard.'); // Alert for server unavailability
          } 
          if (response.status === 404) {
              messageDiv.textContent = "Erreur : " + "Votre email n'est lié à aucun compte."; // Error message for email not found
              messageDiv.classList.add('red-message');
              messageDiv.classList.remove('green-message');
          } else {
              alert('Le serveur est temporairement indisponible. Veuillez réessayer plus tard.'); // General server error alert
              throw new Error(`Erreur de réseau: ${response.status}`); // Throws error to trigger .catch
          }
      }
      return response.json();
  })
  .then(data => {
      // Handle the response from the request
      if (data.message === 'OTP sent') {
          document.getElementById('send-email-form').reset(); // Reset the form upon success
          messageDiv.textContent = "Veuillez vérifier vos courriers pour réinitialiser votre mot de passe."; // Success message
          messageDiv.classList.remove('red-message');
          messageDiv.classList.add('green-message');
      } else {
          messageDiv.textContent = "Erreur : " + data.message; // Error message from the server
          messageDiv.classList.add('red-message');
          messageDiv.classList.remove('green-message');
      }
  })
  .catch(error => {
      console.error('Erreur:', error); // Log the error to the console
      messageDiv.textContent = "Une erreur s'est produite. Veuillez réessayer."; // Error message for general issues
      messageDiv.classList.add('red-message');
      messageDiv.classList.remove('green-message');
  });
});
