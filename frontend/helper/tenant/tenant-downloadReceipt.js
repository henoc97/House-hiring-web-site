/**
 * Converts the specified HTML element to a PDF and triggers the download.
 */
function downloadPDF() {
  // Selects the HTML element to convert to PDF using its ID
  const element = document.getElementById('receipt');
  const receiptData = JSON.parse(localStorage.getItem('selectedReceipt'));

  if (receiptData) {
    // Formats the date of the paid month to use in the PDF file name
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
      .join('.');

    // Defines options for the PDF conversion
    const options = {
      margin: [0.5, 0.5, 0.5, 0.5], // Sets the PDF margins (in inches)
      filename: `receipt_${formattedMonthspayeds}_${receiptData.lastname}.pdf`, // PDF file name including the formatted date
      image: { type: 'jpeg', quality: 1.0 }, // Specifies the format and quality of the image for rendering
      html2canvas: {
        scale: 3, // Increases the scale to improve rendering resolution
        letterRendering: true, // Enhances letter rendering for better readability
        useCORS: true, // Allows loading external resources (images, etc.) via CORS
      },
      jsPDF: {
        unit: 'px', // Sets the unit of measurement to pixels to match the HTML element
        format: [element.offsetWidth, element.offsetHeight], // Sets the PDF size based on the dimensions of the HTML element
        orientation: 'portrait', // Sets the PDF orientation to portrait mode
      },
    };

    // Converts the HTML element to a PDF using the defined options and triggers the file download
    html2pdf().set(options).from(element).save();
  }
}
