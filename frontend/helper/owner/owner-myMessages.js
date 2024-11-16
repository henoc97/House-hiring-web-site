/**
 * Fetches messages for a specific tenant and updates the chat interface.
 * The function retrieves messages from the server, formats them by date,
 * and displays them in the chat container, grouping messages by their date.
 *
 * @param {number} tenantId - The ID of the tenant for whom messages are being fetched.
 */
function getMessagesRequest(tenantId) {
  // Send a POST request to the server to fetch messages for the given tenant
  fetch(host + 'my-messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      tenantId: tenantId, // Send tenant ID in the request body
    }),
  })
    .then((response) => {
      // Check if the response is OK (status code 200-299)
      if (!response.ok) {
        // Handle unauthorized or forbidden responses
        if (response.status === 401 || response.status === 403) {
          window.location.href = ownerLogSignURL;
        }
        // Handle other HTTP errors (e.g., 500 Internal Server Error)
        window.location.href = ownerError;
        throw new Error('HTTP error ' + response.status); // Throw error to trigger catch block
      }
      // Parse the JSON response
      return response.json();
    })
    .then((data) => {
      // Check if data is undefined or null
      if (!data) return; // Stop execution if data is undefined (e.g., due to redirection)

      // Assuming 'data' is an array of messages
      const messages = data;

      // Function to format date for display
      function formatDate(date) {
        return new Date(date).toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
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

      // Get the chat container element
      const chatContainer = document.getElementById('chat-container');
      if (chatContainer) {
        chatContainer.innerHTML = ''; // Clear existing messages

        // Iterate over grouped messages
        Object.keys(groupedMessages).forEach((dateKey) => {
          // Create a date separator element
          const dateDiv = document.createElement('div');
          dateDiv.classList.add('date-separator');
          dateDiv.innerHTML = `<span>${formatDate(dateKey)}</span>`;
          chatContainer.appendChild(dateDiv);

          // Append messages for the current date
          groupedMessages[dateKey].forEach((message) => {
            // Create a new message div
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message');
            messageDiv.setAttribute('data-id', message.id); // Attach the message ID

            // Determine if the message is from the owner or tenant
            const isOwnerMessage = message.by_owner == 1;

            // Add classes and styles based on the sender
            if (!isOwnerMessage) {
              messageDiv.classList.add('sender');
            } else {
              messageDiv.classList.add('receiver');
            }

            // Format the message content and timestamp
            const formattedDate = new Date(message.date_time).toLocaleString(
              'fr-FR',
              {
                hour: '2-digit',
                minute: '2-digit',
              }
            );

            messageDiv.innerHTML = `
                        <p>${message.message}</p>
                        <span class="timestamp">${formattedDate}</span>
                    `;

            // Append the message to the chat container
            chatContainer.appendChild(messageDiv);
          });
        });
      } else {
      }
    })
    .catch((error) => {
      // Redirect on error and log the error details
      window.location.href = ownerError;
    });
}
