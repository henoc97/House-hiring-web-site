

function  accessReceipt(e) {
  if (e.target && e.target.closest('.go-validate-receipt')) {
            
      e.preventDefault();
      const receiptData = JSON.parse(e.target.closest('.go-validate-receipt').getAttribute('data-receipt'));
  
      // Generate a unique receipt number
      const receiptNumber = 'REC' + Date.now(); // Example: REC1627890123456
      // Add receipt number and issue date to receipt data
      receiptData.receiptNumber = receiptNumber;
  
      // Store the complete receipt data in localStorage
      localStorage.setItem('selectedReceipt', JSON.stringify(receiptData));
  
      // Redirect to the validation page
      window.location.href = receiptURLTenant;
    }
}