
function makeRequest() {
  let userName = document.getElementById('user-name-field').value;
  let pwd = document.getElementById('pwd').value;
  const messageDiv = document.getElementById('message');


  fetch(hostTenant + 'auth-tenant-account', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userName: userName, pwd: pwd })
  })
  .then(response => {
    if (!response.ok) {
      if (response.status === 401) {
        alert('Accès interdit. Vérifiez vos informations de connexion.');
      } else if (response.status === 404) {
        messageDiv.textContent = "Mot de passe ou nom d'utilisateur incorrect.";
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
      localStorage.setItem('accessTokenTenant', data.accessToken);
      setCookie("refreshTokenTenant", data.refreshToken, 7);
      window.location.href = tenantDashboardURL; 
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

const passLink = document.querySelector("form .pass-link a");
passLink.onclick = () => {
  window.location.href = tenantResetPwdURL
};