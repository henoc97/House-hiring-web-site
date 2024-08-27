


document.getElementById('reset-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Empêche la soumission par défaut du formulaire

    const code = document.getElementById('reset-code').value;
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
    fetch(hostTenant + 'reset-pwd', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            code: code,
            pwd: pwd
        })
    })
    .then(response => {
      if (!response.ok) {
        console.log(`Erreur de réseau111: ${response.status}`);
        if (response.status === 401) {
          alert('Accès interdit. Vérifiez vos informations.');
        } 
        if (response.status === 404 || response.status === 500) {
          messageDiv.textContent = "Une erreur s'est produite. Code incorrect.";
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
        if (data.message === 'requête réussie') {
            document.getElementById('reset-form').reset();
            window.location.href = tenantLogSignURL;
        } else {
          messageDiv.textContent = "Une erreur s'est produite. Code incorrect.";
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
