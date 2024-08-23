

function setpwdRequest(){

    let setPwdForm = document.getElementById('set-pwd-form');
    let pwd = document.getElementById('set-pwd').value;
    let pwd1 = document.getElementById('set-pwd1').value;

    const messageDiv = document.getElementById('set-pwd-message');

    if (messageDiv) {
      // Réinitialise le message
      messageDiv.textContent = '';
    }

    // Vérification si les mots de passe correspondent
    if (pwd !== pwd1) {
        messageDiv.textContent = "Les mots de passe ne correspondent pas.";
        messageDiv.style.color = 'red';
        return;
    }

    let token = localStorage.getItem('accessTokenTenant');

    fetch(hostTenant + '/set-pwd', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body : JSON.stringify({
        "pwd": pwd,
      })
    })
    .then(response => {
      if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
              return renewAccessToken().then(() => setpwdRequest());
          }
          // Redirection en cas d'autres erreurs HTTP (par exemple 500)
          window.location.href = ownerError;
          throw new Error('HTTP error ' + response.status); // Lancer une erreur pour déclencher le .catch
      }
      return response.json();
    })
    .then(data => {
      setPwdForm.reset();

      // Ferme la modale avec une animation douce
      const modal = document.getElementById('modal-set-pwd');
      const modalContent = modal.querySelector('.modal-content');
      
      // Enlever la classe "show" pour lancer l'animation de fermeture
      modalContent.classList.remove('show');
      modal.classList.remove('show');

      // Après la durée de la transition, cache complètement la modale
      setTimeout(() => {
        modal.classList.remove('visible'); 
        modal.classList.add('hidden'); // Cache la modale
      }, 300); // La durée de l'animation de transition (300ms)
      
      // Sauvegarder le fait que le mot de passe a été défini
      localStorage.setItem('setPwd', 1);
      
      // Appel à une autre fonction après la fermeture de la modale
      getUnvalidReceiptsRequest(); // Elle appelera à son tour getValidReceiptsRequest()
      })
    .catch(error => {
      window.location.href = tenantError;
      console.error('Erreur:', error);
    });
}