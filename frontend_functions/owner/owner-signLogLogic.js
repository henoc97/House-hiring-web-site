


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
        messageDiv.classList.remove('green-message');
        messageDiv.classList.add('red-message');
        return;
    }

    // Envoi de la requête POST via fetch
    fetch(host + 'get-otp', {
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

function makeRequest() {
  let email = document.getElementById('email').value;
  let pwd = document.getElementById('pwd').value;

  fetch(host + 'user-auth', {
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