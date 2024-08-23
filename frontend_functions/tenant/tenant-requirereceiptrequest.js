
function requireRecieptRequest() {
  let sumpayed = document.getElementById('receipt-sumpayed').value;
  let months = Array.from(document.getElementById('receipt-months').selectedOptions).map(option => option.value);
  
  if (months.length === 0) {
      alert("Veuillez sélectionner au moins un mois.");
      return;
  }

  let token = localStorage.getItem('accessTokenTenant');

  // Si le coût est réparti également entre les mois
  let costPerMonth = parseFloat(sumpayed) / months.length;

  months.forEach(month => {
      fetch(hostTenant + 'require-receipt', {
          method: 'POST',
          headers: {
              'Authorization': 'Bearer ' + token,
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              "sumpayed": costPerMonth,
              "monthpayed": month.trim()
          })
      })
      .then(response => {
          if (!response.ok && (response.status === 401 || response.status === 403)) {
              return renewAccessToken().then(() => requireRecieptRequest());
          }
          return response.json();
      })
      .then(unvalidReceipt => {
            console.log(unvalidReceipt);
            document.getElementById('receipt-form').reset();
            // getUnvalidReceiptsRequest();
            addUnvalidReceipt(unvalidReceipt);
            // addDropdownsListener();
      })
      .catch(error => {
          window.location.href = tenantError;
          console.error('Erreur:', error);
      });
  });

  document.getElementById('receipt-months').selectedIndex = -1; // Réinitialiser la sélection
}
