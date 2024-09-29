


/**
 * Adds an invalid receipt to the table.
 * @param {Object} unvalidReceipt - The receipt data to be added.
 */
function addUnvalidReceipt(unvalidReceipt) {
  const tableBody = document.getElementById("receipts-table");

  const paidMonthsArray = unvalidReceipt.paid_months.split(', ');
  const formattedDate = new Date(paidMonthsArray[0]).toLocaleString('fr-FR', {
    month: 'long',
    year: 'numeric'
  }).replace(',', '').replace(/\//g, '-');

  // Format local date and set it into dateTimeInput
  const now = new Date(unvalidReceipt.last_create_time);
  const formattedPaymentDateTime = now.toISOString().slice(0, 16).replace('T', ' ');

  // Create a new row for the table
  const row = document.createElement('tr');
  row.dataset.id = unvalidReceipt.id;
  row.innerHTML = `
        <td>${formattedPaymentDateTime}</td>
        <td>${unvalidReceipt.ref}</td>
        <td>${unvalidReceipt.address}</td>
        <td>${unvalidReceipt.lastname} ${unvalidReceipt.firstname.split(' ')[0]}</td>
        <td>${formattedDate}${paidMonthsArray.length > 1 ? `,...` : ``}</td>
        <td>${unvalidReceipt.method}</td>
        <td>${unvalidReceipt.total_sumpayed}</td>
        <td>
          <span class="badge bg-danger">Non Approuvé</span>
        </td>
        <td>
          <div class="dropdown">
              <i class='bx bx-dots-vertical-rounded toggle-dropdown'></i>
              <div class="dropdown-content">
                  <i class='bx bx-trash delete-icon' data-payment_ids="${unvalidReceipt.payment_ids}"></i>
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
  fetch(hostTenant + 'receipt-unValid', {
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
      if (!data) return; // Stop execution if data is undefined (e.g., redirection)


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
      }
    })
    .catch((error) => {
      window.location.href = tenantError;
    });
}

/**
 * Adds event listeners to handle dropdowns and delete actions.
 */
function addDropdownsListener() {
  const tableBody = document.getElementById("receipts-table");

  if (tableBody) {
    tableBody.addEventListener('click', function (event) {
      const target = event.target;

      if (target.classList.contains('toggle-dropdown')) {
        const dropdown = target.closest('.dropdown');
        dropdown.classList.toggle('show');
        event.stopPropagation();
      }

      if (target.classList.contains('delete-icon')) {
        const receiptId = target.dataset.id;
        deleteReceiptTenant(receiptId);
      }
    });

    // Close dropdowns when clicking outside
    window.addEventListener('click', function (event) {
      if (!event.target.matches('.toggle-dropdown')) {
        const dropdowns = document.querySelectorAll('.dropdown');
        dropdowns.forEach(dropdown => {
          dropdown.classList.remove('show');
        });
      }
    });
  } else {
  }
}

/**
 * Deletes a receipt from the server and removes it from the table.
 * @param {string} receiptId - The ID of the receipt to delete.
 */
function deleteReceiptTenant(receiptId) {
  fetch(hostTenant + "delete-receipt", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({ "id": receiptId })
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
    .then(() => {
      // Remove the row from the table
      const row = document.querySelector(`tr[data-id="${receiptId}"]`);
      if (row) {
        row.remove();
      }
    })
    .catch(error => {
      window.location.href = tenantError;
    });
}
