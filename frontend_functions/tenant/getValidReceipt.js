

function setNumberOfPayments(numberOfPayments) {
  localStorage.setItem('numberOfPayments', numberOfPayments);
}

function getNumberOfPayments() {
  console.log("ca marche bien");
  if (localStorage.getItem('numberOfPayments') == 'undefined') return 0;
  return localStorage.getItem('numberOfPayments');
}

function showNumberOfPayments() {
  const totalPayments = document.getElementById('totalPayments');
  totalPayments.textContent = getNumberOfPayments();

}

function getMonthsBetween(startDate, endDate) {
  const months = [];
  let current = new Date(startDate);
  while (current <= endDate) {
    months.push(new Date(current));
    current.setMonth(current.getMonth() + 1);
  }
  return months;
}

function getValidReceiptsRequest() {
    let token = localStorage.getItem('accessTokenTenant');
    fetch(hostTenant + 'receipt_valid', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
    })
    .then(response => response.json())
    .then(data => {
      console.log("data received:", data); // Log les données reçues

      // Si les propriétés sont enveloppées dans un objet { myProperties }
      const valiReceipts = data;

      setNumberOfPayments(valiReceipts.length);
      showNumberOfPayments();

      const tableBody = document.getElementById("receiptsTable");
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
                <td>
                ${validReceipt.sumpayed}
                </td>
                <td>
                  <a href="#" class="govalidreceipt" data-receipt='${JSON.stringify(validReceipt)}'>
                    <span class="badge bg_seccuss">Approuvé</span>
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
      const latestReceiptDate = new Date(valiReceipts[0].monthpayed);
      const currentDate = new Date();
      const months = getMonthsBetween(latestReceiptDate, currentDate);
      console.log("Months between:", months);
      } else {
        console.error("Element with ID 'tenantspropertiesTable' not found.");
      }
    })
    .catch((error) => console.error('Error fetching tenantsproperties:', error));
  }



