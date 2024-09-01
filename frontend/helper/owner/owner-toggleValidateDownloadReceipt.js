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
          downloadBtn.innerHTML = "Télécharger en PDF";
          receiptBtns.appendChild(downloadBtn);
      }

      // Create and append a validate button if the payment state is 0
      if (receiptData.payment_state == 0) {
          const validateBtn = document.createElement('button');
          validateBtn.id = 'validate-receipt';
          validateBtn.onclick = validateReceiptLogic; // Function to handle receipt validation
          validateBtn.innerHTML = "Valider le reçu";
          receiptBtns.appendChild(validateBtn);
      }

      // Format and display receipt details
      const receiptDetails = document.getElementById('receipt-details-container');
      const ownerDetails = document.getElementById('owner-details-container');

      // Format dates for display
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
      }).replace(',', '').replace(/\//g, '-');

      const formattedMonthpayed = new Date(receiptData.monthpayed).toLocaleString('fr-FR', {
          month: 'long',
          year: 'numeric'
      }).replace(',', '').replace(/\//g, '-');

      // Update the receipt details container with the formatted data
      receiptDetails.innerHTML = `
          <p><strong>Numéro de Reçu :</strong> ${receiptData.receiptNumber ?? ''}</p>
          <p><strong>Date d'Émission :</strong> ${validationDate ?? ''}</p>
          <p><strong>Nom du Locataire :</strong> ${receiptData.lastname ?? ''} ${receiptData.firstname ?? ''}</p>
          <p><strong>Adresse du Locataire :</strong> ${receiptData.address ?? ''}</p>
          <p><strong>Montant du Loyer :</strong> ${receiptData.sumpayed ?? ''} FCFA</p>
          <p><strong>Règlement du mois de :</strong> ${formattedMonthpayed ?? ''}</p>
          <p id="payment-date"><strong>Date de Paiement :</strong> ${formattedDate ?? ''}</p>
      `;

      // Update the owner details container with the owner's information
      ownerDetails.innerHTML = `
          <p><strong>Nom du Propriétaire :</strong> ${receiptData.owner_lastname ?? ''} ${receiptData.owner_firstname ?? ''}</p>
          <p><strong>Téléphone :</strong> ${receiptData.owner_contactmoov ?? ''} / ${receiptData.owner_contacttg ?? ''}</p>
          <p><strong>Email :</strong> ${receiptData.owner_email ?? ''}</p>
      `;

      // Set the source of the signature image
      document.getElementById('signature-image').src = receiptData.owner_img_url;
  }
});
