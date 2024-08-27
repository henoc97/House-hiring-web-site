

function addSubscription(subscription) {
  const tableBody = document.getElementById("subscriptions-table");
  const formattedDate = new Date(subscription.create_time).toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).replace(',', '').replace(/\//g, '-');
  console.log("subscriptions data:", subscription); // Log chaque propriété
  const row = document.createElement('tr');
  row.dataset.id = subscription.id;
  row.innerHTML = `
        <td>
          ${subscription.lastname}
        </td>
        <td>
          ${subscription.ref}
        </td>
        <td>
          ${subscription.email}
        </td>
        <td>
          ${subscription.sumpayed}
        </td>
        <td>
          ${subscription.method}
        </td>
          ${subscription.payment_state == 0 ? 
            `<span class="badge bg-danger">Non approuvé</span>` : 
            `<span class="badge bg-success">Approuvé</span>`
          }
        <td>
        <td>${formattedDate}</td>
          <div class="dropdown">
            <i class='bx bx-dots-vertical-rounded toggle-dropdown'></i>
            <div class="dropdown-content">
              <i class='bx bx-trash delete-icon' data-id="${subscription.id}"></i>
            </div>
          </div>
        </td>

  `;
  tableBody.insertBefore(row, tableBody.firstChild);

  addDropdownsListener(); // Assure-toi que cette fonction est correctement définie pour gérer les nouveaux éléments
}

function getsubscriptionsRequest() {
  let token = localStorage.getItem('accessTokenAdmin');
  fetch(hostAdmin + 'get-all-subscriptions', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
  })
  .then(response => {
    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            return renewAccessToken().then(() => getsubscriptionsRequest());
        }
        // Redirection en cas d'autres erreurs HTTP (par exemple 500)
        window.location.href = adminError;
        throw new Error('HTTP error ' + response.status); // Lancer une erreur pour déclencher le .catch
    }
    return response.json();
  })
  .then(data => {
    if (!data) return; // Si data est undefined (en cas de redirection), arrêter l'exécution

    console.log("data received:", data); // Log les données reçues

    const subscriptions = data;
    const tableBody = document.getElementById("subscriptions-table");
    if (tableBody) {
      tableBody.innerHTML = ''; // Clear existing rows

      subscriptions.forEach((subscription) => {
        addSubscription(subscription); 
      });
      addDropdownsListener();
      // Quand l'utilisateur clique sur une icône de suppression
      document.querySelectorAll('.delete-icon').forEach(icon => {
        icon.addEventListener('click', function() {
          const subscriptionId = this.dataset.id;
          deletesubscription(subscriptionId);
        });
      });

      document.querySelectorAll('tr').forEach(tableRow => {
        tableRow.addEventListener('click', function() {
          const subscriptionId = this.dataset.id;
          fitSubscriptionForm(subscriptionId);
        });
      });
    } else {
      console.error("Element with ID 'subscriptions' not found.");
    }
  })
  .catch((error) => {
    window.location.href = adminError;
    console.error('Error fetching subscriptions:', error);
  });
}

function addDropdownsListener() {
  const toggleDropdowns = document.querySelectorAll('.toggle-dropdown');

  console.log('Dropdowns trouvés:', toggleDropdowns.length);

  toggleDropdowns.forEach(toggle => {
    toggle.addEventListener('click', function(event) {
      console.log('Dropdown cliqué:', this);
      const dropdown = this.closest('.dropdown');
      dropdown.classList.toggle('show'); // Afficher ou masquer le dropdown
      event.stopPropagation(); // Empêche le clic de se propager et fermer immédiatement le dropdown
    });
  });

  // Fermer le dropdown si on clique en dehors
  window.addEventListener('click', function(event) {
    if (!event.target.matches('.toggle-dropdown')) {
      const dropdowns = document.querySelectorAll('.dropdown');
      dropdowns.forEach(dropdown => {
        dropdown.classList.remove('show');
      });
    }
  });
}

function deletesubscription(subscriptionId) {
  let token = localStorage.getItem('accessTokenAdmin');

  fetch(hostAdmin + "delete-subscription", {
      method: 'POST',
      headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "id": subscriptionId })
  })
  .then(response => {
    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            return renewAccessToken().then(() => deletesubscription(subscriptionId));
        }
        // Redirection en cas d'autres erreurs HTTP (par exemple 500)
        window.location.href = adminError;
        throw new Error('HTTP error ' + response.status); // Lancer une erreur pour déclencher le .catch
    }
    return response.json();
  })
  .then(() => {
      const row = document.querySelector(`tr[data-id="${subscriptionId}"]`);
      if (row) {
          row.remove(); // Supprime la ligne du tableau
      }
  })
  .catch(error => {
    window.location.href = adminError;
    console.error('Error deleting subscription:', error)});
}