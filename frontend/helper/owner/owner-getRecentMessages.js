/**
 * Fetches recent messages from the server and updates the UI.
 *
 * This function sends a POST request to the server to retrieve recent messages.
 * If the request is successful, it updates the table with the received messages.
 * It also handles token renewal in case of authentication errors.
 */
function getRecentMessagesRequest() {
  // Send a POST request to fetch recent messages
  fetch(host + 'recent-messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
    .then((response) => {
      // Check if the response is not OK
      if (!response.ok) {
        // Handle unauthorized or forbidden errors
        if (response.status === 401 || response.status === 403) {
          window.location.href = ownerLogSignURL;
        }
        // Redirect in case of other HTTP errors (e.g., 500)
        window.location.href = ownerError;
        throw new Error('HTTP error ' + response.status); // Throw an error to trigger the .catch
      }
      // Parse the response JSON
      return response.json();
    })
    .then((data) => {
      // Assuming messages are in an array
      const recentMessages = data;

      // Get the table body element
      const tableBody = document.getElementById('recent-messages-table');
      if (tableBody) {
        tableBody.innerHTML = ''; // Clear existing rows

        // Iterate over the recent messages and create table rows
        recentMessages.forEach((recentMessage) => {
          // Format the date and time
          const formattedHour = new Date(
            recentMessage.date_time
          ).toLocaleString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          });

          // Create a new table row
          const row = document.createElement('tr');
          row.dataset.id = recentMessage.tenantid;
          row.classList.add('recent-message-row');
          row.innerHTML = `
                <td>
                    <h4>${recentMessage.lastname} ${recentMessage.firstname.split(' ')[0]}</h4>
                    <div class="recent-message-container">
                        <p class="recent-message-text">${recentMessage.message}</p>
                    </div>
                    <td>${formattedHour}</td>
                </td>
            `;
          tableBody.appendChild(row);
        });

        // Select the message modal and its content
        const messageModal = document.getElementById('message-modal');
        const messageModalContent =
          messageModal.querySelector('.modal-content');

        // Add click event listeners to message rows
        const messages = document.querySelectorAll('.recent-message-row');
        messages.forEach((message) => {
          message.addEventListener('click', function () {
            const tenantId = this.dataset.id;
            // Display the message modal for the corresponding tenant
            const submitButton = document.querySelector(
              '#message-form button[type="submit"]'
            );
            submitButton.dataset.tenantId = tenantId;
            messageModal.style.display = 'block';
            setTimeout(() => {
              messageModal.classList.add('show');
              messageModalContent.classList.add('show');
            }, 10); // Add delay to allow for transition
            // Load messages or other data if necessary
            getMessagesRequest(tenantId);
            sendMessageRequest(tenantId);
            deleteMessageLogic(tenantId);
          });
        });
      } else {
      }
    })
    .catch((error) => {
      // Redirect on error
      window.location.href = ownerError;
    });
}
