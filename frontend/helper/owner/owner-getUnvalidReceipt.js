


/**
 * Fetches invalid receipts from the server and updates the UI.
 * 
 * The function sends a POST request to fetch receipts that are not validated, then updates the table
 * with the received data. It also sets up event listeners for delete actions.
 */
function getUnvalidReceiptsRequest() {
  // Retrieve the access token from localStorage
  let token = localStorage.getItem('accessToken');

  // Send a POST request to fetch invalid receipts
  fetch(host + 'receipt-unValid', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
  })
  .then(response => {
    // Check if the response status indicates unauthorized or forbidden access
    if (!response.ok) {
        if ((response.status === 401 || response.status === 403)) {
        // alert("Problem with authorization. Attempting to renew access token.");
        return renewAccessToken().then(() => getUnvalidReceiptsRequest());
      }
      window.location.href = ownerError;
    }
    // Parse the response JSON
    return response.json();
  })
  .then(data => {
    // Check if data is available; if not, exit the function
    if (!data) return;

    console.log("Data received:", data); // Log the received data

    const unvalidReceipts = data;
    const tableBody = document.getElementById("unvalid-receipts-table");
    if (tableBody) {
      tableBody.innerHTML = ''; // Clear existing rows

      // Iterate over the invalid receipts and create table rows
      unvalidReceipts.forEach((unvalidReceipt) => {
        const formattedDate = new Date(unvalidReceipt.monthpayed).toLocaleString('fr-FR', {
          month: 'long',
          year: 'numeric'
        }).replace(',', '').replace(/\//g, '-');
        
        console.log("Unvalid receipt data:", unvalidReceipt); // Log each receipt

        // Create a new table row
        const row = document.createElement('tr');
        row.dataset.id = unvalidReceipt.id;
        row.innerHTML = `
              <td>${unvalidReceipt.lastname} ${unvalidReceipt.firstname.split(' ')[0]}</td>
              <td>${formattedDate}</td>
              <td>${unvalidReceipt.address}</td>
              <td>${unvalidReceipt.sumpayed}</td>
              <td>
                <a href="#" class="go-validate-receipt" data-receipt='${JSON.stringify(unvalidReceipt)}'>
                  <span class="badge bg-danger">Non Approuvé</span>
                </a>
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
        tableBody.appendChild(row);
      });

      addDropdownsListenerReceiptTable("unvalid-receipts-table");

    } else {
      console.error("Element with ID 'unvalid-receipts-table' not found.");
    }
  })
  .catch((error) => {
    // Redirect and log error if fetching fails
    window.location.href = ownerError;
    console.error('Error fetching invalid receipts:', error);
  });
}

/**
 * Deletes a receipt from the server and updates the UI.
 * 
 * @param {number} receiptId - The ID of the receipt to delete.
 */
function deleteReceipt(receiptId) {
  // Retrieve the access token from localStorage
  let token = localStorage.getItem('accessToken');

  // Send a POST request to delete the receipt
  fetch(host + "delete-receipt", {
      method: 'POST',
      headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "id": receiptId })
  })
  .then(response => {
    // Check if the response status indicates unauthorized or forbidden access
    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            return renewAccessToken().then(() => deleteReceipt(receiptId));
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
    const row = document.querySelector(`tr[data-id="${receiptId}"]`);
    if (row) {
        row.remove(); // Remove the row from the table
    }
  })
  .catch(error => {
    // Redirect and log error if deletion fails
    window.location.href = ownerError;
    console.error('Error deleting receipt:', error);
  });
}


/**
 * Adds event listeners to handle dropdowns and delete actions.
 */
function addDropdownsListenerReceiptTable(tableId) {
  const tableBody = document.getElementById(tableId);

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
        deleteReceipt(receiptId);
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
    console.error(`Element with ID ${tableId} not found.`);
  }
}