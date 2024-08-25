

document.addEventListener("DOMContentLoaded", function() {
    const url = host + 'verify-owner';
    const params = new URLSearchParams(window.location.search);
    const email = params.get('email');
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    })
    .then(async response => {
      if (!response.ok) {
        const errorData = await response.json();
        alert('Erreur lors de la vérification du compte'); // Affiche un message d'erreur plus descriptif
        throw new Error(errorData.message || 'Erreur inconnue');
      }
      return response.json();
    })
    .then(data => {
      console.log("data: " + JSON.stringify(data));
      localStorage.setItem('tempId', data.id);
      window.location.href = ownerResetPwdURL;
      
    })
    .catch(error => {
      console.error('Error:', error);  // Affiche l'erreur complète dans la console
      alert('Erreur lors de la vérification du compte : ' + error.message); // Affiche un message d'erreur plus descriptif
    });
  });