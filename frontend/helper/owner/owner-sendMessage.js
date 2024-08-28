/**
 * Initializes a WebSocket connection for sending messages to a specific tenant.
 * Closes any existing WebSocket connection, opens a new one, and sets up event handlers
 * for receiving and sending messages.
 * @param {number} tenantId - The ID of the tenant to whom the messages will be sent.
 */
function sendMessageRequest(tenantId) {
    let token = localStorage.getItem('accessToken');

    if (window.ws) {
        window.ws.close(); // Close existing WebSocket connection
        getRecentMessagesRequest(); // Fetch recent messages
        console.log('Previous WebSocket connection closed');
    }

    window.ws = new WebSocket(hostSocket + `?token=${encodeURIComponent(token)}`);

    window.ws.onopen = () => {
        console.log('WebSocket connection established for tenantId:', tenantId);
    };

    window.ws.onmessage = event => {
        let messageObject;

        try {
            messageObject = JSON.parse(event.data); // Parse incoming message
        } catch (err) {
            console.error('Erreur lors du parsing du message:', err); // Log parsing errors
            return;
        }

        if (messageObject && messageObject.message && messageObject.tenantid == tenantId) {
            console.log('Message socket : ' + messageObject.message); // Log the received message
            displayMessageOwner(messageObject); // Display the message
        }
    };

    // Remove old event listener and add a new one
    const form = document.getElementById('message-form');
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);

    newForm.addEventListener('submit', function(event) {
        let message = document.getElementById('owner-message').value;
        event.preventDefault();
        if (message.trim() !== '') {
            window.ws.send(JSON.stringify({ tenantId, message })); // Send the message
        }
        document.getElementById('message-form').reset(); // Reset the form
    });
}

/**
 * Displays a message in the chat container.
 * Creates a new message element, formats it based on the sender, and appends it to the chat container.
 * @param {Object} message - The message object containing details to display.
 * @param {number} message.id - The unique identifier of the message.
 * @param {string} message.message - The content of the message.
 * @param {string} message.date_time - The timestamp of when the message was sent.
 * @param {number} message.by_owner - Indicator of whether the message is from the owner (1) or tenant (0).
 */
function displayMessageOwner(message) {
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
        console.log("Message data:", message); // Log the message data
        
        // Create and style a new message div
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.setAttribute('data-id', message.id); // Attach the message ID

        // Determine message sender and apply corresponding styles
        const isOwnerMessage = message.by_owner === 1;
        messageDiv.classList.add(isOwnerMessage ? 'receiver' : 'sender');
        
        // Format and display the message content and timestamp
        const formattedDate = new Date(message.date_time).toLocaleString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        });

        messageDiv.innerHTML = `
            <p>${message.message}</p>
            <span class="timestamp">${formattedDate}</span>
        `;
        
        chatContainer.appendChild(messageDiv); // Append the new message

        // Scroll to the bottom of the chat container to show the latest message
        setTimeout(() => {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }, 0);
    } else {
        console.error("Element with ID 'chat-container' not found."); // Log if chat container is not found
    }
}
