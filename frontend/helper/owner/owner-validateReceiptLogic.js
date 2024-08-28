
/**
 * Handles the logic for validating a receipt.
 * It checks if there is enough balance to cover the payment and sends a request
 * to validate the receipt if the balance is sufficient.
 */
function validateReceiptLogic() {
  let token = localStorage.getItem('accessToken'); // Retrieves the access token from localStorage
  const receiptData = JSON.parse(localStorage.getItem('selectedReceipt'));

  if (receiptData) {

    const toPay = (receiptData.sumpayed * validateReceiptPrice); // Calculates the amount to pay for receipt validation
    
    // Checks if the balance is sufficient
    if ((getsold() - toPay) > 0) {
      // Sends a POST request to validate the receipt
      fetch(host + 'validate-receipt', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token, // Sets the Authorization header
          'Content-Type': 'application/json' // Sets the Content-Type header
        },
        body: JSON.stringify({
          "id": receiptData.id, // Sends the receipt ID in the request body
        })
      })
      .then(response => {
        // Checks if the response is not OK
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            // Renews the access token if unauthorized or forbidden
            return renewAccessToken().then(() => validateReceiptLogic());
          }
          // Redirects to an error page for other HTTP errors (e.g., 500)
          console.log('Redirecting to error page:', ownerError);
          window.location.href = ownerError;
          throw new Error('HTTP error ' + response.status); // Throws an error to trigger the .catch block
        }
        return response.json(); // Parses the response as JSON
      })
      .then(data => {
        console.log(data); // Logs the response data
        updateSoldRequest(toPay); // Updates the balance after validating the receipt
        window.location.href = ownerDashboardURL; // Redirects to the owner dashboard
      })
      .catch(error => {
        console.log('Redirecting to error page:', ownerError); // Logs redirection to the error page
        window.location.href = ownerError; // Redirects to an error page if an exception is caught
        console.error('Erreur:', error); // Logs the error
      });
    } else {
      alert(`Solde insuffisant. Cette opération coûte ${toPay} XOF`); // Alerts the user if the balance is insufficient
    }
  }

}