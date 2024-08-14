
function getTenantPropertyRequest(type) {
    let token = localStorage.getItem('accessTokenTenant');
    fetch(hostTenant + 'tenantProperty', {
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
      const tenantproperty = data;

      if (type == 1) {
        tenantPropertytableConstructor(tenantproperty)
      } else {
        tenantPropertyoptionConstructor(tenantproperty)
      }
      
    })
    .catch((error) => console.error('Error fetching tenantproperty:', error));
  }



  function  tenantPropertytableConstructor(tenantproperty){
    
    const tableBody = document.getElementById("tenantpropertyTable");
      // if (tableBody) {
      //   tableBody.innerHTML = ''; // Clear existing rows

      //   tenantproperty.forEach((tenantproperty) => {
      //     console.log("tenantproperty data:", tenantproperty); // Log chaque propriété
      //     // Génération du lien d'activation
      //     const activationLink = activateURL + `?key=${tenantproperty.conn_key}&pr_ten=${tenantproperty.id}`;

      //     const row = document.createElement('tr');
      //     row.innerHTML = `
      //       <td>${tenantproperty.lastname} ${tenantproperty.firstname}</td>
      //       <td>${tenantproperty.contactmoov} / ${tenantproperty.contacttg}</td>
      //       <td>${tenantproperty.address}</td>
      //       <td>${tenantproperty.price}</td>
      //       ${tenantproperty.is_activated ? 
      //         `<td>--</td>` : 
      //         `<td><i class='bx bx-copy' style="cursor: pointer;" title="Copier le lien d'activation"></i></td>`
      //       }
      //     `;
      //     tableBody.appendChild(row);
      //     // Ajouter un événement de clic pour copier le lien dans le presse-papiers
      //     const copyIcon = row.querySelector('.bx-copy');
      //     if (copyIcon) {
      //       copyIcon.addEventListener('click', () => {
      //         navigator.clipboard.writeText("Lien à usage unique : " + activationLink).then(() => {
      //             alert('Lien d\'activation copié dans le presse-papiers !');
      //         }).catch(err => {
      //             console.error('Échec de la copie du lien : ', err);
      //         });
      //      });
      //     }
      //   });
      // } else {
      //   console.error("Element with ID 'tenantpropertyTable' not found.");
      // }

  }
  
  function  tenantPropertyoptionConstructor(tenantproperty){
    const tenantPropertyoption = document.getElementById("tenantProperty-option");
    if (tenantPropertyoption) {
      tenantPropertyoption.innerHTML = ''; // Clear existing rows
      
      if (tenantPropertyoption.innerHTML=='') {
        console.log("yes");
      }
      tenantproperty.forEach((tenantproperty) => {
        console.log("Property data:", tenantproperty); // Log chaque propriété
        const option = document.createElement('option');

        option.value = tenantproperty.id;
        option.dataset.price = tenantproperty.price; 
        option.textContent = `${tenantproperty.lastname} ${tenantproperty.firstname.split(' ')[0]} ${tenantproperty.address} ${tenantproperty.price}`;
        
        tenantPropertyoption.appendChild(option);
    });
    } else {
    console.error("Element with ID 'tenantProperty-option' not found.");
    }
  }
  