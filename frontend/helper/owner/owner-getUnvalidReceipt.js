/**
 * Fetches invalid receipts from the server and updates the UI.
 * @param {boolean} isSearch boolean indicating whether the search.
 *
 * The function sends a POST request to fetch receipts that are not validated, then updates the table
 * with the received data. It also sets up event listeners for delete actions.
 */
function getUnvalidReceiptsRequest(isSearch) {
  // Send a POST request to fetch invalid receipts
  const searchInput = document.getElementById('search-input');
  const searchValues = searchInput.value.split(' ');
  const route = !isSearch ? 'receipt-unValid' : 'search-unvalid-receipt';
  const reqBody = JSON.stringify(
    isSearch
      ? { lastname: searchValues[0], firstname: searchValues[1] ?? '' }
      : {}
  );
  fetch(host + route, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: reqBody,
    credentials: 'include',
  })
    .then((response) => {
      // Check if the response status indicates unauthorized or forbidden access
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          window.location.href = ownerLogSignURL;
        }
        window.location.href = ownerError;
      }
      // Parse the response JSON
      return response.json();
    })
    .then((data) => {
      // Check if data is available; if not, exit the function
      if (!data) return;

      const unvalidReceipts = data;
      const tableBody = document.getElementById('unvalid-receipts-table');
      if (tableBody) {
        tableBody.innerHTML = ''; // Clear existing rows

        // Iterate over the invalid receipts and create table rows
        unvalidReceipts.forEach((unvalidReceipt) => {
          const paidMonthsArray = unvalidReceipt.paid_months.split(', ');
          const formattedDate = new Date(paidMonthsArray[0])
            .toLocaleString('fr-FR', {
              month: 'long',
              year: 'numeric',
            })
            .replace(',', '')
            .replace(/\//g, '-');

          // Format local date and set it into dateTimeInput
          const now = new Date(unvalidReceipt.last_create_time);
          const formattedPaymentDateTime = now
            .toISOString()
            .slice(0, 16)
            .replace('T', ' ');

          // Create a new table row
          const row = document.createElement('tr');
          row.dataset.payment_ids = unvalidReceipt.payment_ids;
          row.innerHTML = `
              <td>${formattedPaymentDateTime}</td>
              <td>${unvalidReceipt.ref}</td>
              <td>${unvalidReceipt.address}</td>
              <td>${unvalidReceipt.lastname} ${unvalidReceipt.firstname.split(' ')[0]}</td>
              <td>${formattedDate}${paidMonthsArray.length > 1 ? `,...` : ``}</td>
              <td>${unvalidReceipt.method}</td>
              <td>${unvalidReceipt.total_sumpayed}</td>
              <td>
                <a href="#" class="go-validate-receipt" data-receipt='${JSON.stringify(unvalidReceipt)}'>
                  <span class="badge bg-danger">Non Approuvé</span>
                </a>
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
          tableBody.appendChild(row);
        });

        addDropdownsListenerReceiptTable('unvalid-receipts-table');
      } else {
      }
    })
    .catch((error) => {
      // Redirect and log error if fetching fails
      window.location.href = ownerError;
    });
}

/**
 * Deletes a receipt from the server and updates the UI.
 *
 * @param {number} receiptId - The ID of the receipt to delete.
 */
function deleteReceipt(receiptId, receiptIds) {
  // Send a POST request to delete the receipt
  fetch(host + 'delete-receipt', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ id: receiptId }),
  })
    .then((response) => {
      // Check if the response status indicates unauthorized or forbidden access
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          window.location.href = ownerLogSignURL;
        }
        // Redirect in case of other HTTP errors (e.g., 500)
        window.location.href = ownerError;
        throw new Error('HTTP error ' + response.status); // Throw an error to trigger the .catch
      }
      // Parse the response JSON
      return response.json();
    })
    .then(() => {
      // Remove the table row corresponding to the deleted receipt
      const row = document.querySelector(
        `tr[data-payment_ids="${receiptIds}"]`
      );
      if (row) {
        row.remove(); // Remove the row from the table
      }
    })
    .catch((error) => {
      // Redirect and log error if deletion fails
      window.location.href = ownerError;
    });
}

/**
 * Adds event listeners to handle dropdowns and delete actions.
 */
function addDropdownsListenerReceiptTable(tableId) {
  const tableBody = document.getElementById(tableId);

  if (tableBody) {
    tableBody.addEventListener('click', function (event) {
      const target = event.target;

      if (target.classList.contains('toggle-dropdown')) {
        const dropdown = target.closest('.dropdown');
        dropdown.classList.toggle('show');
        event.stopPropagation();
      }
      if (target.classList.contains('delete-icon')) {
        const receiptIds = target.dataset.payment_ids;
        receiptIds.split(', ').forEach((id) => deleteReceipt(id, receiptIds));
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
