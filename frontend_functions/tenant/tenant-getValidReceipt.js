
function setNumberOfPayments(numberOfPayments) {
  localStorage.setItem('numberOfPayments', numberOfPayments);
}

function setUnpaidMonths(unpaidMonths) {
  localStorage.setItem('unpaidMonths', unpaidMonths);
}

function setUnpaidMonthsCount(unpaidMonthsCount) {
  localStorage.setItem('unpaidMonthsCount', unpaidMonthsCount);
}

function setLastPaymentDate(lastPaymentDate) {
  localStorage.setItem('lastPaymentDate', lastPaymentDate);
}

function setNextPaymentDate(nextPaymentDate) {
  localStorage.setItem('nextPaymentDate', nextPaymentDate);
}

function getNumberOfPayments() {
  console.log("ca marche bien");
  const numberOfPayments = localStorage.getItem('numberOfPayments');
  if (numberOfPayments == 'undefined') return 0;
  return numberOfPayments;
}

function getUnpaidMonths() {
  console.log("ca marche bien");
  const unpaidMonths = localStorage.getItem('unpaidMonths');
  if (unpaidMonths == 'undefined') return 0;
  return unpaidMonths;
}

function getUnpaidMonthsCount() {
  console.log("ca marche bien");
  const unpaidMonthsCount = localStorage.getItem('unpaidMonthsCount');
  if (unpaidMonthsCount == 'undefined') return 0;
  return unpaidMonthsCount;
}

function getLastPaymentDate() {
  console.log("ca marche bien");
  const lastPaymentDate = localStorage.getItem('lastPaymentDate');
  if (lastPaymentDate == 'undefined') return 0;
  return lastPaymentDate;
}

function getNextPaymentDate() {
  console.log("ca marche bien");
  const nextPaymentDate = localStorage.getItem('nextPaymentDate');
  if (nextPaymentDate == 'undefined') return 0;
  return nextPaymentDate;
}

function showNumberOfPayments() {
  const totalPayments = document.getElementById('total-payments');
  totalPayments.textContent = getNumberOfPayments();
}

function showUnpaidMonths() {
  const unpaidMonths = document.getElementById('unpaid-months');
  unpaidMonths.textContent = getUnpaidMonths();
}

function showUnpaidMonthsCount() {
  const unpaidMonthsCount = document.getElementById('unpaid-months-count');
  console.log('unpaidMonthsCount : ' + JSON.stringify( getUnpaidMonthsCount()));
  unpaidMonthsCount.textContent = getUnpaidMonthsCount();
}

function showlastPaymentDate() {
  const lastPaymentDate = document.getElementById('last-payment-date');
  console.log('lastPaymentDate : ' + JSON.stringify(getLastPaymentDate()));
  lastPaymentDate.textContent = getLastPaymentDate();
}

function showNextPaymentDate() {
  const nextPaymentDate = document.getElementById('next-payment-date');
  console.log('nextPaymentDate : ' + JSON.stringify(getNextPaymentDate()));
  nextPaymentDate.textContent = getNextPaymentDate();
}

function getMonthsBetween(startDate, endDate) {
  const months = [];
  // Ajuster endDate pour ignorer le mois en cours
  const adjustedEndDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
  let current = new Date(startDate);
  current.setDate(1); // S'assurer de commencer au début du mois
  while (current < adjustedEndDate) {
    months.push(new Date(current));
    current.setMonth(current.getMonth() + 1);
  }
  return months;
}

function compareMonths(date1, date2) {
  return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth();
}

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
        // Redirection en cas d'autres erreurs HTTP (par exemple 500)
        window.location.href = tenantError;
        throw new Error('HTTP error ' + response.status); // Lancer une erreur pour déclencher le .catch
    }
    return response.json();
  })
  .then(data => {
    console.log("data received:", data); // Log les données reçues

    const valiReceipts = data;

    setNumberOfPayments(valiReceipts.length);
    showNumberOfPayments();

    const tableBody = document.getElementById("receipts-table");
    if (tableBody) {
      // tableBody.innerHTML = ''; // Clear existing rows

      valiReceipts.forEach((validReceipt) => {
        console.log("valiReceipts data:", validReceipt); // Log chaque propriété
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
                  <span class="badge bg-seccuss">Approuvé</span>
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
      addDropdownsListener();
      // Quand l'utilisateur clique sur une icône de suppression
      document.querySelectorAll('.delete-icon').forEach(icon => {
        icon.addEventListener('click', function() {
          const receiptId = this.dataset.id;
          deleteReceiptTenant(receiptId);
        });
      });

      // Calculer les mois de retard
      const currentDate = new Date();
      const generatedMonths = getMonthsBetween(createTime, currentDate);

      // Filtrer les mois qui n'ont pas été payés
      const unpaidMonths = generatedMonths.filter(generatedMonth => 
        !valiReceipts.some(validReceipt => compareMonths(new Date(validReceipt.monthpayed), generatedMonth))
      );

      console.log("Unpaid months:", unpaidMonths);
      unpaidMonths.forEach(unpaidMonth => {
        console.log(unpaidMonth.toLocaleString('fr-FR', { month: 'long', year: 'numeric' }));
      });
      console.log('Unpaid months : ' + unpaidMonths.length);
      console.log('valiReceipts : ' + valiReceipts + '  ' + valiReceipts.length);
      const tenantCreationDay = new Date(localStorage.getItem('createTime')).getDate();
      let nextPaymentDate;
      if (valiReceipts.length > 0) {

        let _lastPayedMonth = new Date(valiReceipts[0].monthpayed ); 
        let _lastPaymentDate = new Date(valiReceipts[0].create_time ); 
        const lastPaymentDate =  _lastPaymentDate.toLocaleString('fr-FR', 
          {day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
        
        setLastPaymentDate(lastPaymentDate);
        console.log('unpaidMonths1 : ' + unpaidMonths[unpaidMonths.length - 1]);
        console.log ('lastPayedMonthTypeDate1 : ' + _lastPayedMonth)
        if (_lastPayedMonth < unpaidMonths[unpaidMonths.length - 1]) {
          // Créer une copie de la dernière date du mois non payé
          const lastUnpaidMonth = new Date(unpaidMonths[unpaidMonths.length - 1]);
  
          // Définir le jour du mois
          lastUnpaidMonth.setDate(tenantCreationDay);
  
          // Avancer d'un mois
          lastUnpaidMonth.setMonth(lastUnpaidMonth.getMonth() + 1);
  
          // Formater la date
          nextPaymentDate = lastUnpaidMonth.toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }).replace(/\//g, '-');
        } else {
          // Créer une copie de la date du dernier paiement
          const nextMonth = new Date(_lastPayedMonth);
  
          // Avancer d'un mois
          nextMonth.setMonth(nextMonth.getMonth() + 1);
  
          // Définir le jour du mois
          nextMonth.setDate(tenantCreationDay);
  
          // Formater la date
          nextPaymentDate = nextMonth.toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }).replace(/\//g, '-');
        }
        setNextPaymentDate(nextPaymentDate);
        console.log('nextPaymentDate : ' + JSON.stringify(nextPaymentDate));
        setUnpaidMonthsCount(unpaidMonths.length);
        console.log('unpaidMonths.length : ' + JSON.stringify(unpaidMonths.length));
        setUnpaidMonths(JSON.stringify(unpaidMonths));
        console.log('JSON.stringify(unpaidMonths) : ' + JSON.stringify(unpaidMonths));
      } else {
        const tenantCreationDate = new Date(localStorage.getItem('createTime'));
        tenantCreationDate.setMonth(tenantCreationDate.getMonth() + 1);
  
          // Formater la date
          nextPaymentDate = tenantCreationDate.toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }).replace(/\//g, '-');
          setLastPaymentDate("--");
          setNextPaymentDate(nextPaymentDate);
      }

      showlastPaymentDate();
      showNextPaymentDate();
      showUnpaidMonthsCount();

    } else {
      console.error("Element with ID 'receiptsTable' not found.");
    }
  })
  .catch((error) => {
    window.location.href = tenantError;
    console.error('Error fetching receipts:', error)});
}
