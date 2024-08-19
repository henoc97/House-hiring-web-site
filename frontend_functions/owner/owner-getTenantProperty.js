

function setNumberOfTenantsProperties(numberOfTenantsProperties) {
  localStorage.setItem('numberOfTenantsProperties', numberOfTenantsProperties);
}

function getNumberOfTenantsProperties() {
  console.log("ca marche bien");
  if (localStorage.getItem('numberOfTenantsProperties') == 'undefined') return 0;
  return localStorage.getItem('numberOfTenantsProperties');
}

function showNumberOfTenantsProperties(){
  const totalTenantsProperties = document.getElementById('total-tenants-properties');
  totalTenantsProperties.textContent = getNumberOfTenantsProperties();
}




function getTenantsPropertiesRequest(type) {
    let token = localStorage.getItem('accessToken');
    fetch(host + 'Tenants-properties', {
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
      const tenantsproperties = data;
      setNumberOfTenantsProperties(tenantsproperties.length)
      showNumberOfTenantsProperties();

      if (type == 1) {
        tenantsPropertiestableConstructor(tenantsproperties)
      } else {
        tenantsPropertiesoptionConstructor(tenantsproperties)
      }
      
    })
    .catch((error) => console.error('Error fetching tenantsproperties:', error));
  }



  function  tenantsPropertiestableConstructor(tenantsproperties){
    
    const tableBody = document.getElementById("tenants-properties-table");
      if (tableBody) {
        tableBody.innerHTML = ''; // Clear existing rows

        tenantsproperties.forEach((tenantproperty) => {
          console.log("tenantsproperties data:", tenantproperty); // Log chaque propriété
          addtenantsPropertiestable(tenantproperty)
        });
        addDropdownListeners();
        // Quand l'utilisateur clique sur une icône de suppression
        document.querySelectorAll('.delete-icon').forEach(icon => {
          icon.addEventListener('click', function() {
            const tenantPropertyId = this.dataset.id;
            deleteTenantProperty(tenantPropertyId);
          });
        });
      } else {
        console.error("Element with ID 'tenantspropertiesTable' not found.");
      }

  }
  
  function  tenantsPropertiesoptionConstructor(tenantsproperties){
    const tenantsPropertiesoption = document.getElementById("tenants-properties-option");
    if (tenantsPropertiesoption) {
      tenantsPropertiesoption.innerHTML = ''; // Clear existing rows
      
      if (tenantsPropertiesoption.innerHTML=='') {
        console.log("yes");
      }
      tenantsproperties.forEach((tenantproperty) => {
        console.log("Property data:", tenantproperty); // Log chaque propriété
        const option = document.createElement('option');

        option.value = tenantproperty.id;
        option.dataset.price = tenantproperty.price; 
        option.textContent = `${tenantproperty.lastname} ${tenantproperty.firstname.split(' ')[0]} ${tenantproperty.address} ${tenantproperty.price}`;
        
        tenantsPropertiesoption.appendChild(option);
    });
    } else {
    console.error("Element with ID 'tenantsProperties-option' not found.");
    }
  }
  

  
function deleteTenantProperty(tenantPropertyId) {
  let token = localStorage.getItem('accessToken');
  fetch(host + "delete-tenant-property", {
      method: 'POST',
      headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "id": tenantPropertyId })
  })
  .then(response => response.json())
  .then(() => {
      const row = document.querySelector(`tr[data-id="${tenantPropertyId}"]`);
      if (row) {
          row.remove(); // Supprime la ligne du tableau
      }
  })
  .catch(error => console.error('Error deleting property:', error));
}