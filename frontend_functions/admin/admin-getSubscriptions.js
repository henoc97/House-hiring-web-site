

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
          ${subscription.ref}
        </td>
        <td>
          ${subscription.lastname}
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
        <td>
          ${subscription.payment_state == 0 ? 
            `<span class="badge bg-danger" data-subid="${subscription.id}" data-id="${subscription.ownerid}" data-method="${subscription.method}" data-ref="${subscription.ref}">Non approuvé</span>` : 
            `<span class="badge bg-success">Approuvé</span>`
          }
        </td>
        <td>${formattedDate}</td>
        <td>
          <div class="dropdown">
            <i class='bx bx-dots-vertical-rounded toggle-dropdown'></i>
            <div class="dropdown-content">
              <i class='bx bx-trash delete-icon' data-id="${subscription.id}"></i>
            </div>
          </div>
        </td>

  `;
  tableBody.insertBefore(row, tableBody.firstChild);

}

function getSubscriptionsRequest() {
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
            return renewAccessToken().then(() => getSubscriptionsRequest());
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

      // document.querySelectorAll('tr').forEach(tableRow => {
      //   tableRow.addEventListener('click', function() {
      //     const subscriptionId = this.dataset.id;
      //     fitSubscriptionForm(subscriptionId);
      //   });
      // });
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
  const tableBody = document.getElementById("subscriptions-table");

  if (tableBody) {
    tableBody.addEventListener('click', function(event) {
      const target = event.target;

      if (target.classList.contains('toggle-dropdown')) {
        console.log('Dropdown cliqué:', target);
        const dropdown = target.closest('.dropdown');
        dropdown.classList.toggle('show');
        event.stopPropagation();
      }

      if (target.classList.contains('delete-icon')) {
        console.log('Icône de suppression cliquée:', target);
        const subscriptionId = target.dataset.id;
        deletesubscription(subscriptionId);
      }

      if (target.classList.contains('bg-danger')) {
        console.log('Icône de bg-danger cliquée:', target);
        const subscriptionId = target.dataset.subid;
        const ownerId = target.dataset.id;
        const ref = target.dataset.ref;
        const method = target.dataset.method;
        validSubscription(subscriptionId, ownerId, ref, method);
      }
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
  } else {
    console.error("Element with ID 'subscriptions-table' not found.");
  }
}

function deletesubscription(subscriptionId) {
  let token = localStorage.getItem('accessTokenAdmin');
  console.log('subscriptionId: ' + subscriptionId);
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
  .then((data) => {
      console.log('tout c est bien passé: ' + data.message);
      const row = document.querySelector(`tr[data-id="${subscriptionId}"]`);
      console.log('object row : ' + row);
      if (row) {
          console.log('tout c est bien passé2');
          row.remove(); // Supprime la ligne du tableau
      }
  })
  .catch(error => {
    window.location.href = adminError;
    console.error('Error deleting subscription:', error)});
}