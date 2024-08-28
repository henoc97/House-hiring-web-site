/**
 * Sends a request to create receipts for selected months and updates the UI accordingly.
 * This function calculates the cost per month, sends a POST request for each selected month,
 * and handles the response or error appropriately.
 * @function
 * @returns {void}
 */
function requireRecieptRequest() {
    // Get the total amount paid and the selected months
    let sumpayed = document.getElementById('receipt-sumpayed').value;
    let months = Array.from(document.getElementById('receipt-months').selectedOptions).map(option => option.value);
    
    // Check if at least one month is selected
    if (months.length === 0) {
        alert("Please select at least one month.");
        return;
    }
  
    let token = localStorage.getItem('accessTokenTenant');
  
    // Calculate the cost per month if the total cost is divided equally
    let costPerMonth = parseFloat(sumpayed) / months.length;
  
    // Iterate through each selected month and send a request
    months.forEach(month => {
        fetch(hostTenant + 'require-receipt', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "sumpayed": costPerMonth,
                "monthpayed": month.trim()
            })
        })
        .then(response => {
          if (!response.ok) {
              if (response.status === 401 || response.status === 403) {
                  return renewAccessToken().then(() => requireRecieptRequest());
              }
              // Redirect on other HTTP errors (e.g., 500)
              window.location.href = tenantError;
              throw new Error('HTTP error ' + response.status); // Throw an error to trigger the .catch
          }
          return response.json();
        })
        .then(unvalidReceipt => {
              // console.log("Unvalid receipt response: " + JSON.stringify(unvalidReceipt));
              document.getElementById('receipt-form').reset();
              // Optionally handle further processing of the receipt
              addUnvalidReceipt(unvalidReceipt['data']);
              // addDropdownsListener(); // Uncomment if needed
        })
        .catch(error => {
            window.location.href = tenantError;
            // console.error('Error:', error);
        });
    });
  
    // Reset the month selection
    document.getElementById('receipt-months').selectedIndex = -1;
  }
  