/**
 * Updates tenant information by sending a POST request to the server with the updated data.
 * Retrieves the updated data from form fields, sends it to the server, and handles the response.
 * Updates the form fields with the returned data and alerts the user upon success.
 * Redirects to an error page in case of HTTP errors or failures.
 * @function
 * @returns {void}
 */
function updateTenant() {
    const updatedData = {
        lastname: document.getElementById('tenant-lastname').value,
        firstname: document.getElementById('tenant-firstname').value,
        contactmoov: document.getElementById('tenant-contact-moov').value,
        contacttg: document.getElementById('tenant-contact-tg').value,
        date: new Date(localStorage.getItem('createTime')).toISOString().slice(0, 19).replace('T', ' ')
    };
        
    fetch(hostTenant + "update-tenant", {  
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
      },
      credentials: 'include',
        body: JSON.stringify(updatedData)
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                window.location.href = tenantLogSignURL;
            }
            // Redirect in case of other HTTP errors (e.g., 500)
            window.location.href = tenantError;
            throw new Error('HTTP error ' + response.status); // Throw an error to trigger the .catch block
        }
        return response.json();
    })
    .then(data => {
        // console.log('Updated data:', JSON.stringify(data));
        document.getElementById('tenant-lastname').value = data.lastname;
        document.getElementById('tenant-firstname').value = data.firstname;
        document.getElementById('tenant-contact-moov').value = data.contactmoov;
        document.getElementById('tenant-contact-tg').value = data.contacttg;
        localStorage.setItem('createTime', data.create_time);
        alert("Modification réussie...");
    })
    .catch(error => {
        window.location.href = tenantError;
        // console.error('Error updating tenant:', error);
    });  
}
