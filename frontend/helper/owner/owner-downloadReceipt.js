

function downloadPDF() {
  // Sélectionne l'élément HTML à convertir en PDF en utilisant son ID
  const element = document.getElementById('receipt');

  // Formate la date du mois payé pour l'utiliser dans le nom du fichier PDF
  const formattedMonthpayed = new Date(receiptData.monthpayed).toLocaleString('fr-FR', {
      month: 'long',   // Formate le mois en texte long (ex: "janvier")
      year: 'numeric'  // Formate l'année en quatre chiffres
  }).replace(',', '').replace(/\//g, '-'); // Remplace les virgules et les barres obliques par des tirets pour un formatage uniforme

  // Définit les options pour la conversion en PDF
  const options = {
      margin: [0.5, 0.5, 0.5, 0.5], // Définit les marges du PDF (en pouces)
      filename: `recu_${formattedMonthpayed}_${receiptData.lastname}.pdf`, // Nom du fichier PDF en incluant la date formatée
      image: { type: 'jpeg', quality: 1.0 }, // Spécifie le format et la qualité de l'image pour le rendu
      html2canvas: {
          scale: 3, // Augmente l'échelle pour améliorer la résolution du rendu
          letterRendering: true, // Améliore le rendu des lettres pour une meilleure lisibilité
          useCORS: true // Permet de charger les ressources externes (images, etc.) via CORS
      },
      jsPDF: {
          unit: 'px', // Définit l'unité de mesure en pixels pour correspondre à l'élément HTML
          format: [element.offsetWidth, element.offsetHeight], // Définit la taille du PDF en fonction des dimensions de l'élément HTML
          orientation: 'portrait' // Définit l'orientation du PDF en mode portrait
      }
  };

  // Convertit l'élément HTML en PDF en utilisant les options définies et déclenche le téléchargement du fichier
  html2pdf().set(options).from(element).save();
}
