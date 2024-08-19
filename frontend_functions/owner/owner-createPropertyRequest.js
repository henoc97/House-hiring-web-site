
function addPropertyToTable(property) {
  const tableBody = document.getElementById("my-properties-table");

  const row = document.createElement('tr');
  row.dataset.id = property.id;
  row.innerHTML = `
      <td>${property.address}</td>
      <td>${property.description}</td>
      <td>${property.price}</td>
      <td>
          <div class="dropdown">
              <i class='bx bx-dots-vertical-rounded toggle-dropdown'></i>
              <div class="dropdown-content">
                  <i class='bx bx-edit-alt edit-icon' data-id="${property.id}"></i>
                  <i class='bx bx-trash delete-icon' data-id="${property.id}"></i>
              </div>
          </div>
      </td>
  `;
  tableBody.insertBefore(row, tableBody.firstChild); // Ajoute la ligne au début du tableau

}

function addDropdownListeners() {
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
}

function addEditListeners() {
  // Ajoute un écouteur d'événements pour chaque icône de modification
  document.querySelectorAll('.edit-icon').forEach(icon => {
    icon.addEventListener('click', function() {
        const propertyId = this.dataset.id;
        editProperty(propertyId);
    });
  });
}

function createPropertyRequest(){

  if((getsold() - registerHomePrice) > 0){
    let address = document.getElementById('property-address').value;
    let description = document.getElementById('property-description').value;
    let cost = document.getElementById('property-cost').value;

    let token = localStorage.getItem('accessToken');

    fetch(host + 'create-properties', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body : JSON.stringify({
        "address": address,
        "description": description,
        "cost": cost
      })
    })
    .then(response => {
        if (!response.ok && (response.status === 401 || response.status === 403)) {
            alert("problem")
            return renewAccessToken().then(() => createPropertyRequest());
        }
        return response.json();
    })
    .then(data => {
        updateSoldRequest(registerHomePrice);
        console.log(data);
        document.getElementById('property-form').reset();
        // getPropertiesRequest(1);
        addPropertyToTable(data); // Ajoute la nouvelle propriété au tableau sans tout recharger
        showNewSold();
        // Ajouter les écouteurs d'événements pour les nouvelles icônes
        addDropdownListeners();
        addEditListeners();
    })
    .catch(error => {
        console.error('Erreur:', error);
        // window.location.href = ownerLogSignURL;
    });
  } else {
    alert('solde insuffisant. Cette opération coute 0.5€')
  }  
}