


function sendMessageRequest(){
    let message = document.getElementById('tenant-message').value;
    let token = localStorage.getItem('accessTokenTenant');
    fetch(hostTenant + 'sendMessage', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body : JSON.stringify({
            "message": message,
        })
    })
    .then(response => {
        if (!response.ok && (response.status === 401 || response.status === 403)) {
            alert("problem")
            return renewAccessToken().then(() => sendMessageRequest());
        }
        return response.json();
    })
    .then(data => {
        document.getElementById('message-form').reset();
        getMessagesRequest();
    })
    .catch(error => {
        console.error('Erreur:', error);
        // window.location.href = ownerLogSignURL;
    }); 
} 
