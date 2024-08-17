




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

    fetch(hostTenant + '/setpwd', {
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
        if (!response.ok && (response.status === 401 || response.status === 403)) {
            alert("problem")
            return renewAccessToken().then(() => setpwdRequest());
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
        modal.style.display = 'none';
      }, 300); // La durée de l'animation de transition (300ms)
      
      // Sauvegarder le fait que le mot de passe a été défini
      localStorage.setItem('setPwd', 1);
      
      // Appel à une autre fonction après la fermeture de la modale
      getUnvalidReceiptsRequest(); // Elle appelera à son tour getValidReceiptsRequest()
      })
    .catch(error => {
        console.error('Erreur:', error);
        // window.location.href = ownerLogSignURL;
    });
}