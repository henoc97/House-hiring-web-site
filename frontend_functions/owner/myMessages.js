

function getMessagesRequest(tenantId) {
    let token = localStorage.getItem('accessToken');
    fetch(host + 'myMessages', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body : JSON.stringify({
            "tenantId": tenantId
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Messages received:", data); // Log the received data

        // Assuming 'data' is an array of messages
        const messages = data;

        const chatContainer = document.getElementById('chat-container');
        if (chatContainer) {
            chatContainer.innerHTML = ''; // Clear existing messages

            messages.forEach((message) => {
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
            });
        } else {
            console.error("Element with ID 'chat-container' not found.");
        }
    })
    .catch((error) => console.error('Error fetching messages:', error));
}
