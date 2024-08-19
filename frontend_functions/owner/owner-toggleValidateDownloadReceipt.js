

const receiptData = JSON.parse(localStorage.getItem('selectedReceipt'));
document.addEventListener('DOMContentLoaded', (event) => {
  if (receiptData) {
    let receiptBtns = document.getElementById('receipt-btns');
    if (receiptData.payment_state == 1) {
      const downloadBtn = document.createElement('button');
      downloadBtn.id = 'download-pdf';
      downloadBtn.onclick = downloadPDF;
      downloadBtn.innerHTML = "Télécharger en PDF"
      receiptBtns.appendChild(downloadBtn);

    }
    if (receiptData.payment_state == 0) {
      const validateBtn = document.createElement('button');
      validateBtn.id = 'validate-receipt';
      validateBtn.onclick = validateReceiptLogic;
      validateBtn.innerHTML = "Valider le reçu"
      receiptBtns.appendChild(validateBtn);
    }
    const receiptDetails = document.getElementById('receipt-details-container');
    const formattedDate = new Date(receiptData.create_time).toLocaleString('fr-FR', {
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
    receiptDetails.innerHTML = '';

    receiptDetails.innerHTML = `
      <p><strong>Numéro de Reçu :</strong> ${receiptData.receiptNumber} </p>
      <p><strong>Date d'Émission :</strong> ${receiptData.issueDate} </p>
      <p><strong>Nom du Locataire :</strong> ${receiptData.lastname} ${receiptData.firstname} </p>
      <p><strong>Adresse du Locataire :</strong> ${receiptData.address} </p>
      <p><strong>Montant du Loyer :</strong> ${receiptData.sumpayed} FCFA</p>          
      <p><strong>Règlement du mois de :</strong> ${formattedMonthpayed}</p>  
      <p id="payment-date"><strong>Date de Paiement :</strong> ${formattedDate}</p>        
    `;
    document.getElementById('signature-image').src = "/owner" + localStorage.getItem("uploadedImageFilename");
  }

  
});