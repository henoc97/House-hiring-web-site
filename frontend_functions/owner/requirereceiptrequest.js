
function requireRecieptRequest() {
  let id_tenant_property = document.getElementById('tenantsProperties-option').value;
  let sumpayed = document.getElementById('sumpayed').value;
  let months = Array.from(document.getElementById('months').selectedOptions).map(option => option.value);
  
  if (months.length === 0) {
      alert("Veuillez sélectionner au moins un mois.");
      return;
  }

  alert("Mois sélectionnés : " + months.join(', ')); // Pour vérifier les mois sélectionnés

  let token = localStorage.getItem('accessToken');

  // Si le coût est réparti également entre les mois
  let costPerMonth = parseFloat(sumpayed) / months.length;

  months.forEach(month => {
      fetch(host + 'require_receipt', {
          method: 'POST',
          headers: {
              'Authorization': 'Bearer ' + token,
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              "id_tenant_property": id_tenant_property,
              "sumpayed": costPerMonth,
              "monthpayed": month.trim()
          })
      })
      .then(response => {
          if (!response.ok && (response.status === 401 || response.status === 403)) {
              alert("Problème d'authentification, tentative de renouvellement du token.");
              return renewAccessToken().then(() => requireRecieptRequest());
          }
          return response.json();
      })
      .then(data => {
          console.log(data);
          document.getElementById('receipt-form').reset();
      })
      .catch(error => {
          console.error('Erreur:', error);
          window.location.href = ownerLogSignURL;
      });
  });

  document.getElementById('months').selectedIndex = -1; // Réinitialiser la sélection
}