

function setNumberOfTenantsProperties(numberOfTenantsProperties) {
  localStorage.setItem('numberOfTenantsProperties', numberOfTenantsProperties);
}

function getNumberOfTenantsProperties() {
  console.log("ca marche bien");
  if (localStorage.getItem('numberOfTenantsProperties') == 'undefined') return 0;
  return localStorage.getItem('numberOfTenantsProperties');
}

function showNumberOfTenantsProperties(){
  const totalTenantsProperties = document.getElementById('totalTenantsProperties');
  totalTenantsProperties.textContent = getNumberOfTenantsProperties();
}




function getTenantsPropertiesRequest(type) {
    let token = localStorage.getItem('accessToken');
    fetch(host + 'TenantsProperties', {
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
    
    const tableBody = document.getElementById("tenantspropertiesTable");
      if (tableBody) {
        tableBody.innerHTML = ''; // Clear existing rows

        tenantsproperties.forEach((tenantproperty) => {
          console.log("tenantsproperties data:", tenantproperty); // Log chaque propriété
          // Génération du lien d'activation
          const activationLink = activateURL + `?key=${tenantproperty.conn_key}&pr_ten=${tenantproperty.id}`;

          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${tenantproperty.lastname} ${tenantproperty.firstname}</td>
            <td>${tenantproperty.contactmoov} / ${tenantproperty.contacttg}</td>
            <td>${tenantproperty.address}</td>
            <td>${tenantproperty.price}</td>
            ${tenantproperty.is_activated ? 
              `<td>--</td>` : 
              `<td><i class='bx bx-copy' style="cursor: pointer;" title="Copier le lien d'activation"></i></td>`
            }
          `;
          tableBody.appendChild(row);
          // Ajouter un événement de clic pour copier le lien dans le presse-papiers
          const copyIcon = row.querySelector('.bx-copy');
          if (copyIcon) {
            copyIcon.addEventListener('click', () => {
              navigator.clipboard.writeText("Lien à usage unique : " + activationLink).then(() => {
                  alert('Lien d\'activation copié dans le presse-papiers !');
              }).catch(err => {
                  console.error('Échec de la copie du lien : ', err);
              });
           });
          }
        });
      } else {
        console.error("Element with ID 'tenantspropertiesTable' not found.");
      }

  }
  
  function  tenantsPropertiesoptionConstructor(tenantsproperties){
    const tenantsPropertiesoption = document.getElementById("tenantsProperties-option");
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
  