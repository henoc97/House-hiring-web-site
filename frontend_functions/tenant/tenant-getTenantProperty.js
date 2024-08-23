
function getTenantPropertyRequest(type) {
    let token = localStorage.getItem('accessTokenTenant');
    fetch(hostTenant + 'tenant-property', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
    })
    .then(response => {
      if (!response.ok && (response.status === 401 || response.status === 403)) {
        return renewAccessToken().then(() => getTenantPropertyRequest(type));
      }
      response.json()})
    .then(data => {
      console.log("data received:", data); // Log les données reçues

      // Si les propriétés sont enveloppées dans un objet { myProperties }
      const tenantProperty = data;

      if (type == 1) {
        tenantPropertyProfile(tenantProperty)
      } else {
        tenantPropertyOptionConstructor(tenantProperty)
      }
      
    })
    .catch((error) => {
      window.location.href = tenantError;
      console.error('Error fetching tenantproperty:', error)});
  }



  function  tenantPropertyProfile(data){
    console.log('data:', data);
    const tenantProperty = data[0];
    // Remplir le formulaire avec les données actuelles de owner
    console.log("tenantProperty : " + JSON.stringify({tenantProperty}));
    console.log("tenantProperty : " + tenantProperty.lastname);
    console.log("tenantProperty : " + tenantProperty.firstname);
    console.log("tenantProperty : " + tenantProperty.contactmoov);
    console.log("tenantProperty : " + tenantProperty.contacttg);



    document.getElementById('tenant-lastname').value = tenantProperty.lastname;
    document.getElementById('tenant-firstname').value = tenantProperty.firstname;
    document.getElementById('tenant-contact-moov').value = tenantProperty.contactmoov;
    document.getElementById('tenant-contact-tg').value = tenantProperty.contacttg;
    localStorage.setItem('createTime', data.create_time);

    document.getElementById('property-address').value = tenantProperty.address;
    document.getElementById('property-description').value = tenantProperty.descriptions;
    document.getElementById('property-cost').value = tenantProperty.price;
    localStorage.setItem('createTime', tenantProperty.create_time);
  }
  
  function  tenantPropertyOptionConstructor(tenantProperty){
    const tenantPropertyOption = document.getElementById("receipt-tenant-property-option");
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
  