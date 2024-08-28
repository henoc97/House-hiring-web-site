/**
 * Fetches tenant property data from the server and processes it based on the type.
 * @param {number} type - The type of request (1 for profile, other for options).
 */
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
    if (!response.ok) {
        // Handle authentication/authorization errors
        if (response.status === 401 || response.status === 403) {
            return renewAccessToken().then(() => getTenantPropertyRequest(type));
        }
        // Redirect for other HTTP errors (e.g., 500)
        window.location.href = tenantError;
        throw new Error('HTTP error ' + response.status); // Throw error to trigger .catch
    }
    return response.json();
})
  .then(data => {
    console.log("data received:", data); // Log the received data

    // Process the data based on the type
    if (type == 1) {
      tenantPropertyProfile(data);
    } else {
      tenantPropertyOptionConstructor(data);
    }
  })
  .catch((error) => {
    window.location.href = tenantError;
    console.error('Error fetching tenant property:', error);
  });
}

/**
* Fills the tenant profile form with the given data.
* @param {Array} data - The tenant property data received from the server.
*/
function tenantPropertyProfile(data) {
  console.log('data:', data);
  const tenantProperty = data[0];
  
  // Fill the profile form with the current owner data
  console.log("tenantProperty : " + JSON.stringify(tenantProperty));
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
  document.getElementById('property-description').value = tenantProperty.description;
  document.getElementById('property-cost').value = tenantProperty.price;
  localStorage.setItem('createTime', tenantProperty.create_time);
}

/**
* Constructs and populates the options for tenant property selection.
* @param {Array} tenantProperty - The array of tenant property data received from the server.
*/
function tenantPropertyOptionConstructor(tenantProperty) {
  const tenantPropertyOption = document.getElementById("receipt-tenant-property-option");
  if (tenantPropertyOption) {
    tenantPropertyOption.innerHTML = ''; // Clear existing options
    
    tenantProperty.forEach((tp) => {
      console.log("Property data:", tp); // Log each property
      
      // Create a new option element for each tenant property
      const option = document.createElement('option');
      option.value = tp.id;
      option.dataset.price = tp.price; 
      option.textContent = `${tp.lastname} ${tp.firstname.split(' ')[0]} ${tp.address} ${tp.price}`;
      
      tenantPropertyOption.appendChild(option);
    });
  } else {
    console.error("Element with ID 'receipt-tenant-property-option' not found.");
  }
}
