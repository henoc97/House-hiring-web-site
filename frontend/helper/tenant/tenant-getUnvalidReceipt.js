


/**
 * Adds an invalid receipt to the table.
 * @param {Object} unvalidReceipt - The receipt data to be added.
 */
function addUnvalidReceipt(unvalidReceipt) {
  const tableBody = document.getElementById("receipts-table");

  // Format the date for display
  const formattedDate = new Date(unvalidReceipt.monthpayed).toLocaleString('fr-FR', {
    month: 'long',
    year: 'numeric'
  }).replace(',', '').replace(/\//g, '-');

  console.log("unvalidReceipt data:", unvalidReceipt); // Log the receipt data

  // Create a new row for the table
  const row = document.createElement('tr');
  row.dataset.id = unvalidReceipt.id;
  row.innerHTML = `
        <td>${formattedDate}</td>
        <td>${unvalidReceipt.sumpayed}</td>
        <td>
          <span class="badge bg-danger">Non approuvé</span>
        </td>
        <td>
          <div class="dropdown">
            <i class='bx bx-dots-vertical-rounded toggle-dropdown'></i>
            <div class="dropdown-content">
              <i class='bx bx-trash delete-icon' data-id="${unvalidReceipt.id}"></i>
            </div>
          </div>
        </td>
  `;
  tableBody.insertBefore(row, tableBody.firstChild);
}

/**
 * Fetches unvalidated receipts from the server and populates the table.
 */
function getUnvalidReceiptsRequest() {
  let token = localStorage.getItem('accessTokenTenant');
  fetch(hostTenant + 'receipt-unValid', {
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
            return renewAccessToken().then(() => getUnvalidReceiptsRequest());
        }
        // Redirect for other HTTP errors (e.g., 500)
        window.location.href = tenantError;
        throw new Error('HTTP error ' + response.status); // Throw error to trigger .catch
    }
    return response.json();
  })
  .then(data => {
    if (!data) return; // Stop execution if data is undefined (e.g., redirection)

    console.log("data received:", data); // Log the received data

    const unvalidReceipts = data;
    getValidReceiptsRequest();
    const tableBody = document.getElementById("receipts-table");
    if (tableBody) {
      tableBody.innerHTML = ''; // Clear existing rows

      unvalidReceipts.forEach((unvalidReceipt) => {
        addUnvalidReceipt(unvalidReceipt);
      });
      
      addDropdownsListener(); // Ensure the dropdowns are correctly initialized
    } else {
      console.error("Element with ID 'receipts-table' not found.");
    }
  })
  .catch((error) => {
    window.location.href = tenantError;
    console.error('Error fetching unvalid receipts:', error);
  });
}

/**
 * Adds event listeners to handle dropdowns and delete actions.
 */
function addDropdownsListener() {
  const tableBody = document.getElementById("receipts-table");

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
        const receiptId = target.dataset.id;
        deleteReceiptTenant(receiptId);
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
    console.error("Element with ID 'receipts-table' not found.");
  }
}

/**
 * Deletes a receipt from the server and removes it from the table.
 * @param {string} receiptId - The ID of the receipt to delete.
 */
function deleteReceiptTenant(receiptId) {
  let token = localStorage.getItem('accessTokenTenant');
  fetch(hostTenant + "delete-receipt", {
      method: 'POST',
      headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "id": receiptId })
  })
  .then(response => {
    if (!response.ok) {
        // Handle authentication/authorization errors
        if (response.status === 401 || response.status === 403) {
            return renewAccessToken().then(() => deleteReceiptTenant(receiptId));
        }
        // Redirect for other HTTP errors (e.g., 500)
        // window.location.href = tenantError;
        throw new Error('HTTP error ' + response.status); // Throw error to trigger .catch
    }
    return response.json();
  })
  .then(() => {
      // Remove the row from the table
      const row = document.querySelector(`tr[data-id="${receiptId}"]`);
      if (row) {
          row.remove();
      }
  })
  .catch(error => {
    // window.location.href = tenantError;
    console.error('Error deleting receipt:', error);
  });
}
