

function addUnvalidReceipt(unvalidReceipt) {
  const tableBody = document.getElementById("receipts-table");
  const formattedDate = new Date(unvalidReceipt.monthpayed).toLocaleString('fr-FR', {
    month: 'long',
    year: 'numeric'
  }).replace(',', '').replace(/\//g, '-');
  console.log("unvaliReceipts data:", unvalidReceipt); // Log chaque propriété
  const row = document.createElement('tr');
  row.dataset.id = unvalidReceipt.id;
  row.innerHTML = `
        <td>${formattedDate}</td>
        <td>
        ${unvalidReceipt.sumpayed}
        </td>
        <td>
          <span class="badge bg-danger">Non approuvé</span>
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
  tableBody.insertBefore(row, tableBody.firstChild);

  addDropdownsListener(); // Assure-toi que cette fonction est correctement définie pour gérer les nouveaux éléments
}

function getUnvalidReceiptsRequest() {
  let token = localStorage.getItem('accessTokenTenant');
  fetch(hostTenant + 'receipt-unValid', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
  })
  .then(response => {
    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            return renewAccessToken().then(() => getUnvalidReceiptsRequest());
        }
        // Redirection en cas d'autres erreurs HTTP (par exemple 500)
        window.location.href = tenantError;
        throw new Error('HTTP error ' + response.status); // Lancer une erreur pour déclencher le .catch
    }
    return response.json();
  })
  .then(data => {
    if (!data) return; // Si data est undefined (en cas de redirection), arrêter l'exécution

    console.log("data received:", data); // Log les données reçues

    const unvaliReceipts = data;
    getValidReceiptsRequest();
    const tableBody = document.getElementById("receipts-table");
    if (tableBody) {
      tableBody.innerHTML = ''; // Clear existing rows

      unvaliReceipts.forEach((unvalidReceipt) => {
      addUnvalidReceipt(unvalidReceipt);
      });
      addDropdownsListener();
      // Quand l'utilisateur clique sur une icône de suppression
      document.querySelectorAll('.delete-icon').forEach(icon => {
        icon.addEventListener('click', function() {
          const receiptId = this.dataset.id;
          deleteReceiptTenant(receiptId);
        });
      });
    } else {
      console.error("Element with ID 'unvalidReceipts' not found.");
    }
  })
  .catch((error) => {
    window.location.href = tenantError;
    console.error('Error fetching unvaliReceipts:', error);
  });
}

function addDropdownsListener() {
  const toggleDropdowns = document.querySelectorAll('.toggle-dropdown');

  console.log('Dropdowns trouvés:', toggleDropdowns.length);

  toggleDropdowns.forEach(toggle => {
    toggle.addEventListener('click', function(event) {
      console.log('Dropdown cliqué:', this);
      const dropdown = this.closest('.dropdown');
      dropdown.classList.toggle('show'); // Afficher ou masquer le dropdown
      event.stopPropagation(); // Empêche le clic de se propager et fermer immédiatement le dropdown
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
}

function deleteReceiptTenant(receiptId) {
  let token = localStorage.getItem('accessTokenTenant');
  fetch(hostTenant + "delete-receipt", {
      method: 'POST',
      headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "id": receiptId })
  })
  .then(response => {
    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            return renewAccessToken().then(() => deleteReceiptTenant(receiptId));
        }
        // Redirection en cas d'autres erreurs HTTP (par exemple 500)
        window.location.href = tenantError;
        throw new Error('HTTP error ' + response.status); // Lancer une erreur pour déclencher le .catch
    }
    return response.json();
  })
  .then(() => {
      const row = document.querySelector(`tr[data-id="${receiptId}"]`);
      if (row) {
          row.remove(); // Supprime la ligne du tableau
      }
  })
  .catch(error => {
    window.location.href = tenantError;
    console.error('Error deleting receipt:', error)});
}