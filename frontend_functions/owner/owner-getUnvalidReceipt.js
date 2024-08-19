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
        `;
        tableBody.appendChild(row);
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
