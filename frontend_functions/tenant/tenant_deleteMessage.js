
function deleteMessageLogic() {
    let selectedMessages = new Set();

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

            // Activer ou désactiver l'icône de suppression en fonction des messages sélectionnés
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
        if (document.getElementById('delete-selected').classList.contains('disabled')) {
            return; // Ne fait rien si l'icône est désactivée
        }
        Array.from(selectedMessages).forEach(messageID => {
            const messageDiv = document.querySelector(`[data-id="${messageID}"]`);
            chatContainer.removeChild(messageDiv);
            deleteSelectedMessage(messageID);
        });
        selectedMessages.clear(); // Réinitialiser la sélection
        document.getElementById('delete-selected').classList.remove('enabled');
        document.getElementById('delete-selected').classList.add('disabled'); // Réinitialiser l'état de l'icône
        // getMessagesRequest(); // Recharger les messages après suppression
    });

    function deleteSelectedMessage(messageId) {
        let token = localStorage.getItem('accessTokenTenant'); 

        fetch(hostTenant + 'deleteMessage', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ messageId })
        })
        .then(response => {
            if (!response.ok && (response.status === 401 || response.status === 403)) {
                alert("problem")
                return renewAccessToken().then(() => deleteSelectedMessage(messageId));
            }
            return response.json();
        })
        .then(data => {
            
        })
        .catch(error => {
            console.error('Erreur:', error);
        });
    }

}

