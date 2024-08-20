
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
        propertyOptionConstructor(properties);
      }
      
      
    })
    .catch((error) => console.error('Error fetching properties:', error));
  }


  function  propertyOptionConstructor(properties){
    const propertyOption = document.getElementById("property-option");
    if (propertyOption) {
    propertyOption.innerHTML = ''; // Clear existing rows

    properties.forEach((property) => {
        console.log("Property data:", property); // Log chaque propriété
        const option = document.createElement('option');

        option.value = property.id;
        option.textContent = `${property.address} ${property.price}`;
        
        propertyOption.insertBefore(option, propertyOption.firstChild);

        // Sélectionner le premier élément, qui est le dernier ajouté
        if (propertyOption.firstChild) {
          propertyOption.firstChild.selected = true;
        }
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
          addPropertyToTable(property);
        });
        // Ajouter les écouteurs d'événements pour les nouvelles icônes
        addDropdownListeners();
        addEditListeners();

        // Quand l'utilisateur clique sur une icône de suppression
        document.querySelectorAll('.delete-icon').forEach(icon => {
          icon.addEventListener('click', function() {
            const propertyId = this.dataset.id;
            deleteProperty(propertyId);
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
    // getPropertiesRequest(1); // Recharge les propriétés pour montrer les changements
    // Mettre à jour directement la ligne correspondante
    const row = document.querySelector(`tr[data-id="${editingId}"]`);
    if (row) {
        row.children[0].textContent = data.address;
        row.children[1].textContent = data.description;
        row.children[2].textContent = data.price;
    }
    resetPropertyForm();
      
  })
  .catch(error => console.error('Error updating property:', error));  
}


// Appelle cette fonction après une modification réussie


function deleteProperty(propertyId) {
  let token = localStorage.getItem('accessToken');
  fetch(host + "delete-property", {
      method: 'POST',
      headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "id": propertyId })
  })
  .then(response => response.json())
  .then(() => {
      const row = document.getElementById("my-properties-table")
        .querySelector(`tr[data-id="${propertyId}"]`);
      if (row) {
          row.remove(); // Supprime la ligne du tableau
      }
  })
  .catch(error => console.error('Error deleting property:', error));
}