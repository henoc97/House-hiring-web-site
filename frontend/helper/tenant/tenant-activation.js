

document.addEventListener("DOMContentLoaded", function() {
    const url = hostTenant + 'activate-tenant-account';
    const params = new URLSearchParams(window.location.search);
    const key = params.get('key');
    const prTenId = params.get('pr_ten');
    
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ key, prTenId })
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(errorData => {
          throw new Error(errorData.message || 'Erreur inconnue');
        });
      }
      return response.json();
    })
    .then(data => {
      console.log("data: " + JSON.stringify(data));
      if (data.accessToken) {
        console.log(data.accessToken);
        localStorage.setItem('accessTokenTenant', data.accessToken);
        setCookie("refreshTokenTenant", data.refreshToken, 7);
        localStorage.setItem('setPwd', 0);
        localStorage.setItem('userName', data.userName + data.count);
        localStorage.setItem('createTime', data.createTime);
        window.location.href = tenantDashboardURL;
      } else {
        alert('Erreur de login');
      }
    })
    .catch(error => {
      console.error('Error:', error);  // Affiche l'erreur complète dans la console
      alert('Erreur lors de la création du compte : lien invalide'); // Affiche un message d'erreur plus descriptif
    });
  });