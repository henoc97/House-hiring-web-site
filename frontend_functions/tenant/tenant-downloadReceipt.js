

function downloadPDF() {
    // Sélectionnez l'élément HTML que vous souhaitez convertir en PDF
    const element = document.getElementById('receipt');
    const formattedMonthpayed = new Date(receiptData.monthpayed).toLocaleString('fr-FR', {
          month: 'long',
          year: 'numeric'
        }).replace(',', '').replace(/\//g, '-');

    // Créez les options pour la conversion
    const options = {

      margin: 1,
      filename: `recu_${formattedMonthpayed}.pdf`,
      image: { type: 'jpeg', quality: 1.0 },
      html2canvas: { scale: 4 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // Utilisez html2pdf pour convertir l'élément et télécharger le PDF
    html2pdf().set(options).from(element).save();
}