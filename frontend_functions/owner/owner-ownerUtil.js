
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
    .then(response => response.json())
    .then(data => {
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
    .catch(error => console.error('Error fetching owner details:', error));
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
  .then(response => response.json())
  .then(data => {
      alert("Modification réussie...")
      // getPropertiesRequest(1); // Recharge les propriétés pour montrer les changements
      // resetForm();
      
  })
  .catch(error => console.error('Error updating Owner:', error));  
}