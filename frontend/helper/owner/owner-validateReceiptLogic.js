

function validateReceiptLogic() {
  let token = localStorage.getItem('accessToken');
  const toPay = (receiptData.sumpayed * validateReceiptPrice);
  if((getsold() - toPay) > 0){
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
          console.log('Redirecting to error page:', ownerError);
          window.location.href = ownerError;
          throw new Error('HTTP error ' + response.status); // Lancer une erreur pour déclencher le .catch
      }
      return response.json();
  })
    .then(data => {
      console.log(data);
      updateSoldRequest(toPay);
      window.location.href = ownerDashboardURL;
    })
    .catch(error => {
      console.log('Redirecting to error page:', ownerError);
      window.location.href = ownerError;
      console.error('Erreur:', error);
    });
  } else {
    alert(`solde insuffisant. Cette opération coute ${toPay} XOF`)
  }
}