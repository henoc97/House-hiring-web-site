/**
 * Fetches tenant property data from the server and processes it based on the type.
 * @param {number} type - The type of request (1 for profile, other for options).
 */
function getTenantPropertyRequest(type) {
  fetch(hostTenant + 'tenant-property', {
    method: 'POST',
    headers: { 
          'Content-Type': 'application/json'
      },
      credentials: 'include',
  })
  .then(response => {
    if (!response.ok) {
        // Handle authentication/authorization errors
        if (response.status === 401 || response.status === 403) {
          window.location.href = tenantLogSignURL;
        }
        // Redirect for other HTTP errors (e.g., 500)
        window.location.href = tenantError;
        throw new Error('HTTP error ' + response.status); // Throw error to trigger .catch
    }
    return response.json();
})
  .then(data => {

    // Process the data based on the type
    if (type == 1) {
      tenantPropertyProfile(data);
    } else {
      tenantPropertyOptionConstructor(data);
    }
  })
  .catch((error) => {
    window.location.href = tenantError;
  });
}

/**
* Fills the tenant profile form with the given data.
* @param {Array} data - The tenant property data received from the server.
*/
function tenantPropertyProfile(data) {
  // console.log('data:', data);
  const tenantProperty = data[0];
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
      // Create a new option element for each tenant property
      const option = document.createElement('option');
      option.value = tp.id;
      option.dataset.price = tp.price; 
      option.textContent = `${tp.lastname} ${tp.firstname.split(' ')[0]} ${tp.address} ${tp.price}`;
      
      tenantPropertyOption.appendChild(option);
    });
  } else {
    // console.error("Element with ID 'receipt-tenant-property-option' not found.");
  }
}
