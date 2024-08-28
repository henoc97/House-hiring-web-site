/**
 * Retrieves the selected receipt data from local storage.
 * @type {Object} - The receipt data.
 */
const receiptData = JSON.parse(localStorage.getItem('selectedReceipt'));

/**
 * Initializes the page by setting up receipt details and actions.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  if (receiptData) {
    const receiptBtns = document.getElementById('receipt-btns');
    
    // Create and append the download PDF button if payment state is 1
    if (receiptData.payment_state == 1) {
      const downloadBtn = document.createElement('button');
      downloadBtn.id = 'download-pdf';
      downloadBtn.onclick = downloadPDF;
      downloadBtn.innerHTML = "Download PDF";
      receiptBtns.appendChild(downloadBtn);
    }
    
    const receiptDetails = document.getElementById('receipt-details-container');
    const ownerDetails = document.getElementById('owner-details-container');
    
    // Format the dates
    const formattedDate = new Date(receiptData.create_time).toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).replace(',', '').replace(/\//g, '-');
    
    const validationDate = new Date(receiptData.validation_date).toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).replace(',', '').replace(/\//g, '-');
    
    const formattedMonthpayed = new Date(receiptData.monthpayed).toLocaleString('fr-FR', {
        month: 'long',
        year: 'numeric'
    }).replace(',', '').replace(/\//g, '-');
    
    // Populate receipt details
    receiptDetails.innerHTML = `
      <p><strong>Receipt Number:</strong> ${receiptData.receiptNumber} </p>
      <p><strong>Issue Date:</strong> ${validationDate} </p>
      <p><strong>Tenant's Name:</strong> ${receiptData.lastname} ${receiptData.firstname} </p>
      <p><strong>Tenant's Address:</strong> ${receiptData.address} </p>
      <p><strong>Rent Amount:</strong> ${receiptData.sumpayed} FCFA</p>
      <p><strong>Payment for the Month of:</strong> ${formattedMonthpayed}</p>
      <p id="payment-date"><strong>Payment Date:</strong> ${formattedDate}</p>
    `;
    
    // Populate owner details
    ownerDetails.innerHTML = `
      <p><strong>Owner's Name:</strong> ${receiptData.owner_lastname} ${receiptData.owner_firstname}</p>
      <p><strong>Phone:</strong> ${receiptData.owner_contactmoov} / ${receiptData.owner_contacttg}</p>
      <p><strong>Email:</strong> ${receiptData.owner_email}</p>
    `;
    
    // Set the source of the signature image
    document.getElementById('signature-image').src = receiptData.owner_img_url;
  }
});
