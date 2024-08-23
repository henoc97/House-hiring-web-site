
// Récupérer le owner
function getOwner() {
    let token = localStorage.getItem('accessToken');
    fetch(host + "my-owner", {  // Utilise l'ID pour récupérer les détails de la owner
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
    })
    .then(response => {
      if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
              return renewAccessToken().then(() => getOwner());
          }
          // Redirection en cas d'autres erreurs HTTP (par exemple 500)
          window.location.href = ownerError;
          throw new Error('HTTP error ' + response.status); // Lancer une erreur pour déclencher le .catch
      }
      return response.json();
  })
    .then(data => {
        if (!data) return; // Si data est undefined (en cas de redirection), arrêter l'exécution
        console.log("owner:", data);

        if (data.lastname == null || 
          data.contactmoov == null || 
          data.contacttg == null) {
          document.querySelector('#action-indicator')
            .textContent = 'Complèter les informations'; 
        }
        // Remplir le formulaire avec les données actuelles de owner
        document.getElementById('owner-lastname').value = data.lastname;
        document.getElementById('owner-firstname').value = data.firstname;
        document.getElementById('owner-email').value = data.email;
        document.getElementById('owner-contact-moov').value = data.contactmoov;
        document.getElementById('owner-contact-tg').value = data.contacttg;
        
        setSold(data.sold);
        showNewSold();
    })
    .catch(error => {
      window.location.href = ownerError;
      console.error('Error fetching owner details:', error)});
  }
  
  
function updateOwner() {
  const updatedData = {
    lastname : document.getElementById('owner-lastname').value,
    firstname : document.getElementById('owner-firstname').value,
    email : document.getElementById('owner-email').value,
    contactmoov : document.getElementById('owner-contact-moov').value,
    contacttg : document.getElementById('owner-contact-tg').value,
    
  };
  let token = localStorage.getItem('accessToken');
  fetch(host + "update-owner", {  // Utilise l'ID pour récupérer les détails de owner
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body : JSON.stringify(updatedData)
  })
  .then(response => {
    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            return renewAccessToken().then(() => updateOwner());
        }
        // Redirection en cas d'autres erreurs HTTP (par exemple 500)
        window.location.href = ownerError;
        throw new Error('HTTP error ' + response.status); // Lancer une erreur pour déclencher le .catch
    }
    return response.json();
})
  .then(data => {
      alert("Modification réussie...")
      // getPropertiesRequest(1); // Recharge les propriétés pour montrer les changements
      // resetForm();
      
  })
  .catch(error => {
    window.location.href = ownerError;
    console.error('Error updating Owner:', error)});  
}