
function setNumberOfPayments(numberOfPayments) {
  localStorage.setItem('numberOfPayments', numberOfPayments);
}

function setUnpaidMonths(unpaidMonths) {
  localStorage.setItem('unpaidMonths', unpaidMonths);
}

function setUnpaidMonthsCount(unpaidMonthsCount) {
  localStorage.setItem('unpaidMonthsCount', unpaidMonthsCount);
}

function setLastPayedMonth(lastPayedMonth) {
  localStorage.setItem('lastPayedMonth', lastPayedMonth);
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
  const unpaidMonths = localStorage.getItem('unpaid-months');
  if (unpaidMonths == 'undefined') return 0;
  return unpaidMonths;
}

function getUnpaidMonthsCount() {
  console.log("ca marche bien");
  const unpaidMonthsCount = localStorage.getItem('unpaid-months-count');
  if (unpaidMonthsCount == 'undefined') return 0;
  return unpaidMonthsCount;
}

function getLastPayedMonth() {
  console.log("ca marche bien");
  const lastPayedMonth = localStorage.getItem('last-payed-month');
  if (lastPayedMonth == 'undefined') return 0;
  return lastPayedMonth;
}

function getNextPaymentDate() {
  console.log("ca marche bien");
  const nextPaymentDate = localStorage.getItem('next-payment-date');
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
  unpaidMonthsCount.textContent = getUnpaidMonthsCount();
}

function showlastPaymentDate() {
  const lastPaymentDate = document.getElementById('last-payment-date');
  lastPaymentDate.textContent = getLastPayedMonth();
}

function shownextPaymentDate() {
  const nextPaymentDate = document.getElementById('next-payment-date');
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
  .then(response => response.json())
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
        row.innerHTML = `
              <td>${formattedDate}</td>
              <td>${validReceipt.sumpayed}</td>
              <td>
                <a href="#" class="govalidreceipt" data-receipt='${JSON.stringify(validReceipt)}'>
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

        const toggleDropdowns = document.querySelectorAll('.toggle-dropdown');
        toggleDropdowns.forEach(toggle => {
          toggle.addEventListener('click', function() {
            const dropdown = this.closest('.dropdown');
            dropdown.classList.toggle('show'); // Afficher ou masquer le dropdown
          });
        });

        // Fermer le dropdown si on clique en dehors
        window.addEventListener('click', function(event) {
          if (!event.target.matches('.toggle-dropdown')) {
            const dropdowns = document.querySelectorAll('.dropdown');
            dropdowns.forEach(dropdown => {
              dropdown.classList.remove('show');
            });
          }
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
      let lastPayedMonthTypeDate = new Date(); // valiReceipts[0].create_time 
      const lastPayedMonth =  lastPayedMonthTypeDate.toLocaleString('fr-FR', 
        {day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
      

      setLastPayedMonth(lastPayedMonth);
      let nextPaymentDate;
      const tenantCreationDay = new Date(localStorage.getItem('createTime')).getDate();
      if (lastPayedMonthTypeDate < unpaidMonths[unpaidMonths.length - 1]) {
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
        const nextMonth = new Date(lastPayedMonthTypeDate);

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
      setUnpaidMonthsCount(unpaidMonths.length);
      setUnpaidMonths(JSON.stringify(unpaidMonths));

      showlastPaymentDate();
      shownextPaymentDate();
      showUnpaidMonthsCount();

    } else {
      console.error("Element with ID 'receiptsTable' not found.");
    }
  })
  .catch((error) => console.error('Error fetching receipts:', error));
}
