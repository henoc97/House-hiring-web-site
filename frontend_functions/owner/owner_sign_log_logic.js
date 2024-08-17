


document.getElementById('signup-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Empêche la soumission par défaut du formulaire

    const email = document.getElementById('signup-email').value;
    const pwd = document.getElementById('signup-pwd').value;
    const pwd1 = document.getElementById('signup-pwd1').value;
    const messageDiv = document.getElementById('message');

    // Réinitialise le message
    messageDiv.textContent = '';

    // Vérification si les mots de passe correspondent
    if (pwd !== pwd1) {
        messageDiv.textContent = "Les mots de passe ne correspondent pas.";
        messageDiv.style.color = 'red';
        return;
    }

    // Envoi de la requête POST via fetch
    fetch(host + 'getotp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            pwd: pwd
        })
    })
    .then(response => response.json())
    .then(data => {
        // Gérer la réponse de la requête ici
        if (data.message === 'OTP envoyé') {
            document.getElementById('signup-form').reset();
            messageDiv.textContent = "Veuillez vérifier vos courriers pour valider l'inscription.";
            messageDiv.style.color = 'green';
        } else {
            messageDiv.textContent = "Erreur : " + data.message;
            messageDiv.style.color = 'red';
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
        messageDiv.textContent = "Une erreur s'est produite. Veuillez réessayer.";
        messageDiv.style.color = 'red';
    });
});

function makeRequest() {
  let email = document.getElementById('email').value;
  let pwd = document.getElementById('pwd').value;

  fetch(host + 'userauth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email: email, pwd: pwd })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Erreur de réseau');
    }
    return response.json();
  })
  .then(data => {
    console.log(data);
    // Stocker les tokens si l'authentification est réussie
    if (data.accessToken) {
      console.log(data.accessToken);
      localStorage.setItem('sold', data.user.sold);
      localStorage.setItem('accessToken', data.accessToken);
      setCookie("refreshToken", data.refreshToken, 7);
      window.location.href = ownerDashboardURL; 
    } else {
      alert('Erreur de login');
    }
  })
  .catch(error => {
    console.error('Erreur:', error);
  });
}

document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault(); 
  makeRequest();
});