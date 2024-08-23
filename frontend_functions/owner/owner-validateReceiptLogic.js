

function validateReceiptLogic() {
  let token = localStorage.getItem('accessToken');
  if((getsold() - validateReceiptPrice) > 0){
    fetch(host + 'validate-receipt', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body : JSON.stringify({
      "id": receiptData.id,
    })
    })
    .then(response => {
      if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
              return renewAccessToken().then(() => validateReceiptLogic());
          }
          // Redirection en cas d'autres erreurs HTTP (par exemple 500)
          window.location.href = ownerError;
          throw new Error('HTTP error ' + response.status); // Lancer une erreur pour déclencher le .catch
      }
      return response.json();
  })
    .then(data => {
      console.log(data);
      updateSoldRequest(validateReceiptPrice);
      window.location.href = ownerDashboardURL;
    })
    .catch(error => {
      console.error('Erreur:', error);
      window.location.href = ownerError;
    });
  } else {
    alert('solde insuffisant. Cette opération coute 0.25€')
  }
}