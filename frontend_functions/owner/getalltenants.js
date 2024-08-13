



function setNumberOfTenants(numberOfTenants) {
  localStorage.setItem('numberOfTenants', numberOfTenants);
}

function getNumberOfTenants() {
  console.log("ca marche bien");
  if (localStorage.getItem('numberOfTenants') == 'undefined') return 0;
  return localStorage.getItem('numberOfTenants');
}

function showNumberOfTenants (){
  const totalTenants = document.getElementById('totalTenants');
  totalTenants.textContent = getNumberOfTenants();
}

function getAllTenantsRequest() {
  let token = localStorage.getItem('accessToken');

  console.log('je suis dans getAllTenantsRequest', token);
  fetch(host + 'allTenants', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
  })
  .then(response => response.json())
  .then(data => {
    console.log("data received:", data); // Log les données reçues

    // Si les propriétés sont enveloppées dans un objet { myProperties }
    const allTenants = data;
    setNumberOfTenants(allTenants.length);
    showNumberOfTenants();
    
    const tableBody = document.getElementById("alltenantsTable");
    if (tableBody) {
      tableBody.innerHTML = ''; // Clear existing rows

      allTenants.forEach((tenant) => {
        console.log("Tenant data:", tenant); // Log chaque propriété
        const formattedDate = new Date(tenant.create_time).toLocaleString('fr-FR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        }).replace(',', '').replace(/\//g, '-');
        
        var late = tenant.unpaid_months ?? '';
        // Fonction pour reformater les dates
        function formatMonthYear(dateStr) {
          const [year, month] = dateStr.split('-');
          return `${month}-${year}`;
        }

        // Reformater les mois impayés
        const formattedLate = late.split(',').map(formatMonthYear).join(', ');

        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${tenant.lastname} ${tenant.firstname}</td>
          <td>${tenant.contactmoov} / ${tenant.contacttg}</td>
          <td>
            <span class="late-count">${late == '' ? 0 : late.split(",").length}</span>
            <div class="late-months" style="display: none;">
              ${formattedLate}
            </div>
          </td>
          <td>${formattedDate}</td>
          <td>
              <div class="dropdown">
                <i class='bx bx-dots-vertical-rounded toggle-dropdown'></i>
                <div class="dropdown-content">
                  <i class='bx bx-edit-alt edit-icon' data-id="${tenant.id}"></i>
                  <i class='bx bx-trash delete-icon' data-id="${tenant.id}"></i>
                </div>
              </div>
          </td>
        `;
        tableBody.appendChild(row);

        // Ajouter les événements de survol
        row.addEventListener('mouseover', function() {
          const lateCount = row.querySelector('.late-count');
          const lateMonths = row.querySelector('.late-months');
          if (lateCount.textContent != 0) {
            lateMonths.style.display = 'block';
          }
        });

        row.addEventListener('mouseout', function() {
          const lateMonths = row.querySelector('.late-months');
          lateMonths.style.display = 'none';
        });
      });

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

          // Sélectionne la modale et son contenu
          const modal = document.getElementById('editModal');
          const modalContent = document.querySelector('.modal-content');
          const closeModal = document.querySelector('.modal .close');

          // Quand l'utilisateur clique sur une icône de modification
          document.querySelectorAll('.edit-icon').forEach(icon => {
            icon.addEventListener('click', function() {
              const tenantId = this.dataset.id;
              
              // Remplir le formulaire avec les données du locataire ici (utilisez tenantId)
              editTenant(tenantId);
              modal.style.display = 'block'; // Affiche la modale
              setTimeout(() => {
                modal.classList.add('show');
                modalContent.classList.add('show');
              }, 10); // Ajout du délai pour permettre la transition
            });
          });

          // Quand l'utilisateur clique sur <span> (x), ferme la modale
          if (closeModal) {
              closeModal.onclick = function() {
              modal.classList.remove('show');
              modalContent.classList.remove('show');
              setTimeout(() => {
                  modal.style.display = 'none';
              }, 300); // Correspond à la durée de l'animation en CSS
              }
          }


          // Quand l'utilisateur clique n'importe où en dehors de la modale, la fermer
          window.onclick = function(event) {
            if (event.target == modal) {
              modal.classList.remove('show');
              modalContent.classList.remove('show');
              setTimeout(() => {
                modal.style.display = 'none';
              }, 300); // Correspond à la durée de l'animation en CSS
            }
          }

    } else {
      console.error("Element with ID 'tableBody' not found.");
    }
  })
  .catch((error) => console.error('Error fetching tableBody:', error));
}

// UPDATE tenant
function editTenant(tenantId) {
  let token = localStorage.getItem('accessToken');
  fetch(host + "myTenant", {  // Utilise l'ID pour récupérer les détails de locataire
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body : JSON.stringify({
        "id": tenantId,
      })
  })
  .then(response => response.json())
  .then(data => {
      console.log("Editing property:", data);

      // Remplir le formulaire avec les données actuelles de le locataire
      document.getElementById('edit-lastname').value = data.lastname;
      document.getElementById('edit-firstname').value = data.firstname;
      document.getElementById('edit-contactmoov').value = data.contactmoov;
      document.getElementById('edit-contacttg').value = data.contacttg;
      
      const submitButton = document.querySelector('#edit-tenant-form button[type="submit"]');
      // Ajoute une classe ou un attribut pour identifier qu'il s'agit d'une modification
      submitButton.dataset.editingId = tenantId;
  })
  .catch(error => console.error('Error fetching property details:', error));
}


function updateTenant(editingId) {
  const updatedData = {
      id : editingId,
      lastname : document.getElementById('edit-lastname').value,
      firstname : document.getElementById('edit-firstname').value,
      contactmoov : document.getElementById('edit-contactmoov').value,
      contacttg : document.getElementById('edit-contacttg').value,
      date : document.getElementById('edit-date').value,
  };
  let token = localStorage.getItem('accessToken');
  fetch(host + "updateTenant", {  // Utilise l'ID pour récupérer les détails de la propriété
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body : JSON.stringify(updatedData)
  })
  .then(response => response.json())
  .then(data => {
    getAllTenantsRequest();  // Recharge les propriétés pour montrer les changements
    resetForm();
  })
  .catch(error => console.error('Error updating property:', error));  
}

function resetForm() {
  const form = document.getElementById('edit-tenant-form')
  if (form) {
    const submitButton = document.querySelector('#edit-tenant-form button[type="submit"]');
    // Ajoute une classe ou un attribut pour identifier qu'il s'agit d'une modification
    delete submitButton.dataset.editingId;
    // Sélectionne la modale et son contenu
    const modal = document.getElementById('editModal');
    const modalContent = document.querySelector('.modal-content');
    modal.classList.remove('show');
    modalContent.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
  }
  
}

// Appelle cette fonction après une modification réussie
