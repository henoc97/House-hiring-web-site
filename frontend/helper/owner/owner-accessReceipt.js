/**
 * Handles the receipt access event when a validation button is clicked.
 * @param {Event} e - The event object representing the click event.
 */
function accessReceipt(e) {
  if (e.target && e.target.closest('.go-validate-receipt')) {
    e.preventDefault(); // Prevent the default action of the event

    // Parse the receipt data from the data-receipt attribute
    const receiptData = JSON.parse(
      e.target.closest('.go-validate-receipt').getAttribute('data-receipt')
    );

    // Generate a unique receipt number using the current timestamp
    const receiptNumber = 'REC' + Date.now(); // Example: REC1627890123456

    // Add the receipt number and issue date to the receipt data
    receiptData.receiptNumber = receiptNumber;

    // Store the complete receipt data in localStorage
    localStorage.setItem('selectedReceipt', JSON.stringify(receiptData));

    // Redirect to the validation page
    window.location.href = receiptURL;
  }
}
