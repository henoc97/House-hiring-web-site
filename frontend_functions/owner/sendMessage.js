

function sendMessageRequest(tenantId){
    let token = localStorage.getItem('accessToken');
    const ws = new WebSocket(hostSocket + `?token=${encodeURIComponent(token)}`);
    
    ws.onopen = () => {
        console.log('WebSocket connection established');
    };
    
    ws.onmessage = event => {
        let messageObject;
        
        try {
            // Tenter de parser le message reçu en tant qu'objet JSON
            messageObject = JSON.parse(event.data);
        } catch (err) {
            console.error('Erreur lors du parsing du message:', err);
            return;
        }
        
        // Extraire et afficher uniquement le message
        if (messageObject && messageObject.message && messageObject.tenantid == tenantId) {
            displayMessage(messageObject);
        }
    };
    
    document.getElementById('message-form')
        .addEventListener('submit', function(event) {
            let message = document.getElementById('owner-message').value;
            event.preventDefault(); // Empêche le rechargement de la page
            if (message != ' ') ws.send(JSON.stringify({ tenantId, message }));
            document.getElementById('message-form').reset();

    });
    
} 


function displayMessage(message) {
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
        console.log("Message data:", message); // Log each message
        
        // Create a new message div
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.setAttribute('data-id', message.id); // Attach the message ID

        // Determine if the message is from the owner or tenant
        const isOwnerMessage = message.by_owner == 1;
        
        // Add classes and styles based on message sender
        if (!isOwnerMessage) {
            messageDiv.classList.add('sender');
        } else {
            messageDiv.classList.add('receiver');
        }
        
        // Format the message content and timestamp
        const formattedDate = new Date(message.date_time).toLocaleString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        });

        messageDiv.innerHTML = `
            <p>${message.message}</p>
            <span class="timestamp">${formattedDate}</span>
        `;
        
        // Append the message to the chat container
        chatContainer.appendChild(messageDiv);

        // Force the browser to render the new content
        setTimeout(() => {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }, 0); // Adjust the delay if necessary
    } else {
        console.error("Element with ID 'chat-container' not found.");
    }
}
