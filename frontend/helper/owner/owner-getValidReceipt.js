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
  }
}

/**
 * Fetches valid receipts from the server and updates the UI.
 * @param {boolean} isSearch boolean indicating whether the search.
 * 
 * The function sends a POST request to fetch valid receipts, updates the number of payments,
 * and displays the receipts in a table. It also sets up event listeners for delete actions.
 */
function getValidReceiptsRequest(isSearch) {
  // Send a POST request to fetch valid receipts
  const searchInput = document.getElementById("search-input");
  const searchValues = searchInput.value.split(' ');
  const route = !isSearch? 'receipt-valid' : 'search-valid-receipt';
  const reqBody = JSON.stringify(isSearch ? {lastname: searchValues[0], firstname: searchValues[1]?? ""} : {});
  fetch(host + route, {
    method: 'POST',
    headers: { 
          'Content-Type': 'application/json'
      },
      body: reqBody,
      credentials: 'include',
  })
  .then(response => {
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
  .then(data => {
    // Check if data is available; if not, exit the function
    if (!data) return;


    // If the properties are wrapped in an object { myProperties }
    const validReceipts = data;

    // Update the number of payments and display it
    !isSearch && setNumberOfPayments(validReceipts.length);
    !isSearch && showNumberOfPayments();

    const tableBody = document.getElementById("valid-receipts-table");
    if (tableBody) {
      tableBody.innerHTML = ''; // Clear existing rows

      // Iterate over the valid receipts and create table rows
      // Iterate over the invalid receipts and create table rows
      validReceipts.forEach((validReceipt) => {
        const paidMonthsArray = validReceipt.paid_months.split(', ');
        const formattedDate = new Date(paidMonthsArray[0]).toLocaleString('fr-FR', {
          month: 'long',
          year: 'numeric'
        }).replace(',', '').replace(/\//g, '-');
        
        // Format local date and set it into dateTimeInput
        const now = new Date(validReceipt.last_create_time);
        const formattedPaymentDateTime = now.toLocaleString('fr-FR', {
          day: 'numeric',
          month: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }).replace(',', '').replace(/\//g, '-');
        
        // Create a new table row
        const row = document.createElement('tr');
        row.dataset.payment_ids = validReceipt.payment_ids;
        row.innerHTML = `
              <td>${formattedPaymentDateTime}</td>
              <td>${validReceipt.ref}</td>
              <td>${validReceipt.address}</td>
              <td>${validReceipt.lastname} ${validReceipt.firstname.split(' ')[0]}</td>
              <td>${formattedDate}${ paidMonthsArray.length > 1 ? `,...` : ``}</td>
              <td>${validReceipt.method}</td>
              <td>${validReceipt.total_sumpayed}</td>
              <td>
                <a href="#" class="go-validate-receipt" data-receipt='${JSON.stringify(validReceipt)}'>
                  <span class="badge bg-success">Approuvé</span>
                </a>
              </td>
              <td>
                <div class="dropdown">
                    <i class='bx bx-dots-vertical-rounded toggle-dropdown'></i>
                    <div class="dropdown-content">
                        <i class='bx bx-trash delete-icon' data-payment_ids="${validReceipt.payment_ids}"></i>
                    </div>
                </div>
              </td>
        `;
        tableBody.appendChild(row);
      });
      addDropdownsListenerReceiptTable("valid-receipts-table");

    } else {
    }
  })
  .catch((error) => {
    // Log error if fetching fails
    window.location.href = ownerError;
  });
}
