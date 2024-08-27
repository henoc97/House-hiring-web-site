


document.getElementById('reset-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Empêche la soumission par défaut du formulaire

    const params = new URLSearchParams(window.location.search);
    const email = params.get('email');
    const otp = params.get('otp');

    const pwd = document.getElementById('reset-pwd').value;
    const pwd1 = document.getElementById('reset-pwd1').value;
    const messageDiv = document.getElementById('message');

    // Réinitialise le message
    messageDiv.textContent = '';

    // Vérification si les mots de passe correspondent
    if (pwd !== pwd1) {
        messageDiv.textContent = "Les mots de passe ne correspondent pas.";
        messageDiv.classList.remove('green-message');
        messageDiv.classList.add('red-message');
        return;
    }

    // Envoi de la requête POST via fetch
    fetch(host + 'reset-pwd', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            otp: otp,
            pwd: pwd
        })
    })
    .then(response => {
      if (!response.ok) {
        if (response.status === 401) {
          alert('Accès interdit. Vérifiez vos informations.');
        } else if (response.status === 504) {
          alert('Le serveur est temporairement indisponible. Veuillez réessayer plus tard.');
        } else {
          alert('Erreur de réseau ou serveur inaccessible. Code d\'erreur : ' + response.status);
        }
        alert('Le serveur est temporairement indisponible. Veuillez réessayer plus tard.');
        throw new Error(`Erreur de réseau: ${response.status}`);
      }
      return response.json()})
    .then(data => {
        // Gérer la réponse de la requête ici
        if (data.message === 'requête réussie') {
            document.getElementById('reset-form').reset();
            window.location.href = ownerLogSignURL;
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
