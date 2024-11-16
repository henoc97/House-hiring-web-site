/**
 * Handles message selection and deletion logic.
 * @param {string} tenantId - The ID of the tenant for whom the messages are being handled.
 */
function deleteMessageLogic(tenantId) {
  let selectedMessages = new Set();

  /**
   * Handles message selection and toggles the delete icon state.
   * @param {Event} event - The event triggered by a click on a message.
   */
  function handleMessageSelection(event) {
    if (event.target.classList.contains('message')) {
      const messageDiv = event.target;
      const messageId = messageDiv.getAttribute('data-id');
      if (selectedMessages.has(messageId)) {
        selectedMessages.delete(messageId);
        messageDiv.classList.remove('selected');
      } else {
        selectedMessages.add(messageId);
        messageDiv.classList.add('selected');
      }

      // Enable or disable the delete icon based on selected messages
      const deleteIcon = document.getElementById('delete-selected');
      if (selectedMessages.size === 0) {
        deleteIcon.classList.remove('enabled');
        deleteIcon.classList.add('disabled');
      } else {
        deleteIcon.classList.remove('disabled');
        deleteIcon.classList.add('enabled');
      }
    }
  }

  const chatContainer = document.getElementById('chat-container');
  chatContainer.addEventListener('click', handleMessageSelection);

  document.getElementById('delete-selected').addEventListener('click', () => {
    if (
      document.getElementById('delete-selected').classList.contains('disabled')
    ) {
      return; // Do nothing if the icon is disabled
    }
    Array.from(selectedMessages).forEach((messageID) => {
      const messageDiv = document.querySelector(`[data-id="${messageID}"]`);
      chatContainer.removeChild(messageDiv);
      deleteSelectedMessage(messageID);
    });
    selectedMessages.clear(); // Reset the selection
    document.getElementById('delete-selected').classList.remove('enabled');
    document.getElementById('delete-selected').classList.add('disabled'); // Reset the icon state
  });

  /**
   * Deletes a selected message from the server.
   * @param {string} messageId - The ID of the message to delete.
   */
  function deleteSelectedMessage(messageId) {
    fetch(host + 'delete-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messageId }),
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            window.location.href = ownerLogSignURL;
          }
          // Redirect in case of other HTTP errors (e.g., 500)
          window.location.href = ownerError;
          throw new Error('HTTP error ' + response.status); // Throw an error to trigger the .catch
        }
        return response.json();
      })
      .then((data) => {
        // Handle any additional logic or updates here if needed
      })
      .catch((error) => {
        window.location.href = ownerError;
      });
  }
}
