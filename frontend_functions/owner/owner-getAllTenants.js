

function setNumberOfTenants(numberOfTenants) {
  localStorage.setItem('numberOfTenants', numberOfTenants);
}

function getNumberOfTenants() {
  console.log("ca marche bien");
  if (localStorage.getItem('numberOfTenants') == 'undefined') return 0;
  return localStorage.getItem('numberOfTenants');
}

function showNumberOfTenants (){
  const totalTenants = document.getElementById('total-tenants');
  totalTenants.textContent = getNumberOfTenants();
}

function getAllTenantsRequest() {
  let token = localStorage.getItem('accessToken');

  console.log('je suis dans getAllTenantsRequest', token);
  fetch(host + 'all-tenants', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
  })
  .then(response => {
    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            return renewAccessToken().then(() => getAllTenantsRequest());
        }
        // Redirection en cas d'autres erreurs HTTP (par exemple 500)
        window.location.href = ownerError;
        throw new Error('HTTP error ' + response.status); // Lancer une erreur pour déclencher le .catch
    }
    return response.json();
})
  .then(data => {
    console.log("data received:", data); // Log les données reçues

    // Si les propriétés sont enveloppées dans un objet { myProperties }
    const allTenants = data;
    setNumberOfTenants(allTenants.length);
    showNumberOfTenants();
    
    const tableBody = document.getElementById("all-tenants-table");
    if (tableBody) {
      tableBody.innerHTML = ''; // Clear existing rows

      allTenants.forEach((tenant) => {
        console.log("Tenant data:", tenant); // Log chaque propriété
        addTenantToTable(tenant);
      });
      // allListeners();
      const toggleDropdowns = document.querySelectorAll('.toggle-dropdown');
      toggleDropdowns.forEach(toggle => {
        toggle.addEventListener('click', function() {
          const dropdown = this.closest('.dropdown');
          dropdown.classList.toggle('show'); // Afficher ou masquer le dropdown
        });
      });
      
      // Fermer le dropdown si on clique en dehors
      window.addEventListener('click', function(event) {
        if (!event.target.matches('.toggle-dropdown')) {
          const dropdowns = document.querySelectorAll('.dropdown');
          dropdowns.forEach(dropdown => {
            dropdown.classList.remove('show');
          });
        }
      });
      
      // Sélectionne la modale de modification et son contenu
      const editModal = document.getElementById('edit-modal');
      const editModalContent = editModal.querySelector('.modal-content');
      
      // Sélectionne la modale des messages et son contenu
      const messageModal = document.getElementById('message-modal');
      const messageModalContent = messageModal.querySelector('.modal-content');
      
      // Fermeture des modales
      const closeEditModal = editModal.querySelector('.close');
      
      // Quand l'utilisateur clique sur une icône de modification
      document.querySelectorAll('.edit-icon').forEach(icon => {
        icon.addEventListener('click', function() {
          const tenantId = this.dataset.id;
      
          // Remplir le formulaire avec les données du locataire ici (utilisez tenantId)
          editTenant(tenantId);
          editModal.style.display = 'block'; // Affiche la modale
          setTimeout(() => {
            editModal.classList.add('show');
            editModalContent.classList.add('show');
          }, 10); // Ajout du délai pour permettre la transition
        });
      });
      
      // Quand l'utilisateur clique sur une icône de discussions
      const chatIcons = document.querySelectorAll('.chat-icon');
      chatIcons.forEach(icon => {
        icon.addEventListener('click', function() {
          const tenantId = this.dataset.id;
          // Affiche la modale des messages pour le locataire correspondant
          const submitButton = document.querySelector('#message-form button[type="submit"]');
          // Ajoute une classe ou un attribut pour identifier qu'il s'agit d'une modification
          submitButton.dataset.tenantId = tenantId;
          messageModal.style.display = 'block';
          setTimeout(() => {
            messageModal.classList.add('show');
            messageModalContent.classList.add('show');
          }, 10); // Ajout du délai pour permettre la transition
          // Charger les messages ou autres données si nécessaire
          getMessagesRequest(tenantId);
          // alert("je suis la tenantID : " + tenantId);
          sendMessageRequest(tenantId);
          deleteMessageLogic(tenantId);
        });
      });
      
      // Quand l'utilisateur clique sur une icône de suppression
      document.querySelectorAll('.delete-icon').forEach(icon => {
        icon.addEventListener('click', function() {
          const tenantId = this.dataset.id;
          deleteTenant(tenantId);
        });
      });


      // Fermeture des modales lorsqu'on clique sur <span> (x)
      if (closeEditModal) {
        closeEditModal.onclick = function() {
          editModal.classList.remove('show');
          editModalContent.classList.remove('show');
          setTimeout(() => {
            editModal.style.display = 'none';
          }, 300); // Correspond à la durée de l'animation en CSS
        };
      }
      
      // Fermeture des modales lorsqu'on clique en dehors
      window.onclick = function(event) {
        if (event.target == editModal || event.target == messageModal) {
          if (event.target == editModal) {
            editModal.classList.remove('show');
            editModalContent.classList.remove('show');
            setTimeout(() => {
              editModal.style.display = 'none';
            }, 300); // Correspond à la durée de l'animation en CSS
          } else if (event.target == messageModal) {
            messageModal.classList.remove('show');
            messageModalContent.classList.remove('show');
            setTimeout(() => {
              messageModal.style.display = 'none';
              if (window.ws) {
                window.ws.close();  // Fermer la connexion WebSocket
                getRecentMessagesRequest();
                console.log('WebSocket connection closed');
            }
            }, 300); // Correspond à la durée de l'animation en CSS
          }
        }
      };
    } else {
      console.error("Element with ID 'tableBody' not found.");
    }
  })
  .catch((error) => {
    window.location.href = ownerError; 
    console.error('Error fetching tableBody:', error)});
  }
  
  function allListeners() {
  }
  
  // UPDATE tenant
  function editTenant(tenantId) {
    let token = localStorage.getItem('accessToken');
    fetch(host + "my-tenant", {  // Utilise l'ID pour récupérer les détails de locataire
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body : JSON.stringify({
        "id": tenantId,
      })
    })
    .then(response => {
      if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
              return renewAccessToken().then(() => editTenant(tenantId));
          }
          // Redirection en cas d'autres erreurs HTTP (par exemple 500)
          window.location.href = ownerError;
          throw new Error('HTTP error ' + response.status); // Lancer une erreur pour déclencher le .catch
      }
      return response.json();
  })
      .then(data => {
        console.log("Editing property:", data);
        
        // Remplir le formulaire avec les données actuelles de le locataire
        document.getElementById('edit-lastname').value = data.lastname;
        document.getElementById('edit-firstname').value = data.firstname;
        document.getElementById('edit-contact-moov').value = data.contactmoov;
        document.getElementById('edit-contact-tg').value = data.contacttg;
        // Vérifier si la date est valide
        let fullDate = new Date(data.create_time);
        // Extraire la date au format yyyy-MM-dd si la date est valide
        let formattedDate = fullDate.toISOString().split('T')[0];
        // Assigner la date formatée au champ de saisie (si nécessaire)
        document.getElementById('edit-date').value = formattedDate;
        const submitButton = document.querySelector('#edit-tenant-form button[type="submit"]');
        // Ajoute une classe ou un attribut pour identifier qu'il s'agit d'une modification
        submitButton.dataset.editingId = tenantId;
      })
      .catch(error => {
        window.location.href = ownerError; 
        console.error('Error fetching property details:', error)});
      }
      
      
      function updateTenant(editingId) {
        const updatedData = {
          id : editingId,
          lastname : document.getElementById('edit-lastname').value,
          firstname : document.getElementById('edit-firstname').value,
          contactmoov : document.getElementById('edit-contact-moov').value,
          contacttg : document.getElementById('edit-contact-tg').value,
          date : document.getElementById('edit-date').value,
        };
        let token = localStorage.getItem('accessToken');
        fetch(host + "update-tenant", {  // Utilise l'ID pour récupérer les détails de la propriété
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
                  return renewAccessToken().then(() => updateTenant(editingId));
              }
              // Redirection en cas d'autres erreurs HTTP (par exemple 500)
              window.location.href = ownerError;
              throw new Error('HTTP error ' + response.status); // Lancer une erreur pour déclencher le .catch
          }
          return response.json();
      })
    .then(data => {
    console.log('data updated : ' + JSON.stringify(data));
    console.log(data.lastname + ' ' + data.firstname + ' ' + data.contactmoov + ' ' + data.contacttg);
    const formattedDate = new Date(data.create_time).toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).replace(',', '').replace(/\//g, '-');
    // getAllTenantsRequest();  // Recharge les propriétés pour montrer les changements
    // addTenantToTable(tenant);
    // Mettre à jour directement la ligne correspondante
    const row = document.getElementById("all-tenants-table")
    .querySelector(`tr[data-id="${editingId}"]`);
    console.log("row : " + row);
    if (row) {
      row.children[0].textContent = data.lastname + ' ' + data.firstname;
      row.children[1].textContent = data.contactmoov + '/' + data.contacttg;
      row.children[3].textContent = formattedDate;
    }
    // allListeners();
    resetForm();
  })
  .catch(error => {
    window.location.href = ownerError;
    console.error('Error updating property:', error)});  
  }
  
  function resetForm() {
    const form = document.getElementById('edit-tenant-form')
    if (form) {
      const submitButton = document.querySelector('#edit-tenant-form button[type="submit"]');
      // Ajoute une classe ou un attribut pour identifier qu'il s'agit d'une modification
      delete submitButton.dataset.editingId;
      // Sélectionne la modale et son contenu
      const modal = document.getElementById('edit-modal');
      const modalContent = document.querySelector('.modal-content');
      modal.classList.remove('show');
      modalContent.classList.remove('show');
      setTimeout(() => {
        modal.style.display = 'none';
      }, 300);
    }
    
  }
  
  // Appelle cette fonction après une modification réussie
  
  
  function deleteTenant(tenantId) {
  let token = localStorage.getItem('accessToken');
  fetch(host + "delete-tenant", {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ "id": tenantId })
  })
  .then(response => {
    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            return renewAccessToken().then(() => deleteTenant(tenantId));
        }
        // Redirection en cas d'autres erreurs HTTP (par exemple 500)
        window.location.href = ownerError;
        throw new Error('HTTP error ' + response.status); // Lancer une erreur pour déclencher le .catch
    }
    return response.json();
})
    .then(() => {
      const row = document.getElementById("all-tenants-table")
      .querySelector(`tr[data-id="${tenantId}"]`);
      if (row) {
        row.remove(); // Supprime la ligne du tableau
      }
    })
    .catch(error => {
      window.location.href = ownerError; 
      console.error('Error deleting tenant:', error)});
  }
  
  