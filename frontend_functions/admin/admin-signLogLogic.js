
function makeRequest() {
  let email = document.getElementById('email').value;
  let pwd = document.getElementById('pwd').value;
  const messageDiv = document.getElementById('message');


  fetch(hostAdmin + 'admin-auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email: email, pwd: pwd })
  })
  .then(response => {
    if (!response.ok) {
      if (response.status === 401) {
        alert('Accès interdit. Vérifiez vos informations de connexion.');
      } else if (response.status === 404) {
        messageDiv.textContent = "Mot de passe ou email incorrect.";
        messageDiv.classList.add('red-message');
        messageDiv.classList.remove('green-message');
      } else {
        alert('Le serveur est temporairement indisponible. Veuillez réessayer plus tard.');
      }
      throw new Error(`Erreur de réseau: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log(data);
    // Stocker les tokens si l'authentification est réussie
    if (data.accessToken) {
      console.log(data.accessToken);
      localStorage.setItem('accessTokenAdmin', data.accessToken);
      setCookie("refreshTokenAdmin", data.refreshToken, 7);
      window.location.href = adminDashboardURL; 
    } else {
      alert('Erreur de login. Veuillez vérifier vos informations.');
    }
  })
  .catch(error => {
    console.error('Erreur:', error);
   //  alert('Une erreur est survenue. Veuillez réessayer.');
  });
}

document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault(); 
  makeRequest();
});
