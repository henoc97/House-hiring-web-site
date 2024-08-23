

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
    .then(response => {
      if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
              return renewAccessToken().then(() => getTenantsPropertiesRequest(type));
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
      const tenantsproperties = data;
      setNumberOfTenantsProperties(tenantsproperties.length)
      showNumberOfTenantsProperties();

      if (type == 1) {
        tenantsPropertiestableConstructor(tenantsproperties)
      } else {
        tenantsPropertiesOptionConstructor(tenantsproperties)
      }
      
    })
    .catch((error) => {
      window.location.href = ownerError;
      console.error('Error fetching tenantsproperties:', error)});
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
  
  function  tenantsPropertiesOptionConstructor(tenantsproperties){
    const tenantsPropertiesOption = document.getElementById("tenants-properties-option");
    if (tenantsPropertiesOption) {
      tenantsPropertiesOption.innerHTML = ''; // Clear existing rows
      
      if (tenantsPropertiesOption.innerHTML=='') {
        console.log("yes");
      }
      tenantsproperties.forEach((tenantproperty) => {
        console.log("Property data:", tenantproperty); // Log chaque propriété
        const option = document.createElement('option');

        option.value = tenantproperty.id;
        option.dataset.price = tenantproperty.price; 
        option.textContent = `${tenantproperty.lastname} ${tenantproperty.firstname.split(' ')[0]} ${tenantproperty.address} ${tenantproperty.price}`;
        
        tenantsPropertiesOption.insertBefore(option, tenantsPropertiesOption.firstChild);
        // Sélectionner le premier élément, qui est le dernier ajouté
        if (tenantsPropertiesOption.firstChild) {
          tenantsPropertiesOption.firstChild.selected = true;
        }
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
  .then(response => {
    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            return renewAccessToken().then(() =>  deleteTenantProperty(tenantPropertyId));
        }
        // Redirection en cas d'autres erreurs HTTP (par exemple 500)
        window.location.href = ownerError;
        throw new Error('HTTP error ' + response.status); // Lancer une erreur pour déclencher le .catch
    }
    return response.json();
})
  .then(() => {
      const row = document.querySelector(`tr[data-id="${tenantPropertyId}"]`);
      if (row) {
          row.remove(); // Supprime la ligne du tableau
      }
  })
  .catch(error => {
    window.location.href = ownerError;
    console.error('Error deleting property:', error)});
}