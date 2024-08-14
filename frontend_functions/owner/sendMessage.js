


function sendMessageRequest(tenantId){
    let message = document.getElementById('owner-message').value;
    let token = localStorage.getItem('accessToken');
    fetch(host + 'sendMessage', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body : JSON.stringify({
            "tenantId": tenantId,
            "message": message
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
        getMessagesRequest(tenantId);
    })
    .catch(error => {
        console.error('Erreur:', error);
        // window.location.href = ownerLogSignURL;
    }); 
} 
