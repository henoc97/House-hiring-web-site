/**
 * Initializes WebSocket communication for sending and receiving messages.
 * Establishes a WebSocket connection, handles incoming messages, and manages
 * form submission for sending messages.
 * @function
 * @returns {void}
 */
function sendMessageRequest() {
    const ws = new WebSocket(hostSocket + `?userType=${encodeURIComponent('tenant')}`);
    
    ws.onopen = () => {
    };
    
    ws.onmessage = event => {
        let messageObject;
        
        try {
            // Attempt to parse the received message as a JSON object
            messageObject = JSON.parse(event.data);
        } catch (err) {
            window.location.href = tenantError;
            return;
        }
        
        // Extract and display the message if available
        if (messageObject && messageObject.message) {
            displayMessage(messageObject);
        }
    };
    
    document.getElementById('message-form')
        .addEventListener('submit', function(event) {
            let message = document.getElementById('tenant-message').value;
            event.preventDefault(); // Prevent page reload
            if (message.trim() !== '') {
                ws.send(JSON.stringify({ message }));
            }
            document.getElementById('message-form').reset();
        });
}

/**
 * Displays a message in the chat container.
 * Creates a new div element for the message, formats it based on the sender, and appends it to the chat container.
 * @param {Object} message - The message object to display.
 * @param {string} message.id - The unique identifier for the message.
 * @param {boolean} message.by_tenant - Indicates if the message is sent by a tenant (true) or an owner (false).
 * @param {string} message.date_time - The date and time when the message was sent.
 * @param {string} message.message - The content of the message.
 * @returns {void}
 */
function displayMessage(message) {
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
        
        // Create a new message div
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.setAttribute('data-id', message.id); // Attach the message ID

        // Determine if the message is from the tenant or owner
        const isTenantMessage = message.by_tenant === 1;
        
        // Add classes and styles based on the message sender
        if (!isTenantMessage) {
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
    }
}
