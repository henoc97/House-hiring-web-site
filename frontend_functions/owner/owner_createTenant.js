
function createTenantRequest(){

  if((getsold() - registerTenant) > 0){
    let id = document.getElementById('property-option').value;
    let lastname = document.getElementById('lastname').value;
    let firstname = document.getElementById('firstname').value;
    let contactmoov = document.getElementById('contactmoov').value;
    let contacttg = document.getElementById('contacttg').value;

    let token = localStorage.getItem('accessToken');

    fetch(host + 'createTenant', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body : JSON.stringify({
        "id": id,
        "lastname":lastname,
        "firstname":firstname,
        "contactmoov":contactmoov,
        "contacttg":contacttg
      })
    })
    .then(response => {
        if (!response.ok && (response.status === 401 || response.status === 403)) {
            alert("problem")
            return renewAccessToken().then(() => createTenantRequest());
        }
        return response.json();
    })
    .then(data => {
        updateSoldRequest(registerTenant);
        console.log(data);
        document.getElementById('tenant-form').reset();
        getTenantsPropertiesRequest(1);
        showNewSold();
    })
    .catch(error => {
        console.error('Erreur:', error);
        // window.location.href = ownerLogSignURL;
    });
  } else {
    alert('solde insuffisant. Cette opération coute 0.25€')
  }
  }