
function setNumberOfProperties(numberOfProperties) {
  localStorage.setItem('numberOfProperties', numberOfProperties);
}

function getNumberOfProperties() {
  console.log("ca marche bien");
  if (localStorage.getItem('numberOfProperties') == 'undefined') return 0;
  return localStorage.getItem('numberOfProperties');
}

function showNumberOfProperties() {
  const totalProperties = document.getElementById('total-properties');
  totalProperties.textContent = getNumberOfProperties();
}


function getPropertiesRequest(type) {
    let token = localStorage.getItem('accessToken');
    fetch(host + 'my-properties', {
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
      const properties = data.myProperties || data;

      setNumberOfProperties(properties.length);

      showNumberOfProperties();

      setPrpertiesList(properties);

      if (type == 1) {
        myPropertiesTableConstructor(properties);
      } else {
        propertyoptionConstructor(properties);
      }
      
      
    })
    .catch((error) => console.error('Error fetching properties:', error));
  }


  function  propertyoptionConstructor(properties){
    const propertyoption = document.getElementById("property-option");
    if (propertyoption) {
    propertyoption.innerHTML = ''; // Clear existing rows

    properties.forEach((property) => {
        console.log("Property data:", property); // Log chaque propriété
        const option = document.createElement('option');

        option.value = property.id;
        option.textContent = `${property.address} ${property.price}`;
        
        propertyoption.appendChild(option);
    });
    } else {
    console.error("Element with ID 'myPropertiesTable' not found.");
    }
  }
  

function myPropertiesTableConstructor(properties){
  console.log("ca marche bien dans getPropertiesRequest");
    const tableBody = document.getElementById("my-properties-table");
      if (tableBody) {
        tableBody.innerHTML = ''; // Clear existing rows

        properties.forEach((property) => {
          console.log("Property data:", property); // Log chaque propriété
          const row = document.createElement('tr');
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
          tableBody.appendChild(row);
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

        // Ajoute un écouteur d'événements pour chaque icône de modification
        document.querySelectorAll('.edit-icon').forEach(icon => {
          icon.addEventListener('click', function() {
              const propertyId = this.dataset.id;
              editProperty(propertyId);
          });
      });
      } else {
        console.error("Element with ID 'myPropertiesTable' not found.");
      }
}

// UPDATE properties
function editProperty(propertyId) {
  let token = localStorage.getItem('accessToken');
  fetch(host + "my-property", {  // Utilise l'ID pour récupérer les détails de la propriété
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body : JSON.stringify({
        "id": propertyId,
      })
  })
  .then(response => response.json())
  .then(data => {
      console.log("Editing property:", data);

      // Remplir le formulaire avec les données actuelles de la propriété
      document.getElementById('property-address').value = data.address;
      document.getElementById('property-description').value = data.descriptions;
      document.getElementById('property-cost').value = data.price;

      // Change le texte du bouton pour indiquer qu'il s'agit d'une modification
      const submitButton = document.querySelector('#property-form button[type="submit"]');
      const actionIndicator = document.querySelector('#action-indicator');
      submitButton.textContent = 'Modifier';
      actionIndicator.textContent = "Modifier une propriété"

      // Ajoute une classe ou un attribut pour identifier qu'il s'agit d'une modification
      submitButton.dataset.editingId = propertyId;
  })
  .catch(error => console.error('Error fetching property details:', error));
}


function resetPropertyForm() {
  const form = document.getElementById('property-form')
  if (form) {
    form.reset();
    const submitButton = document.querySelector('#property-form button[type="submit"]');
    submitButton.textContent = 'Enregistrer';
    const actionIndicator = document.querySelector('#action-indicator');
    actionIndicator.textContent = "Enregistrer une propriété"
    delete submitButton.dataset.editingId;
  }
}

function updateProperty(editingId) {
  const updatedData = {
      id : editingId,
      address: document.getElementById('property-address').value,
      description: document.getElementById('property-description').value,
      cost: document.getElementById('property-cost').value
  };
  let token = localStorage.getItem('accessToken');
  fetch(host + "update-property", {  // Utilise l'ID pour récupérer les détails de la propriété
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body : JSON.stringify(updatedData)
  })
  .then(response => response.json())
  .then(data => {
    // alert('ca marche quand meme')
    getPropertiesRequest(1); // Recharge les propriétés pour montrer les changements
    resetPropertyForm();
      
  })
  .catch(error => console.error('Error updating property:', error));  
}


// Appelle cette fonction après une modification réussie
