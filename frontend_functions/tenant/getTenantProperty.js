
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
        tenantPropertyProfile(tenantproperty)
      } else {
        tenantPropertyoptionConstructor(tenantproperty)
      }
      
    })
    .catch((error) => console.error('Error fetching tenantproperty:', error));
  }



  function  tenantPropertyProfile(data){
    
    const tenantForm = document.getElementById("tenant-form");
    const propertyForm = document.getElementById("property-form");
    const tenantproperty = data[0];
    // Remplir le formulaire avec les données actuelles de owner
    console.log("tenantProperty : " + JSON.stringify({tenantproperty}));
    console.log("tenantProperty : " + tenantproperty.lastname);
    console.log("tenantProperty : " + tenantproperty.firstname);
    console.log("tenantProperty : " + tenantproperty.contactmoov);
    console.log("tenantProperty : " + tenantproperty.contacttg);



    document.getElementById('tenant-lastname').value = tenantproperty.lastname;
    document.getElementById('tenant-firstname').value = tenantproperty.firstname;
    document.getElementById('tenant-contactmoov').value = tenantproperty.contactmoov;
    document.getElementById('tenant-contacttg').value = tenantproperty.contacttg;
    
    document.getElementById('address').value = tenantproperty.address;
    document.getElementById('description').value = tenantproperty.descriptions;
    document.getElementById('cost').value = tenantproperty.price;
    localStorage.setItem('createTime', tenantproperty.create_time);
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
  