/**
 * Stores the number of payments in localStorage.
 * 
 * @param {number} numberOfPayments - The number of payments to store.
 */
function setNumberOfPayments(numberOfPayments) {
  localStorage.setItem('numberOfPayments', numberOfPayments);
}

/**
 * Retrieves the number of payments from localStorage.
 * 
 * @returns {number} The number of payments. Returns 0 if the value is 'undefined' or not found.
 */
function getNumberOfPayments() {
  console.log("Function getNumberOfPayments is working.");
  // Check if the stored value is 'undefined' and return 0 if true
  if (localStorage.getItem('numberOfPayments') === 'undefined') return 0;
  // Return the stored number of payments
  return Number(localStorage.getItem('numberOfPayments')) || 0; // Convert to number and handle case where value might be null
}

/**
 * Updates the UI to display the number of payments.
 */
function showNumberOfPayments() {
  const totalPayments = document.getElementById('total-payments');
  if (totalPayments) {
    totalPayments.textContent = getNumberOfPayments(); // Set the text content to the number of payments
  } else {
    console.error("Element with ID 'total-payments' not found.");
  }
}

/**
 * Fetches valid receipts from the server and updates the UI.
 * 
 * The function sends a POST request to fetch valid receipts, updates the number of payments,
 * and displays the receipts in a table. It also sets up event listeners for delete actions.
 */
function getValidReceiptsRequest() {
  // Retrieve the access token from localStorage
  let token = localStorage.getItem('accessToken');

  // Send a POST request to fetch valid receipts
  fetch(host + 'receipt-valid', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
  })
  .then(response => {
    // Check if the response status indicates unauthorized or forbidden access
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return renewAccessToken().then(() => getValidReceiptsRequest());
      }
      // Redirect in case of other HTTP errors (e.g., 500)
      window.location.href = ownerError;
      throw new Error('HTTP error ' + response.status); // Throw an error to trigger the .catch
    }
    // Parse the response JSON
    return response.json();
  })
  .then(data => {
    // Check if data is available; if not, exit the function
    if (!data) return;

    console.log("Data received:", data); // Log the received data

    // If the properties are wrapped in an object { myProperties }
    const valiReceipts = data;

    // Update the number of payments and display it
    setNumberOfPayments(valiReceipts.length);
    showNumberOfPayments();

    const tableBody = document.getElementById("valid-receipts-table");
    if (tableBody) {
      tableBody.innerHTML = ''; // Clear existing rows

      // Iterate over the valid receipts and create table rows
      valiReceipts.forEach((validReceipt) => {
        console.log("Valid receipt data:", validReceipt); // Log each receipt

        const formattedDate = new Date(validReceipt.monthpayed).toLocaleString('fr-FR', {
          month: 'long',
          year: 'numeric'
        }).replace(',', '').replace(/\//g, '-');

        // Create a new table row
        const row = document.createElement('tr');
        row.dataset.id = validReceipt.id;
        row.innerHTML = `
              <td>${validReceipt.lastname} ${validReceipt.firstname.split(' ')[0]}</td>
              <td>${formattedDate}</td>
              <td>${validReceipt.address}</td>
              <td>${validReceipt.sumpayed}</td>
              <td>
                <a href="#" class="go-validate-receipt" data-receipt='${JSON.stringify(validReceipt)}'>
                  <span class="badge bg-success">Approuvé</span>
                </a>
              </td>
              <td>
                <div class="dropdown">
                    <i class='bx bx-dots-vertical-rounded toggle-dropdown'></i>
                    <div class="dropdown-content">
                        <i class='bx bx-trash delete-icon' data-id="${validReceipt.id}"></i>
                    </div>
                </div>
              </td>
        `;
        tableBody.appendChild(row);
      });

      addDropdownsListenerReceiptTable("valid-receipts-table");

    } else {
      console.error("Element with ID 'valid-receipts-table' not found.");
    }
  })
  .catch((error) => {
    // Log error if fetching fails
    console.error('Error fetching valid receipts:', error);
  });
}