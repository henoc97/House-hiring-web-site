/**
 * Sends a request to create receipts for selected months and updates the UI accordingly.
 * This function calculates the cost per month, sends a POST request for each selected month,
 * and handles the response or error appropriately.
 * @function
 * @returns {void}
 */
function requireRecieptRequest() {
  // Get the tenant property  amount
  let sumpayed = document.getElementById('receipt-sumpayed').value;

  // Get the tenant property accessory fees
  let accessoryFees = document.getElementById('receipt-accessory_fees').value;

  // Get the tenant payment reference
  let ref = document.getElementById('receipt-txn-id').value;

  // Get the tenant payment method
  let method = document.querySelector(
    'input[name="receipt-payment-method"]:checked'
  ).value;

  // Get the tenant payment date
  let createDate = document.getElementById('receipt-date-hour').value;

  // Get the selected months
  let months = Array.from(
    document.getElementById('receipt-months').selectedOptions
  ).map((option) => option.value);

  // Validate that at least one month is selected
  if (months.length === 0) {
    alert('Veuillez sélectionner au moins un mois.'); // Alerts the user in French
    return;
  }

  // Calculate the cost per month if the total cost is divided equally
  let costPerMonth = parseFloat(sumpayed) / months.length;

  // Iterate through each selected month and send a request
  months.forEach((month) => {
    fetch(hostTenant + 'require-receipt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        sumpayed: costPerMonth,
        accessoryFees: accessoryFees,
        ref: ref,
        method: method,
        monthpayed: month.trim(),
        createDate: createDate,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            window.location.href = tenantLogSignURL;
          }
          // Redirect on other HTTP errors (e.g., 500)
          //   window.location.href = tenantError;
          throw new Error('HTTP error ' + response.status); // Throw an error to trigger the .catch
        }
        return response.json();
      })
      .then((unvalidReceipt) => {
        console.log(unvalidReceipt['data']);
        document.getElementById('receipt-form').reset();
        // Format local date and set it into dateTimeInput
        const dateTimeInput = document.getElementById('receipt-date-hour');
        const now = new Date();
        const formattedDateTime = now.toISOString().slice(0, 16);
        dateTimeInput.value = formattedDateTime;

        // Optionally handle further processing of the receipt
        addUnvalidReceipt(unvalidReceipt['data']);
        // addDropdownsListener(); // Uncomment if needed
      })
      .catch((error) => {
        console.log(error);
        // window.location.href = tenantError;
      });
  });

  // Reset the month selection
  document.getElementById('receipt-months').selectedIndex = -1;
}
