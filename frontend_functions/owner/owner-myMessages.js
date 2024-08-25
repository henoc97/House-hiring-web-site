

function getMessagesRequest(tenantId) {
    let token = localStorage.getItem('accessToken');
    fetch(host + 'my-messages', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "tenantId": tenantId
        })
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                return renewAccessToken().then(() => getMessagesRequest(tenantId));
            }
            // Redirection en cas d'autres erreurs HTTP (par exemple 500)
            window.location.href = ownerError;
            throw new Error('HTTP error ' + response.status); // Lancer une erreur pour déclencher le .catch
        }
        return response.json();
    })
    .then(data => {
        if (!data) return; // Si data est undefined (en cas de redirection), arrêter l'exécution
        console.log("Messages received:", data); // Log the received data

        // Assuming 'data' is an array of messages
        const messages = data;

        // Function to format date
        function formatDate(date) {
            return new Date(date).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            });
        }

        // Group messages by date
        const groupedMessages = messages.reduce((acc, message) => {
            const date = new Date(message.date_time).toDateString();
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(message);
            return acc;
        }, {});

        const chatContainer = document.getElementById('chat-container');
        if (chatContainer) {
            chatContainer.innerHTML = ''; // Clear existing messages

            Object.keys(groupedMessages).forEach(dateKey => {
                // Create a date separator
                const dateDiv = document.createElement('div');
                dateDiv.classList.add('date-separator');
                dateDiv.innerHTML = `<span>${formatDate(dateKey)}</span>`;
                chatContainer.appendChild(dateDiv);

                // Append messages for this date
                groupedMessages[dateKey].forEach(message => {
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
            });
        } else {
            console.error("Element with ID 'chat-container' not found.");
        }
    })
    .catch((error) => {
        window.location.href = ownerError;
        console.error('Error fetching messages:', error)});
}