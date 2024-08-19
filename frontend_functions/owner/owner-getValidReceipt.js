

function setNumberOfPayments(numberOfPayments) {
  localStorage.setItem('numberOfPayments', numberOfPayments);
}

function getNumberOfPayments() {
  console.log("ca marche bien");
  if (localStorage.getItem('numberOfPayments') == 'undefined') return 0;
  return localStorage.getItem('numberOfPayments');
}

function showNumberOfPayments() {
  const totalPayments = document.getElementById('total-payments');
  totalPayments.textContent = getNumberOfPayments();

}



function getValidReceiptsRequest() {
    let token = localStorage.getItem('accessToken');
    fetch(host + 'receipt-valid', {
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

      const tableBody = document.getElementById("valid-receipts-table");
      if (tableBody) {
        tableBody.innerHTML = ''; // Clear existing rows

        valiReceipts.forEach((validReceipt) => {
          console.log("valiReceipts data:", validReceipt); // Log chaque propriété
          const formattedDate = new Date(validReceipt.monthpayed).toLocaleString('fr-FR', {
            month: 'long',
            year: 'numeric'
          }).replace(',', '').replace(/\//g, '-');
          const row = document.createElement('tr');
          row.innerHTML = `
                <td>${validReceipt.lastname} ${validReceipt.firstname.split(' ')[0]}</td>
                <td>${formattedDate}</td>
                <td>
                    ${validReceipt.address}
                </td>
                <td>
                ${validReceipt.sumpayed}
                </td>
                <td>
                  <a href="#" class="go-validate-receipt" data-receipt='${JSON.stringify(validReceipt)}'>
                    <span class="badge bg-seccuss">Approuvé</span>
                  </a>
                </td>
          `;
          tableBody.appendChild(row);
        });
      } else {
        console.error("Element with ID 'valid-receipts-table' not found.");
      }
    })
    .catch((error) => console.error('Error fetching tenantsproperties:', error));
  }



