/**
 * Adds a subscription to the subscriptions table.
 * @param {Object} subscription - The subscription data to be added.
 */
function addSubscription(subscription) {
  // Get the table body element
  const tableBody = document.getElementById("subscriptions-table");

  // Format the creation date of the subscription
  const formattedDate = new Date(subscription.create_time).toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).replace(',', '').replace(/\//g, '-');

  // Create a new row for the subscription
  const row = document.createElement('tr');
  row.dataset.id = subscription.id;
  row.innerHTML = `
        <td>${subscription.ref}</td>
        <td>${subscription.lastname}</td>
        <td>${subscription.email}</td>
        <td>${subscription.sumpayed}</td>
        <td>${subscription.method}</td>
        <td>
          ${subscription.payment_state === 0 ? 
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

  // Insert the new row at the top of the table
  tableBody.insertBefore(row, tableBody.firstChild);
}

/**
 * Sends a request to get all subscriptions and updates the table.
 */
function getSubscriptionsRequest() {

  fetch(hostAdmin + 'get-all-subscriptions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
  })
  .then(response => {
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        window.location.href = adminLogSignURL;
      }
      // Redirect in case of other HTTP errors (e.g., 500)
      window.location.href = adminError;
      throw new Error('HTTP error ' + response.status);
    }
    return response.json();
  })
  .then(data => {
    if (!data) return; // Stop execution if no data

    const subscriptions = data;
    const tableBody = document.getElementById("subscriptions-table");
    if (tableBody) {
      tableBody.innerHTML = ''; // Clear existing rows

      subscriptions.forEach(subscription => {
        addSubscription(subscription);
      });
      addDropdownsListener();
    } else {
    }
  })
  .catch(error => {
    window.location.href = adminError;
  });
}

/**
 * Adds event listeners to dropdowns and handles interactions.
 */
function addDropdownsListener() {
  const tableBody = document.getElementById("subscriptions-table");

  if (tableBody) {
    tableBody.addEventListener('click', function(event) {
      const target = event.target;

      if (target.classList.contains('toggle-dropdown')) {
        const dropdown = target.closest('.dropdown');
        dropdown.classList.toggle('show');
        event.stopPropagation();
      }

      if (target.classList.contains('delete-icon')) {
        const subscriptionId = target.dataset.id;
        deletesubscription(subscriptionId);
      }

      if (target.classList.contains('bg-danger')) {
        const subscriptionId = target.dataset.subid;
        const ownerId = target.dataset.id;
        const ref = target.dataset.ref;
        const method = target.dataset.method;
        validSubscription(subscriptionId, ownerId, ref, method);
      }
    });

    // Close the dropdown if clicking outside
    window.addEventListener('click', function(event) {
      if (!event.target.matches('.toggle-dropdown')) {
        document.querySelectorAll('.dropdown').forEach(dropdown => {
          dropdown.classList.remove('show');
        });
      }
    });
  } else {
  }
}

/**
 * Sends a request to delete a subscription and removes it from the table.
 * @param {string} subscriptionId - The ID of the subscription to delete.
 */
function deletesubscription(subscriptionId) {

  fetch(hostAdmin + "delete-subscription", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({ "id": subscriptionId })
  })
  .then(response => {
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        window.location.href = adminLogSignURL;
      }
      // Redirect in case of other HTTP errors (e.g., 500)
      window.location.href = adminError;
      throw new Error('HTTP error ' + response.status);
    }
    return response.json();
  })
  .then(data => {
    const row = document.querySelector(`tr[data-id="${subscriptionId}"]`);
    if (row) {
      row.remove(); // Remove the row from the table
    }
  })
  .catch(error => {
    window.location.href = adminError;
  });
}
