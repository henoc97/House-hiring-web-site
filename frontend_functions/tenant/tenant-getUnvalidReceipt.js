

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
    if (response.status === 403) {
      // Si l'utilisateur n'est pas autorisé, redirigez-le vers la page de connexion
      // window.location.href = ownerLogSignURL;
      return; // Sortir de la promesse pour éviter d'exécuter le reste du code
    }
    return response.json(); // Convertir la réponse en JSON si le statut n'est pas 403
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
        const formattedDate = new Date(unvalidReceipt.monthpayed).toLocaleString('fr-FR', {
          month: 'long',
          year: 'numeric'
        }).replace(',', '').replace(/\//g, '-');
        console.log("unvaliReceipts data:", unvalidReceipt); // Log chaque propriété
        const row = document.createElement('tr');
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
    } else {
      console.error("Element with ID 'unvalidReceipts' not found.");
    }
  })
  .catch((error) => {
    alert(error.message);
    console.error('Error fetching unvaliReceipts:', error);
  });
}
