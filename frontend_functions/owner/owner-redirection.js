

document.addEventListener("DOMContentLoaded", function() {
    const url = host + 'create-user-owner';
    const params = new URLSearchParams(window.location.search);
    const email = params.get('email');
    const pwd = params.get('pwd');
    const otp = params.get('otp');

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, pwd, otp })
    })
    .then(async response => {
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur inconnue');
      }
      return response.json();
    })
    .then(data => {
      console.log("data: " + JSON.stringify(data));
      if (data.accessToken) {
        console.log(data.accessToken);
        localStorage.setItem('sold', data.sold);
        localStorage.setItem('accessToken', data.accessToken);
        setCookie("refreshToken", data.refreshToken, 7);
        window.location.href = ownerDashboardURL;
      } else {
        alert('Erreur de login');
      }
    })
    .catch(error => {
      console.error('Error:', error);  // Affiche l'erreur complète dans la console
      alert('Erreur lors de la création du compte : ' + error.message); // Affiche un message d'erreur plus descriptif
    });
  });