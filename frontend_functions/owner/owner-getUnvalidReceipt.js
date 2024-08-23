

function getUnvalidReceiptsRequest() {
  let token = localStorage.getItem('accessToken');
  fetch(host + 'receipt-unValid', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
  })
  .then(response => {
    if (!response.ok && (response.status === 401 || response.status === 403)) {
      alert("problem")
      return renewAccessToken().then(() => getUnvalidReceiptsRequest());
    }
    return response.json(); // Convertir la réponse en JSON si le statut n'est pas 403
  })
  .then(data => {
    if (!data) return; // Si data est undefined (en cas de redirection), arrêter l'exécution

    console.log("data received:", data); // Log les données reçues

    const unvaliReceipts = data;
    // getValidReceiptsRequest();
    const tableBody = document.getElementById("unvalid-receipts-table");
    if (tableBody) {
      tableBody.innerHTML = ''; // Clear existing rows

      unvaliReceipts.forEach((unvalidReceipt) => {
        const formattedDate = new Date(unvalidReceipt.monthpayed).toLocaleString('fr-FR', {
          month: 'long',
          year: 'numeric'
        }).replace(',', '').replace(/\//g, '-');
        console.log("unvaliReceipts data:", unvalidReceipt); // Log chaque propriété
        const row = document.createElement('tr');
        row.dataset.id = unvalidReceipt.id;
        row.innerHTML = `
              <td>${unvalidReceipt.lastname} ${unvalidReceipt.firstname.split(' ')[0]}</td>
              <td>${formattedDate}</td>
              <td>
                ${unvalidReceipt.address}
              </td>
              <td>
              ${unvalidReceipt.sumpayed}
              </td>
              <td>
                <a href="#" class="go-validate-receipt" data-receipt='${JSON.stringify(unvalidReceipt)}'>
                  <span class="badge bg-danger">Non approuvé</span>
                </a>
              </td>
              <td>
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
      addDropdownListeners();
      // Quand l'utilisateur clique sur une icône de suppression
      document.querySelectorAll('.delete-icon').forEach(icon => {
        icon.addEventListener('click', function() {
          const receiptId = this.dataset.id;
          deleteReceipt(receiptId);
        });
      });

    } else {
      console.error("Element with ID 'unvalidReceipts' not found.");
    }
  })
  .catch((error) => {
    window.location.href = ownerError;
    console.error('Error fetching unvaliReceipts:', error);
  });
}



function deleteReceipt(receiptId) {
  let token = localStorage.getItem('accessToken');
  fetch(host + "delete-receipt", {
      method: 'POST',
      headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "id": receiptId })
  })
  .then(response => {
    if (!response.ok && (response.status === 401 || response.status === 403)) {
      alert("problem")
      return renewAccessToken().then(() => deleteReceipt(receiptId));
    }
    response.json()})
  .then(() => {
      const row = document.querySelector(`tr[data-id="${receiptId}"]`);
      if (row) {
          row.remove(); // Supprime la ligne du tableau
      }
  })
  .catch(error => {
    window.location.href = ownerError;
    console.error('Error deleting receipt:', error)});
}