/**
 * Retrieves selected receipt data from localStorage and initializes the page content
 * with appropriate buttons and receipt details when the DOM is fully loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  // Retrieve the selected receipt data from localStorage
  const receiptData = JSON.parse(localStorage.getItem('selectedReceipt'));

  if (receiptData) {
    // Get the container for receipt buttons
    let receiptBtns = document.getElementById('receipt-btns');

    // Create and append a download button if the payment state is 1
    if (receiptData.payment_state == 1) {
      const downloadBtn = document.createElement('button');
      downloadBtn.id = 'download-pdf';
      downloadBtn.onclick = downloadPDF; // Function to handle PDF download
      downloadBtn.innerHTML = 'Télécharger en PDF';
      receiptBtns.appendChild(downloadBtn);
    }

    // Create and append a validate button if the payment state is 0
    if (receiptData.payment_state == 0) {
      const validateBtn = document.createElement('button');
      validateBtn.id = 'validate-receipt';
      validateBtn.onclick = validateReceiptLogic; // Function to handle receipt validation
      validateBtn.innerHTML = 'Valider le reçu';
      receiptBtns.appendChild(validateBtn);
    }

    // Format and display receipt details
    const receiptNumDate = document.getElementById('receipt-num-date');
    const receiptDetails = document.getElementById('receipt-details-container');
    const ownerDetails = document.getElementById('owner-details-container');
    const paymentDetails = document.getElementById('payment-details-container');
    const unpaidMonthsCount = document.getElementById('tr-unpaid-months-count');
    const unpaidMonthsAmount = document.getElementById('unpaid-month-amount');

    // Format dates for display
    const formattedDate = new Date(receiptData.last_create_time)
      .toLocaleString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
      .replace(',', '')
      .replace(/\//g, '-');

    const validationDate = new Date(receiptData.validation_date)
      .toLocaleString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
      .replace(',', '')
      .replace(/\//g, '-');

    const unpaidMonths = receiptData.unpaid_months ?? '';
    const formattedMonthUnpayeds = unpaidMonths
      .split(',')
      .map((month, i) =>
        new Date(month)
          .toLocaleString('fr-FR', {
            month: 'long',
            year: 'numeric',
          })
          .replace(',', '')
          .replace(/\//g, '-')
      )
      .join(', ');

    const paidMonths = receiptData.paid_months ?? '';
    const formattedMonthspayeds = paidMonths
      .split(', ')
      .map((month, i) =>
        new Date(month)
          .toLocaleString('fr-FR', {
            month: 'numeric',
            year: 'numeric',
          })
          .replace(',', '')
          .replace(/\//g, '-')
      )
      .join(', ');

    receiptNumDate.innerHTML = `
        <p><strong>Numéro de Reçu :</strong> ${receiptData.receiptNumber ?? ''}</p>
        <p><strong>Date d'Émission :</strong> ${validationDate ?? ''}</p>
      `;

    // Update the receipt details container with the formatted data
    receiptDetails.innerHTML = `
            <p><strong>Nom du Locataire :</strong> ${receiptData.lastname ?? ''} ${receiptData.firstname ?? ''}</p>
            <p><strong>Adresse :</strong> ${receiptData.address ?? ''}</p>
            <p><strong>Montant${receiptData.month_rest_amount_due > 0 ? '(incomplet)' : ''} :</strong> ${receiptData.total_sumpayed ?? ''} FCFA</p>
            <p><strong>Frais supplémentaires :</strong> ${receiptData.total_accessory_fees ?? ''} FCFA</p>
            <p><strong>Règlement du mois de :</strong> ${formattedMonthspayeds ?? ''}</p>
            `;

    // Update the owner details container with the owner's information
    paymentDetails.innerHTML = `
            <p><strong>Méthode : </strong>${receiptData.method}</p>
            <p><strong>Référence de Transaction : </strong>${receiptData.ref}</p>
            <p id="payment-date"><strong>Date : </strong> ${formattedDate ?? ''}</p>
        `;

    // Update the payment details container with the payment's information
    ownerDetails.innerHTML = `
            <p><strong>Nom du Propriétaire :</strong> ${receiptData.owner_lastname ?? ''} ${receiptData.owner_firstname ?? ''}</p>
            <p><strong>Téléphone :</strong> ${receiptData.owner_contactmoov ?? ''} / ${receiptData.owner_contacttg ?? ''}</p>
            <p><strong>Email :</strong> ${receiptData.owner_email ?? ''}</p>
        `;

    unpaidMonthsCount.innerHTML = `Mois impayés (${receiptData.unpaid_months_count})`;
    unpaidMonthsAmount.innerHTML = `
            <td>${unpaidMonths === '' ? '--' : formattedMonthUnpayeds}</td>
            <td>${receiptData.rest_amount_due < 0 ? 0 : receiptData.rest_amount_due} fcf</td>
        `;

    // Set the source of the signature image
    document.getElementById('signature-image').src = receiptData.owner_img_url;
  }
});
