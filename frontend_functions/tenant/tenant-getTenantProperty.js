
function getTenantPropertyRequest(type) {
    let token = localStorage.getItem('accessTokenTenant');
    fetch(hostTenant + 'tenant-property', {
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
        tenantPropertyProfile(tenantproperty)
      } else {
        tenantPropertyOptionConstructor(tenantproperty)
      }
      
    })
    .catch((error) => console.error('Error fetching tenantproperty:', error));
  }



  function  tenantPropertyProfile(data){
    
    const tenantproperty = data[0];
    // Remplir le formulaire avec les données actuelles de owner
    console.log("tenantProperty : " + JSON.stringify({tenantproperty}));
    console.log("tenantProperty : " + tenantproperty.lastname);
    console.log("tenantProperty : " + tenantproperty.firstname);
    console.log("tenantProperty : " + tenantproperty.contactmoov);
    console.log("tenantProperty : " + tenantproperty.contacttg);



    document.getElementById('tenant-lastname').value = tenantproperty.lastname;
    document.getElementById('tenant-firstname').value = tenantproperty.firstname;
    document.getElementById('tenant-contact-moov').value = tenantproperty.contactmoov;
    document.getElementById('tenant-contact-tg').value = tenantproperty.contacttg;
     
    document.getElementById('address').value = tenantproperty.address;
    document.getElementById('description').value = tenantproperty.descriptions;
    document.getElementById('cost').value = tenantproperty.price;
    localStorage.setItem('createTime', tenantproperty.create_time);
  }
  
  function  tenantPropertyOptionConstructor(tenantProperty){
    const tenantPropertyOption = document.getElementById("tenant-property-option");
    if (tenantPropertyOption) {
      tenantPropertyOption.innerHTML = ''; // Clear existing rows
      
      if (tenantPropertyOption.innerHTML=='') {
        console.log("yes");
      }
      tenantProperty.forEach((tp) => {
        console.log("Property data:", tp); // Log chaque propriété
        const option = document.createElement('option');

        option.value = tp.id;
        option.dataset.price = tp.price; 
        option.textContent = `${tp.lastname} ${tp.firstname.split(' ')[0]} ${tp.address} ${tp.price}`;
        
        tenantPropertyOption.appendChild(option);
    });
    } else {
    console.error("Element with ID 'tenantProperty-option' not found.");
    }
  }
  