/**
 * Fetches messages for the tenant and updates the chat container with the retrieved messages.
 * @function
 * @returns {void}
 */
function getMessagesRequest() {
  fetch(hostTenant + 'my-messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
    .then((response) => {
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          window.location.href = tenantLogSignURL;
        }
        // Redirect in case of other HTTP errors (e.g., 500)
        window.location.href = tenantError;
        throw new Error('HTTP error ' + response.status); // Throw an error to trigger the .catch
      }
      return response.json();
    })
    .then((data) => {
      /**
       * Formats a date to a readable string in French.
       * @param {Date|string} date - The date to format.
       * @returns {string} The formatted date string.
       */
      function formatDate(date) {
        return new Date(date).toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        });
      }

      // Group messages by date
      const groupedMessages = data.reduce((acc, message) => {
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

        Object.keys(groupedMessages).forEach((dateKey) => {
          // Create a date separator
          const dateDiv = document.createElement('div');
          dateDiv.classList.add('date-separator');
          dateDiv.innerHTML = `<span>${formatDate(dateKey)}</span>`;
          chatContainer.appendChild(dateDiv);

          // Append messages for this date
          groupedMessages[dateKey].forEach((message) => {
            // Create a new message div
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message');
            messageDiv.setAttribute('data-id', message.id); // Attach the message ID

            // Determine if the message is from the owner or tenant
            const isOwnerMessage = message.by_tenant === 1;

            // Add classes and styles based on message sender
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
      window.location.href = tenantError;
    });
}
