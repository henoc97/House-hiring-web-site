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
  // console.log("It works well");
  const numberOfPayments = localStorage.getItem('numberOfPayments');
  if (numberOfPayments === null) return 0;
  return parseInt(numberOfPayments, 10);
}

/**
 * Retrieves the unpaid months from local storage.
 * @returns {Array} - The unpaid months, or an empty array if not found.
 */
function getUnpaidMonths() {
  // console.log("It works well");
  const unpaidMonths = localStorage.getItem('unpaidMonths'); 
  // console.log("unpaidMonths : {" + unpaidMonths.length + "}");
  if (unpaidMonths === '') return [];
  return JSON.parse(unpaidMonths);
}

/**
 * Retrieves the count of unpaid months from local storage.
 * @returns {number} - The count of unpaid months, or 0 if not found.
 */
function getUnpaidMonthsCount() {
  // console.log("It works well");
  const unpaidMonthsCount = localStorage.getItem('unpaidMonthsCount');
  if (unpaidMonthsCount === null) return 0;
  return parseInt(unpaidMonthsCount, 10);
}

/**
 * Retrieves the last payment date from local storage.
 * @returns {string} - The last payment date, or an empty string if not found.
 */
function getLastPaymentDate() {
  // console.log("It works well");
  const lastPaymentDate = localStorage.getItem('lastPaymentDate');
  if (lastPaymentDate === null) return '--';
  return lastPaymentDate;
}

/**
 * Retrieves the next payment date from local storage.
 * @returns {string} - The next payment date, or an empty string if not found.
 */
function getNextPaymentDate() {
  // console.log("It works well");
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
  // console.log('unpaidMonthsCount : ' + JSON.stringify(getUnpaidMonthsCount()));
  unpaidMonthsCount.textContent = getUnpaidMonthsCount();
}

/**
 * Displays the last payment date in the designated HTML element.
 */
function showLastPaymentDate() {
  const lastPaymentDate = document.getElementById('last-payment-date');
  // console.log('lastPaymentDate : ' + JSON.stringify(getLastPaymentDate()));
  lastPaymentDate.textContent = getLastPaymentDate();
}

/**
 * Displays the next payment date in the designated HTML element.
 */
function showNextPaymentDate() {
  const nextPaymentDate = document.getElementById('next-payment-date');
  // console.log('nextPaymentDate : ' + JSON.stringify(getNextPaymentDate()));
  nextPaymentDate.textContent = getNextPaymentDate();
}

/**
 * Gets an array of months between two dates, excluding the current month.
 * @param {Date} startDate - The start date.
 * @param {Date} endDate - The end date.
 * @returns {Array<Date>} - The array of months between the two dates.
 */
function getMonthsBetween(startDate, endDate) {
  const months = [];
  const adjustedEndDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
  let current = new Date(startDate);
  current.setDate(1);
  while (current < adjustedEndDate) {
    months.push(new Date(current));
    current.setMonth(current.getMonth() + 1);
  }
  return months;
}

/**
 * Compares two dates to determine if they are in the same month and year.
 * @param {Date} date1 - The first date.
 * @param {Date} date2 - The second date.
 * @returns {boolean} - True if the dates are in the same month and year, otherwise false.
 */
function compareMonths(date1, date2) {
  return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth();
}

/**
 * Fetches valid receipts from the server and updates the UI accordingly.
 */
function getValidReceiptsRequest() {
  let token = localStorage.getItem('accessTokenTenant');
  let createTime = new Date(localStorage.getItem('createTime'));

  fetch(hostTenant + 'receipt-valid', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
  })
  .then(response => {
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return renewAccessToken().then(() => getValidReceiptsRequest());
      }
      window.location.href = tenantError;
      throw new Error('HTTP error ' + response.status);
    }
    return response.json();
  })
  .then(data => {
    // console.log("data received:", data);

    const valiReceipts = data;

    setNumberOfPayments(valiReceipts.length);
    showNumberOfPayments();

    const tableBody = document.getElementById("receipts-table");
    if (tableBody) {
      valiReceipts.forEach((validReceipt) => {
        // console.log("valiReceipts data:", validReceipt);
        const formattedDate = new Date(validReceipt.monthpayed).toLocaleString('fr-FR', {
          month: 'long',
          year: 'numeric'
        }).replace(',', '').replace(/\//g, '-');
        const row = document.createElement('tr');
        row.dataset.id = validReceipt.id;
        row.innerHTML = `
              <td>${formattedDate}</td>
              <td>${validReceipt.sumpayed}</td>
              <td>
                <a href="#" class="go-validate-receipt" data-receipt='${JSON.stringify(validReceipt)}'>
                  <span class="badge bg-seccuss">Apprové</span>
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

      const currentDate = new Date();
      const generatedMonths = getMonthsBetween(createTime, currentDate);

      const unpaidMonths = generatedMonths.filter(generatedMonth => 
        !valiReceipts.some(validReceipt => compareMonths(new Date(validReceipt.monthpayed), generatedMonth))
      );

      // console.log("Unpaid months:", unpaidMonths);
      unpaidMonths.forEach(unpaidMonth => {
        // console.log(unpaidMonth.toLocaleString('fr-FR', { month: 'long', year: 'numeric' }));
      });
      // console.log('Unpaid months : ' + unpaidMonths.length);
      // console.log('valiReceipts : ' + valiReceipts + '  ' + valiReceipts.length);
      const tenantCreationDay = new Date(localStorage.getItem('createTime')).getDate();
      let nextPaymentDate;
      if (valiReceipts.length > 0) {
        let _lastPayedMonth = new Date(valiReceipts[0].monthpayed ); 
        let _lastPaymentDate = new Date(valiReceipts[0].create_time ); 
        const lastPaymentDate =  _lastPaymentDate.toLocaleString('fr-FR', 
          {day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
        
        setLastPaymentDate(lastPaymentDate);
        // console.log('unpaidMonths1 : ' + unpaidMonths[unpaidMonths.length-1]);

        if (unpaidMonths.length > 0) {
          // console.log(unpaidMonths[unpaidMonths.length-1].toLocaleString('fr-FR', { month: 'long', year: 'numeric' }));
          nextPaymentDate = unpaidMonths[unpaidMonths.length-1];
          nextPaymentDate.setDate(tenantCreationDay); 
          nextPaymentDate = nextPaymentDate.toLocaleString('fr-FR', 
            {day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
          // console.log('nextPaymentDate : ' + nextPaymentDate);
        } else {
          nextPaymentDate = _lastPayedMonth;
          nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
          nextPaymentDate.setDate(tenantCreationDay); 
          nextPaymentDate = nextPaymentDate.toLocaleString('fr-FR', 
            {day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
          // console.log('nextPaymentDate2 : ' + nextPaymentDate);
        }
      } else {
        nextPaymentDate = createTime;
        nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
        nextPaymentDate.setDate(tenantCreationDay); 
        nextPaymentDate = nextPaymentDate.toLocaleString('fr-FR', 
          {day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
        // console.log('nextPaymentDate3 : ' + nextPaymentDate);
      }
      setNextPaymentDate(nextPaymentDate);
      showNextPaymentDate();
      setUnpaidMonths(unpaidMonths);
      setUnpaidMonthsCount(unpaidMonths.length);
      // showUnpaidMonths();
      showUnpaidMonthsCount();
      showLastPaymentDate();
    }
  })
  .catch(error => {
    // console.error('Error:', error);
    window.location.href = tenantError;
  });
}
