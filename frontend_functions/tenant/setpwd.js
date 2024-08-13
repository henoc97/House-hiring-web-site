




function setpwdRequest(){

    let pwd = document.getElementById('set-pwd').value;
    let pwd1 = document.getElementById('set-pwd1').value;

    const messageDiv = document.getElementById('message');

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

    let token = localStorage.getItem('accessToken');

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


      const modal = document.getElementById('set-pwd');
      const modalContent = document.querySelector('.modal-content');
      
      modal.classList.remove('show');
      modalContent.classList.remove('show');
      setTimeout(() => {
          modal.style.display = 'none';
      }, 300);

      localStorage.setItem('setPwd', 1);
      getValidReceiptsRequest();
      })
    .catch(error => {
        console.error('Erreur:', error);
        // window.location.href = ownerLogSignURL;
    });
}