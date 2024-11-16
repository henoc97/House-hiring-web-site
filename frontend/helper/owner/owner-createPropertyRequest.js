/**
 * Adds a property to the properties table.
 * @param {Object} property - The property data to add to the table.
 */
function addPropertyToTable(property) {
  const tableBody = document.getElementById('my-properties-table');

  const row = document.createElement('tr');
  row.dataset.id = property.id;
  row.innerHTML = `
      <td>${property.address}</td>
      <td>${property.description}</td>
      <td>${property.price}</td>
      <td>
          <div class="dropdown">
              <i class='bx bx-dots-vertical-rounded toggle-dropdown'></i>
              <div class="dropdown-content">
                  <i class='bx bx-edit-alt edit-icon' data-id="${property.id}"></i>
                  <i class='bx bx-trash delete-icon' data-id="${property.id}"></i>
              </div>
          </div>
      </td>
  `;
  tableBody.insertBefore(row, tableBody.firstChild); // Adds the row to the beginning of the table
}

/**
 * Adds event listeners to handle dropdowns and edit, delete actions.
 */
function addDropdownsListener() {
  const tableBody = document.getElementById('my-properties-table');

  if (tableBody) {
    tableBody.addEventListener('click', function (event) {
      const target = event.target;

      if (target.classList.contains('toggle-dropdown')) {
        const dropdown = target.closest('.dropdown');
        dropdown.classList.toggle('show');
        event.stopPropagation();
      }

      if (target.classList.contains('edit-icon')) {
        const propertyId = target.dataset.id;
        editProperty(propertyId);
      }

      if (target.classList.contains('delete-icon')) {
        const propertyId = target.dataset.id;
        deleteProperty(propertyId);
      }
    });

    // Close dropdowns when clicking outside
    window.addEventListener('click', function (event) {
      if (!event.target.matches('.toggle-dropdown')) {
        const dropdowns = document.querySelectorAll('.dropdown');
        dropdowns.forEach((dropdown) => {
          dropdown.classList.remove('show');
        });
      }
    });
  } else {
  }
}

/**
 * Sends a request to create a new property.
 */
function createPropertyRequest() {
  if (getsold() - registerHomePrice > 0) {
    let address = document.getElementById('property-address').value;
    let description = document.getElementById('property-description').value;
    let cost = document.getElementById('property-cost').value;

    fetch(host + 'create-properties', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        address: address,
        description: description,
        cost: cost,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            window.location.href = ownerLogSignURL;
          }
          // Redirect in case of other HTTP errors (e.g., 500)
          window.location.href = ownerError;
          throw new Error('HTTP error ' + response.status); // Throw an error to trigger the .catch
        }
        return response.json();
      })
      .then((data) => {
        updateSoldRequest(registerHomePrice);
        document.getElementById('property-form').reset();
        addPropertyToTable(data); // Add the new property to the table without reloading
        setNumberOfProperties(parseInt(getNumberOfProperties(), 10) + 1);
        showNumberOfProperties();
        showNewSold();
      })
      .catch((error) => {
        window.location.href = ownerError;
      });
  } else {
    alert(`solde insuffisant. Cette opération coûte ${registerHomePrice} XOF`);
  }
}
