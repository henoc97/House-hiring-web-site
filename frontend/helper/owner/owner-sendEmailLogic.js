


document.getElementById('send-email-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Empêche la soumission par défaut du formulaire
    const email = document.getElementById('send-email').value;
    const messageDiv = document.getElementById('message');
    
    // Réinitialise le message
    messageDiv.textContent = '';

    // Envoi de la requête POST via fetch
    fetch(host + 'get-reset-pwd-otp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
        })
    })
    .then(response => {
      if (!response.ok) {
        if (response.status === 401) {
          alert('Accès interdit. Vérifiez vos informations.');
        } 
        if (response.status === 504) {
          alert('Le serveur est temporairement indisponible. Veuillez réessayer plus tard.');
        } 
        if (response.status === 404) {
          messageDiv.textContent = "Erreur : " + "Votre email n\' est lié à aucun compte.";
          messageDiv.classList.add('red-message');
          messageDiv.classList.remove('green-message');
        } else {
          alert('Le serveur est temporairement indisponible. Veuillez réessayer plus tard.');
          throw new Error(`Erreur de réseau: ${response.status}`);
        }
      }
      return response.json()})
    .then(data => {
        // Gérer la réponse de la requête ici
        if (data.message === 'OTP envoyé') {
            document.getElementById('send-email-form').reset();
            messageDiv.textContent = "Veuillez vérifier vos courriers pour réinitialiser votre mot de passe.";
            messageDiv.classList.remove('red-message');
            messageDiv.classList.add('green-message');
        } else {
            messageDiv.textContent = "Erreur : " + data.message;
            messageDiv.classList.add('red-message');
            messageDiv.classList.remove('green-message');
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
        messageDiv.textContent = "Une erreur s'est produite. Veuillez réessayer.";
        messageDiv.classList.add('red-message');
        messageDiv.classList.remove('green-message');
    });
});