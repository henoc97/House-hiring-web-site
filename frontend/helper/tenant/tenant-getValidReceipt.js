/**
 * Stores the number of payments in local storage.
 * @param {number} numberOfPayments - The number of payments to store.
 */
function setNumberOfPayments(numberOfPayments) {
  localStorage.setItem('numberOfPayments', numberOfPayments);
}

/**
 * Stores the unpaid months in local storage.
 * @param {Array} unpaidMonths - The unpaid months to store.
 */
function setUnpaidMonths(unpaidMonths) {
  localStorage.setItem('unpaidMonths', unpaidMonths);
}

/**
 * Stores the count of unpaid months in local storage.
 * @param {number} unpaidMonthsCount - The count of unpaid months to store.
 */
function setUnpaidMonthsCount(unpaidMonthsCount) {
  localStorage.setItem('unpaidMonthsCount', unpaidMonthsCount);
}

/**
 * Stores the last payment date in local storage.
 * @param {string} lastPaymentDate - The last payment date to store.
 */
function setLastPaymentDate(lastPaymentDate) {
  localStorage.setItem('lastPaymentDate', lastPaymentDate);
}

/**
 * Stores the next payment date in local storage.
 * @param {string} nextPaymentDate - The next payment date to store.
 */
function setNextPaymentDate(nextPaymentDate) {
  localStorage.setItem('nextPaymentDate', nextPaymentDate);
}

/**
 * Retrieves the number of payments from local storage.
 * @returns {number} - The number of payments, or 0 if not found.
 */
function getNumberOfPayments() {
  const numberOfPayments = localStorage.getItem('numberOfPayments');
  if (numberOfPayments === null) return 0;
  return parseInt(numberOfPayments, 10);
}

/**
 * Retrieves the unpaid months from local storage.
 * @returns {Array} - The unpaid months, or an empty array if not found.
 */
function getUnpaidMonths() {
  const unpaidMonths = localStorage.getItem('unpaidMonths'); 
  if (unpaidMonths === '') return [];
  return JSON.parse(unpaidMonths);
}

/**
 * Retrieves the count of unpaid months from local storage.
 * @returns {number} - The count of unpaid months, or 0 if not found.
 */
function getUnpaidMonthsCount() {
  const unpaidMonthsCount = localStorage.getItem('unpaidMonthsCount');
  if (unpaidMonthsCount === null) return 0;
  return parseInt(unpaidMonthsCount, 10);
}

/**
 * Retrieves the last payment date from local storage.
 * @returns {string} - The last payment date, or an empty string if not found.
 */
function getLastPaymentDate() {
  const lastPaymentDate = localStorage.getItem('lastPaymentDate');
  if (lastPaymentDate === null) return '--';
  return lastPaymentDate;
}

/**
 * Retrieves the next payment date from local storage.
 * @returns {string} - The next payment date, or an empty string if not found.
 */
function getNextPaymentDate() {
  const nextPaymentDate = localStorage.getItem('nextPaymentDate');
  if (nextPaymentDate === null) return '';
  return nextPaymentDate;
}

/**
 * Displays the number of payments in the designated HTML element.
 */
function showNumberOfPayments() {
  const totalPayments = document.getElementById('total-payments');
  totalPayments.textContent = getNumberOfPayments();
}

/**
 * Displays the unpaid months in the designated HTML element.
 */
// function showUnpaidMonths() {
//   const unpaidMonths = document.getElementById('unpaid-months');
//   unpaidMonths.textContent = getUnpaidMonths();
// }

/**
 * Displays the count of unpaid months in the designated HTML element.
 */
function showUnpaidMonthsCount() {
  const unpaidMonthsCount = document.getElementById('unpaid-months-count');
  unpaidMonthsCount.textContent = getUnpaidMonthsCount();
}

/**
 * Displays the last payment date in the designated HTML element.
 */
function showLastPaymentDate() {
  const lastPaymentDate = document.getElementById('last-payment-date');
  lastPaymentDate.textContent = getLastPaymentDate();
}

/**
 * Displays the next payment date in the designated HTML element.
 */
function showNextPaymentDate() {
  const nextPaymentDate = document.getElementById('next-payment-date');
  nextPaymentDate.textContent = getNextPaymentDate();
}

/**
 * Fetches valid receipts from the server and updates the UI accordingly.
 */
function getValidReceiptsRequest() {

  fetch(hostTenant + 'receipt-valid', {
    method: 'POST',
    headers: { 
          'Content-Type': 'application/json'
      },
      credentials: 'include',
  })
  .then(response => {
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        window.location.href = tenantLogSignURL;
      }
      window.location.href = tenantError;
      throw new Error('HTTP error ' + response.status);
    }
    return response.json();
  })
  .then(data => {

    const valiReceipts = data;


    setNumberOfPayments(valiReceipts.length);
    showNumberOfPayments();


    let nextPaymentDate = new Date("1990-01-01");
    const tableBody = document.getElementById("receipts-table");
    if (tableBody) {
      valiReceipts.forEach((validReceipt) => {
        const paidMonthsArray = validReceipt.paid_months.split(', ');
        const formattedDate = new Date(paidMonthsArray[0]).toLocaleString('fr-FR', {
          month: 'long',
          year: 'numeric'
        }).replace(',', '').replace(/\//g, '-');
        const formattedDate2 = new Date(paidMonthsArray[paidMonthsArray.length - 1])
        
        
        // Format local date and set it into dateTimeInput
        const lastPaymentDate = new Date(validReceipt.last_create_time);
        const formattedPaymentDateTime = lastPaymentDate.toLocaleString('fr-FR', {
          day: 'numeric',
          month: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }).replace(',', '').replace(/\//g, '-');

        const row = document.createElement('tr');
        row.dataset.payment_ids = validReceipt.payment_ids;
        row.innerHTML = `
              <td>${formattedPaymentDateTime}</td>
              <td>${validReceipt.ref}</td>
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
        // last month paid
        if (formattedDate2 > nextPaymentDate) nextPaymentDate = formattedDate2;
      });

      // Format local date and set it into dateTimeInput
      const lastPaymentDate2 = new Date(valiReceipts[valiReceipts.length - 1].last_create_time);
      const formattedlastPaymentDate2 = lastPaymentDate2.toLocaleString('fr-FR', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      }).replace(',', '').replace(/\//g, '-');

      setLastPaymentDate(formattedlastPaymentDate2);
      showLastPaymentDate();

      const tenantCreationDay = new Date(localStorage.getItem('createTime')).getDate();
      nextPaymentDate.setDate(tenantCreationDay);
      // Ajust
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
      const formattedNextPaymentDate = nextPaymentDate
        .toLocaleString('fr-FR', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
      }).replace(',', '').replace(/\//g, '-');

      setUnpaidMonthsCount(valiReceipts[valiReceipts.length - 1].unpaid_months_count);
      showUnpaidMonthsCount();
      
      setNextPaymentDate(formattedNextPaymentDate);
      showNextPaymentDate();
    }
  })
  .catch(error => {
    window.location.href = tenantError;
  });
}
