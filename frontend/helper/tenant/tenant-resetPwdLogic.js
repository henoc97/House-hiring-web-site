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

  // Check if the passwords match
  if (pwd !== pwd1) {
      messageDiv.textContent = "Passwords do not match.";
      messageDiv.classList.remove('green-message');
      messageDiv.classList.add('red-message');
      return;
  }

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
      console.log(`Network error: ${response.status}`);
      if (response.status === 401) {
        alert('Access denied. Please check your information.');
      } 
      if (response.status === 404 || response.status === 500) {
        messageDiv.textContent = "An error occurred. Incorrect code.";
        messageDiv.classList.add('red-message');
        messageDiv.classList.remove('green-message');
      } else {
        alert('The server is temporarily unavailable. Please try again later.');
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
        messageDiv.textContent = "An error occurred. Incorrect code.";
        messageDiv.classList.add('red-message');
        messageDiv.classList.remove('green-message');
      }
  })
  .catch(error => {
      console.error('Error:', error);
      messageDiv.textContent = "An error occurred. Please try again.";
      messageDiv.classList.add('red-message');
      messageDiv.classList.remove('green-message');
  });
});
