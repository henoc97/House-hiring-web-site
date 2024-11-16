/**
 * Handles the process of accessing a receipt, including storing receipt data and redirecting to a validation page.
 * @param {Event} e - The event object from the click event.
 */
function accessReceipt(e) {
  // Check if the event target or its closest ancestor has the class 'go-validate-receipt'
  if (e.target && e.target.closest('.go-validate-receipt')) {
    // Prevent the default action of the event
    e.preventDefault();

    // Retrieve and parse the receipt data from the data attribute of the closest element with class 'go-validate-receipt'
    const receiptData = JSON.parse(
      e.target.closest('.go-validate-receipt').getAttribute('data-receipt')
    );

    // Generate a unique receipt number using the current timestamp
    const receiptNumber = 'REC' + Date.now(); // Example format: REC1627890123456

    // Add the generated receipt number to the receipt data
    receiptData.receiptNumber = receiptNumber;

    // Store the complete receipt data in localStorage for later use
    localStorage.setItem('selectedReceipt', JSON.stringify(receiptData));

    // Redirect to the receipt validation page
    window.location.href = receiptURLTenant;
  }
}
