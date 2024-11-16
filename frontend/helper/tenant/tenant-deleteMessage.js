/**
 * Manages the logic for deleting selected messages.
 */
function deleteMessageLogic() {
  // Set to keep track of selected messages
  let selectedMessages = new Set();

  /**
   * Handles message selection and updates the state of the delete icon.
   * @param {Event} event - The click event.
   */
  function handleMessageSelection(event) {
    // Check if the clicked element is a message
    if (event.target.classList.contains('message')) {
      const messageDiv = event.target;
      const messageId = messageDiv.getAttribute('data-id');

      // Toggle selection of the message
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

  // Attach event listener for message selection
  const chatContainer = document.getElementById('chat-container');
  chatContainer.addEventListener('click', handleMessageSelection);

  // Attach event listener for delete icon click
  document.getElementById('delete-selected').addEventListener('click', () => {
    // Exit if the delete icon is disabled
    if (
      document.getElementById('delete-selected').classList.contains('disabled')
    ) {
      return;
    }
    // Delete selected messages
    Array.from(selectedMessages).forEach((messageID) => {
      const messageDiv = document.querySelector(`[data-id="${messageID}"]`);
      chatContainer.removeChild(messageDiv);
      deleteSelectedMessage(messageID);
    });
    // Clear selection and reset delete icon state
    selectedMessages.clear();
    document.getElementById('delete-selected').classList.remove('enabled');
    document.getElementById('delete-selected').classList.add('disabled');
    // Optionally reload messages after deletion
    // getMessagesRequest();
  });

  /**
   * Deletes a message from the server.
   * @param {string} messageId - The ID of the message to delete.
   */
  function deleteSelectedMessage(messageId) {
    fetch(hostTenant + 'delete-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ messageId }),
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
        // Handle successful deletion if needed
      })
      .catch((error) => {
        window.location.href = tenantError;
      });
  }
}
