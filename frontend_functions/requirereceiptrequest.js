



function requireRecieptRequest(){

  let id_tenant_property = document.getElementById('tenantsProperties-option').value;
  let sumpayed = document.getElementById('sumpayed').value;
  let months = $('#months').val();
  //let monthpayed = months.split(',');
  //console.log(id_tenant_property, sumpayed, monthpayed);
  console.log("months", months);
  
  let token = localStorage.getItem('accessToken');

  months.forEach(month => {

    fetch(host + 'require_receipt', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body : JSON.stringify({
        "id_tenant_property": id_tenant_property,
        "sumpayed":sumpayed / months.length,
        "monthpayed":month.trim()
      })
    })
    .then(response => {
        if (!response.ok && (response.status === 401 || response.status === 403)) {
            alert("problem")
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

  $('#months').val(null).trigger('change');
   
}




