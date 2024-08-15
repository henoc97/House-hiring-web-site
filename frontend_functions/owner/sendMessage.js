

function sendMessageRequest(tenantId) {
    let token = localStorage.getItem('accessToken');

    if (window.ws) {
        window.ws.close();
        console.log('Previous WebSocket connection closed');
    }

    window.ws = new WebSocket(hostSocket + `?token=${encodeURIComponent(token)}`);

    // alert('WebSocket connection tenantId: ' + tenantId);
    window.ws.onopen = () => {
        console.log('WebSocket connection established for tenantId:', tenantId);
    };

    window.ws.onmessage = event => {
        let messageObject;

        try {
            messageObject = JSON.parse(event.data);
        } catch (err) {
            console.error('Erreur lors du parsing du message:', err);
            return;
        }

        if (messageObject && messageObject.message && messageObject.tenantid == tenantId) {
            // alert("message.tenantid : " + messageObject.tenantid + " " + "tenantId : " + tenantId);
            displayMessage(messageObject);
        }
    };

    let tenantID = tenantId;
    document.getElementById('message-form')
        .addEventListener('submit', function(event) {
            let message = document.getElementById('owner-message').value;
            event.preventDefault();
            alert('tenantID : ' + tenantID);
            if (message.trim() !== '') window.ws.send(JSON.stringify({ tenantID, message }));
            document.getElementById('message-form').reset();
        });
}
