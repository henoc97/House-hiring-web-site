


function createPropertyRequest(){

  if((getsold() - registerHomePrice) > 0){
    let address = document.getElementById('address').value;
    let description = document.getElementById('description').value;
    let cost = document.getElementById('cost').value;

    let token = localStorage.getItem('accessToken');

    fetch(host + 'createProperties', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body : JSON.stringify({
        "address": address,
        "description": description,
        "cost": cost
      })
    })
    .then(response => {
        if (!response.ok && (response.status === 401 || response.status === 403)) {
            alert("problem")
            return renewAccessToken().then(() => createPropertyRequest());
        }
        return response.json();
    })
    .then(data => {
        updateSoldRequest(registerHomePrice);
        console.log(data);
        document.getElementById('property-form').reset();
        getPropertiesRequest(1);
        showNewSold();
    })
    .catch(error => {
        console.error('Erreur:', error);
        window.location.href = ownerLogSignURL;
    });
  } else {
    alert('solde insuffisant. Cette opération coute 0.5€')
  }  
}