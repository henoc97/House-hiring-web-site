


function updateTenant() {
    
    const updatedData = {
        lastname : document.getElementById('tenant-lastname').value,
        firstname : document.getElementById('tenant-firstname').value,
        contactmoov : document.getElementById('tenant-contact-moov').value,
        contacttg : document.getElementById('tenant-contact-tg').value,
        date : new Date(localStorage.getItem('createTime')).toISOString().slice(0, 19).replace('T', ' ')
    };
    let token = localStorage.getItem('accessTokenTenant');
    fetch(hostTenant + "update-tenant", {  
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body : JSON.stringify(updatedData)
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                return renewAccessToken().then(() => updateTenant());
            }
            // Redirection en cas d'autres erreurs HTTP (par exemple 500)
            window.location.href = tenantError;
            throw new Error('HTTP error ' + response.status); // Lancer une erreur pour déclencher le .catch
        }
        return response.json();
      })
    .then(data => {
        console.log('Updated data : ' + JSON.stringify(data));
        document.getElementById('tenant-lastname').value = data.lastname;
        document.getElementById('tenant-firstname').value = data.firstname;
        document.getElementById('tenant-contact-moov').value = data.contactmoov;
        document.getElementById('tenant-contact-tg').value = data.contacttg;
        localStorage.setItem('createTime', data.create_time);
        alert("Modification réussie...")
    })
    .catch(error => {
        window.location.href = tenantError;
        console.error('Error updating property:', error)});  
}