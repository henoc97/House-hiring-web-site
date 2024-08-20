


function getRecentMessagesRequest() {
  let token = localStorage.getItem('accessToken');
  fetch(host + 'recent-messages', {
      method: 'POST',
      headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
      },
  })
  .then(response => response.json())
  .then(data => {
      console.log("data received:", data); // Log les données reçues
      console.log('received recent : ', data);
      // Si les propriétés sont enveloppées dans un objet { myProperties }
      const recentMessages = data;

      const tableBody = document.getElementById("recent-messages-table");
      if (tableBody) {
          tableBody.innerHTML = ''; // Clear existing rows

          recentMessages.forEach((recentMessage) => {
            console.log("recentMessages data:", recentMessage); // Log chaque propriété
            const formattedHour = new Date(recentMessage.date_time).toLocaleString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            });
            
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

          // Sélectionne la modale des messages et son contenu
          const messageModal = document.getElementById('message-modal');
          const messageModalContent = messageModal.querySelector('.modal-content');
      
          // Quand l'utilisateur clique sur une  des recente discussions
          const messages = document.querySelectorAll('.recent-message-row');
          messages.forEach(message => {
            message.addEventListener('click', function() {
              const tenantId = this.dataset.id;
              // Affiche la modale des messages pour le locataire correspondant
              const submitButton = document.querySelector('#message-form button[type="submit"]');
              // Ajoute une classe ou un attribut pour identifier qu'il s'agit d'une modification
              submitButton.dataset.tenantId = tenantId;
              messageModal.style.display = 'block';
              setTimeout(() => {
                messageModal.classList.add('show');
                messageModalContent.classList.add('show');
              }, 10); // Ajout du délai pour permettre la transition
              // Charger les messages ou autres données si nécessaire
              getMessagesRequest(tenantId);
              // alert("je suis la tenantID : " + tenantId);
              sendMessageRequest(tenantId);
              deleteMessageLogic(tenantId);
            });
          });
      } else {
          console.error("Element with ID 'recent-tenants-table' not found.");
      }
  })
  .catch((error) => console.error('Error fetching recent messages:', error));
}
