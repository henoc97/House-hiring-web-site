/**
 * Converts an HTML element to a PDF and triggers the download.
 */
function downloadPDF() {
    // Selects the HTML element to convert to PDF using its ID
    const element = document.getElementById('receipt');
  
    // Formats the paid month date to use in the PDF filename
    const formattedMonthpayed = new Date(receiptData.monthpayed).toLocaleString('fr-FR', {
        month: 'long',   // Formats the month in long text (e.g., "janvier")
        year: 'numeric'  // Formats the year in four digits
    }).replace(',', '').replace(/\//g, '-'); // Replaces commas and slashes with hyphens for consistent formatting
  
    // Defines options for the PDF conversion
    const options = {
        margin: [0.5, 0.5, 0.5, 0.5], // Sets the PDF margins (in inches)
        filename: `recu_${formattedMonthpayed}_${receiptData.lastname}.pdf`, // PDF filename including the formatted date
        image: { type: 'jpeg', quality: 1.0 }, // Specifies the image format and quality for rendering
        html2canvas: {
            scale: 3, // Increases scale to improve the rendering resolution
            letterRendering: true, // Enhances letter rendering for better readability
            useCORS: true // Allows loading external resources (images, etc.) via CORS
        },
        jsPDF: {
            unit: 'px', // Sets the measurement unit to pixels to match the HTML element
            format: [element.offsetWidth, element.offsetHeight], // Sets the PDF size based on the dimensions of the HTML element
            orientation: 'portrait' // Sets the PDF orientation to portrait
        }
    };
  
    // Converts the HTML element to a PDF using the defined options and triggers the file download
    html2pdf().set(options).from(element).save();
  }
  