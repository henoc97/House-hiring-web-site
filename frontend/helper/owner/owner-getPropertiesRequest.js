/**
 * @fileoverview This script manages properties including fetching, updating, and deleting them, as well as displaying related information.
 */

/**
 * Stores the number of properties in localStorage.
 * @param {number} numberOfProperties - The number of properties to store.
 */
function setNumberOfProperties(numberOfProperties) {
  localStorage.setItem('numberOfProperties', numberOfProperties);
}

/**
 * Retrieves the number of properties from localStorage.
 * @return {number} The number of properties, or 0 if not defined.
 */
function getNumberOfProperties() {
  // console.log("Function is working well");
  // Return 0 if the value is 'undefined'
  if (localStorage.getItem('numberOfProperties') == 'undefined') return 0;
  return localStorage.getItem('numberOfProperties');
}

/**
 * Displays the number of properties in the HTML element with the ID 'total-properties'.
 */
function showNumberOfProperties() {
  const totalProperties = document.getElementById('total-properties');
  totalProperties.textContent = getNumberOfProperties();
}

/**
 * Fetches properties based on the specified type and updates the UI.
 * @param {number} type - The type of properties to fetch.
 */
function getPropertiesRequest(type) {
  let token = localStorage.getItem('accessToken');
  fetch(host + 'my-properties', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ type: type })
  })
  .then(response => {
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return renewAccessToken().then(() => getPropertiesRequest(type));
      }
      // Redirect on other HTTP errors (e.g., 500)
      // window.location.href = ownerError;
      throw new Error('HTTP error ' + response.status); // Throw an error to trigger .catch
    }
    return response.json();
  })
  .then(data => {
    // console.log("Data received:", data); // Log received data
    // If properties are wrapped in an object { myProperties }
    const properties = data.myProperties || data;

    setNumberOfProperties(properties.length);

    showNumberOfProperties();

    if (type == 1) {
      myPropertiesTableConstructor(properties);
    } else {
      propertyOptionConstructor(properties);
    }
  })
  .catch((error) => {
    // window.location.href = ownerError;
    // console.error('Error fetching properties:', error);
  });
}

/**
 * Constructs a dropdown list of properties.
 * @param {Array} properties - The list of properties to display.
 */
function propertyOptionConstructor(properties) {
  const propertyOption = document.getElementById("property-option");
  if (propertyOption) {
    propertyOption.innerHTML = ''; // Clear existing options

    properties.forEach((property) => {
      // console.log("Property data:", property); // Log each property
      const option = document.createElement('option');

      option.value = property.id;
      option.textContent = `${property.address} ${property.price}`;

      propertyOption.insertBefore(option, propertyOption.firstChild);

      // Select the first element, which is the last added
      if (propertyOption.firstChild) {
        propertyOption.firstChild.selected = true;
      }
    });
  } else {
    // console.error("Element with ID 'property-option' not found.");
  }
}

/**
 * Constructs a table displaying the list of properties.
 * @param {Array} properties - The list of properties to display.
 */
function myPropertiesTableConstructor(properties) {
  // console.log("Function is working well in getPropertiesRequest");
  const tableBody = document.getElementById("my-properties-table");
  if (tableBody) {
    tableBody.innerHTML = ''; // Clear existing rows

    properties.forEach((property) => {
      // console.log("Property data:", property); // Log each property
      addPropertyToTable(property);
    });
    addDropdownsListener();
  } else {
    // console.error("Element with ID 'my-properties-table' not found.");
  }
}

/**
 * Edits a property by fetching its details and populating the edit form.
 * @param {number} propertyId - The ID of the property to edit.
 */
function editProperty(propertyId) {
  let token = localStorage.getItem('accessToken');
  fetch(host + "my-property", {  // Use the ID to get property details
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ "id": propertyId })
  })
  .then(response => {
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return renewAccessToken().then(() => editProperty(propertyId));
      }
      // Redirect on other HTTP errors (e.g., 500)
      window.location.href = ownerError;
      throw new Error('HTTP error ' + response.status); // Throw an error to trigger .catch
    }
    return response.json();
  })
  .then(data => {
    // console.log("Editing property:", data);

    // Populate the form with the current property details
    document.getElementById('property-address').value = data.address;
    document.getElementById('property-description').value = data.description;
    document.getElementById('property-cost').value = data.price;

    // Change button text to indicate edit mode
    const submitButton = document.querySelector('#property-form button[type="submit"]');
    const actionIndicator = document.querySelector('#action-indicator');
    submitButton.textContent = 'Modifier';
    actionIndicator.textContent = "Modifier une propriété";

    // Add a class or attribute to identify it as an edit operation
    submitButton.dataset.editingId = propertyId;
  })
  .catch(error => {
    window.location.href = ownerError;
    // console.error('Error fetching property details:', error);
  });
}

/**
 * Resets the property form to its default state.
 */
function resetPropertyForm() {
  const form = document.getElementById('property-form');
  if (form) {
    form.reset();
    const submitButton = document.querySelector('#property-form button[type="submit"]');
    submitButton.textContent = 'Enregistrer';
    const actionIndicator = document.querySelector('#action-indicator');
    actionIndicator.textContent = "Enregistrer une propriété";
    delete submitButton.dataset.editingId;
  }
}

/**
 * Updates a property with the new data provided.
 * @param {number} editingId - The ID of the property being updated.
 */
function updateProperty(editingId) {
  const updatedData = {
    id: editingId,
    address: document.getElementById('property-address').value,
    description: document.getElementById('property-description').value,
    cost: document.getElementById('property-cost').value
  };
  let token = localStorage.getItem('accessToken');
  fetch(host + "update-property", {  // Use the ID to update property details
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedData)
  })
  .then(response => {
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return renewAccessToken().then(() => updateProperty(editingId));
      }
      // Redirect on other HTTP errors (e.g., 500)
      window.location.href = ownerError;
      throw new Error('HTTP error ' + response.status); // Throw an error to trigger .catch
    }
    return response.json();
  })
  .then(data => {
    // Directly update the corresponding row
    const row = document.querySelector(`tr[data-id="${editingId}"]`);
    if (row) {
      row.children[0].textContent = data.address;
      row.children[1].textContent = data.description;
      row.children[2].textContent = data.price;
    }
    resetPropertyForm();
  })
  .catch(error => {
    window.location.href = ownerError;
    // console.error('Error updating property:', error);
  });
}

/**
 * Deletes a property by its ID.
 * @param {number} propertyId - The ID of the property to delete.
 */
function deleteProperty(propertyId) {
  let token = localStorage.getItem('accessToken');
  fetch(host + "delete-property", {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ "id": propertyId })
  })
  .then(response => {
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return renewAccessToken().then(() => deleteProperty(propertyId));
      }
      // Redirect on other HTTP errors (e.g., 500)
      window.location.href = ownerError;
      throw new Error('HTTP error ' + response.status); // Throw an error to trigger .catch
    }
    return response.json();
  })
  .then(() => {
    const row = document.getElementById("my-properties-table")
      .querySelector(`tr[data-id="${propertyId}"]`);
    if (row) {
      row.remove(); // Remove the row from the table
    }
  })
  .catch(error => {
    window.location.href = ownerError;
    // console.error('Error deleting property:', error);
  });
}
