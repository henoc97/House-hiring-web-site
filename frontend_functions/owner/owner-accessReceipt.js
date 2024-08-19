

function  accessReceipt(e) {
    if (e.target && e.target.closest('.go-validate-receipt')) {
              
        e.preventDefault();
        const receiptData = JSON.parse(e.target.closest('.go-validate-receipt').getAttribute('data-receipt'));
    
        // Generate a unique receipt number
        const receiptNumber = 'REC' + Date.now(); // Example: REC1627890123456
    
        // Get the current date
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        });
    
        // Add receipt number and issue date to receipt data
        receiptData.receiptNumber = receiptNumber;
        receiptData.issueDate = formattedDate;
    
        // Store the complete receipt data in localStorage
        localStorage.setItem('selectedReceipt', JSON.stringify(receiptData));
    
        // Redirect to the validation page
        window.location.href = receiptURL;
      }
}