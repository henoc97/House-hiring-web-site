/**
 * Stores the number of tenants properties in localStorage.
 * 
 * @param {number} numberOfTenantsProperties - The number of tenant properties to store.
 */
function setNumberOfTenantsProperties(numberOfTenantsProperties) {
  localStorage.setItem('numberOfTenantsProperties', numberOfTenantsProperties);
}

/**
 * Retrieves the number of tenants properties from localStorage.
 * 
 * @returns {number} The number of tenant properties. Returns 0 if the value is undefined.
 */
function getNumberOfTenantsProperties() {
  console.log("Function executed successfully");
  // Check if the stored value is 'undefined' and return 0 if true
  if (localStorage.getItem('numberOfTenantsProperties') === 'undefined') return 0;
  // Return the stored value as a string
  return localStorage.getItem('numberOfTenantsProperties');
}

/**
 * Displays the number of tenants properties on the page.
 * Updates the text content of the element with ID 'total-tenants-properties'.
 */
function showNumberOfTenantsProperties() {
  const totalTenantsProperties = document.getElementById('total-tenants-properties');
  if (totalTenantsProperties) {
    totalTenantsProperties.textContent = getNumberOfTenantsProperties();
  } else {
    console.error("Element with ID 'total-tenants-properties' not found.");
  }
}

/**
 * Fetches tenants properties from the server and updates the UI.
 * 
 * @param {number} type - The type of tenants properties to fetch and display.
 *                          1: Display as table
 *                          2: Display as options
 */
function getTenantsPropertiesRequest(type) {
  // Retrieve the access token from localStorage
  let token = localStorage.getItem('accessToken');

  // Send a POST request to fetch tenants properties
  fetch(host + 'Tenants-properties', {
      method: 'POST',
      headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
      },
  })
  .then(response => {
    // Check if the response is not OK
    if (!response.ok) {
        // Handle unauthorized or forbidden errors
        if (response.status === 401 || response.status === 403) {
            return renewAccessToken().then(() => getTenantsPropertiesRequest(type));
        }
        // Redirect in case of other HTTP errors (e.g., 500)
        window.location.href = ownerError;
        throw new Error('HTTP error ' + response.status); // Throw an error to trigger the .catch
    }
    // Parse the response JSON
    return response.json();
  })
  .then(data => {
      console.log("Data received:", data); // Log received data

      // Store the number of tenant properties and update the display
      const tenantsproperties = data;
      setNumberOfTenantsProperties(tenantsproperties.length);
      showNumberOfTenantsProperties();

      // Call the appropriate function based on the type
      if (type === 1) {
        tenantsPropertiestableConstructor(tenantsproperties);
      } else {
        tenantsPropertiesOptionConstructor(tenantsproperties);
      }
  })
  .catch((error) => {
    // Handle any errors during the fetch operation
    window.location.href = ownerError;
    console.error('Error fetching tenants properties:', error);
  });
}

/**
 * Constructs and populates the tenants properties table.
 * 
 * @param {Array} tenantsproperties - The array of tenant properties to display in the table.
 */
function tenantsPropertiestableConstructor(tenantsproperties) {
  const tableBody = document.getElementById("tenants-properties-table");
  if (tableBody) {
    tableBody.innerHTML = ''; // Clear existing rows

    // Iterate over the tenants properties and create table rows
    tenantsproperties.forEach((tenantproperty) => {
      console.log("Tenants properties data:", tenantproperty); // Log each property
      addtenantsPropertiestable(tenantproperty);
    });

    addDropdownsListenerTenPrTable();

  } else {
    console.error("Element with ID 'tenants-properties-table' not found.");
  }
}


/**
 * Adds event listeners to handle dropdowns and delete actions.
 */
function addDropdownsListenerTenPrTable() {
  const tableBody = document.getElementById("tenants-properties-table");

  if (tableBody) {
    tableBody.addEventListener('click', function(event) {
      const target = event.target;

      if (target.classList.contains('toggle-dropdown')) {
        console.log('Dropdown clicked:', target);
        const dropdown = target.closest('.dropdown');
        dropdown.classList.toggle('show');
        event.stopPropagation();
      }
      if (target.classList.contains('delete-icon')) {
        console.log('Delete icon clicked:', target);
        const tenantPropertyId = target.dataset.id;
        deleteTenantProperty(tenantPropertyId);
      }
    });

    // Close dropdowns when clicking outside
    window.addEventListener('click', function(event) {
      if (!event.target.matches('.toggle-dropdown')) {
        const dropdowns = document.querySelectorAll('.dropdown');
        dropdowns.forEach(dropdown => {
          dropdown.classList.remove('show');
        });
      }
    });
  } else {
    console.error("Element with ID 'tenants-properties-table' not found.");
  }
}

/**
 * Constructs and populates the tenants properties options.
 * 
 * @param {Array} tenantsproperties - The array of tenant properties to display as options.
 */
function tenantsPropertiesOptionConstructor(tenantsproperties) {
  const tenantsPropertiesOption = document.getElementById("tenants-properties-option");
  if (tenantsPropertiesOption) {
    tenantsPropertiesOption.innerHTML = ''; // Clear existing options

    tenantsproperties.forEach((tenantproperty) => {
      console.log("Property data:", tenantproperty); // Log each property
      const option = document.createElement('option');
      option.value = tenantproperty.id;
      option.dataset.price = tenantproperty.price; 
      option.textContent = `${tenantproperty.lastname} ${tenantproperty.firstname.split(' ')[0]} ${tenantproperty.address} ${tenantproperty.price}`;
      
      tenantsPropertiesOption.insertBefore(option, tenantsPropertiesOption.firstChild);

      // Select the first element, which is the most recently added
      if (tenantsPropertiesOption.firstChild) {
        tenantsPropertiesOption.firstChild.selected = true;
      }
    });
  } else {
    console.error("Element with ID 'tenants-properties-option' not found.");
  }
}

/**
 * Deletes a tenant property from the server and updates the UI.
 * 
 * @param {number} tenantPropertyId - The ID of the tenant property to delete.
 */
function deleteTenantProperty(tenantPropertyId) {
  // Retrieve the access token from localStorage
  let token = localStorage.getItem('accessToken');

  // Send a POST request to delete the tenant property
  fetch(host + "delete-tenant-property", {
      method: 'POST',
      headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "id": tenantPropertyId })
  })
  .then(response => {
    // Check if the response is not OK
    if (!response.ok) {
        // Handle unauthorized or forbidden errors
        if (response.status === 401 || response.status === 403) {
            return renewAccessToken().then(() => deleteTenantProperty(tenantPropertyId));
        }
        // Redirect in case of other HTTP errors (e.g., 500)
        window.location.href = ownerError;
        throw new Error('HTTP error ' + response.status); // Throw an error to trigger the .catch
    }
    // Parse the response JSON
    return response.json();
  })
  .then(() => {
    // Remove the table row corresponding to the deleted tenant property
    const row = document.querySelector(`tr[data-id="${tenantPropertyId}"]`);
    if (row) {
        row.remove(); // Remove the row from the table
    }
  })
  .catch(error => {
    // Handle any errors during the delete operation
    window.location.href = ownerError;
    console.error('Error deleting property:', error);
  });
}
