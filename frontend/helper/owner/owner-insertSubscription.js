/**
 * Inserts a new subscription by sending subscription data to the server.
 * It retrieves user input values from the form, sends them as a JSON payload
 * to the server, and handles the response accordingly.
 */
function insertSubscription() {
  // Get the message display element
  const messageDiv = document.getElementById('message');

  // Reset the message content
  messageDiv.textContent = '';

  // Collect data from the form
  const inseredData = {
    email: document.getElementById('subscription-email').value,
    ref: document.getElementById('subscription-txn-id').value,
    sumpaid: document.getElementById('subscription-amount').value,
    method: document.querySelector('input[name="payment-method"]:checked')
      .value,
  };

  // Send a POST request to the server with the subscription data
  fetch(host + 'insert-subscription', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(inseredData), // Send the collected data as JSON
  })
    .then((response) => {
      // Check if the response is OK (status code 200-299)
      if (!response.ok) {
        // Handle unauthorized or forbidden responses
        if (response.status === 401 || response.status === 403) {
          window.location.href = ownerLogSignURL;
        }
        // Handle other HTTP errors (e.g., 500 Internal Server Error)
        window.location.href = ownerError;
        throw new Error('HTTP error ' + response.status); // Throw error to trigger catch block
      }
      // Parse the JSON response
      return response.json();
    })
    .then((subscription) => {
      // Reset the form fields
      document.getElementById('subscription-form').reset();

      // Display a success message
      messageDiv.textContent =
        'Paiement signalé ! Nous traiterons votre demande dans les plus brefs délais...';
      messageDiv.classList.remove('red-message'); // Remove error message styling
      messageDiv.classList.add('green-message'); // Add success message styling
    })
    .catch((error) => {
      // Log the error and handle failure
      window.location.href = ownerError;
    });
}
