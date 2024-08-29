/**
 * Inserts a new subscription based on form input and updates the table.
 */
function insertSubscriptionAdmin() {
    // Collect subscription data from the form
    const insertedData = {
        email: document.getElementById('subscription-email').value,
        ref: document.getElementById('subscription-trx-id').value,
        sumpaid: document.getElementById('subscription-amount').value,
        method: document.querySelector('input[name="payment-method"]:checked').value,
    };


    fetch(hostAdmin + "insert-subscription", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(insertedData)
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
    .then(subscription => {
        addSubscription(subscription);

        // Re-add event listeners to the delete icons
        document.querySelectorAll('.delete-icon').forEach(icon => {
            icon.addEventListener('click', function() {
                const subscriptionId = this.dataset.id;
                deletesubscription(subscriptionId);
            });
        });

        const subscriptionForm = document.getElementById('subscription-form');
        subscriptionForm.reset();
    })
    .catch(error => {
        window.location.href = adminError;
        // console.error('Error inserting subscription:', error);
    });
}

/**
 * Validates a subscription and updates its status in the table.
 * @param {string} subscriptionId - The ID of the subscription to validate.
 * @param {string} id - The ID of the owner.
 * @param {string} ref - The reference of the subscription.
 * @param {string} method - The payment method.
 */
function validSubscription(subscriptionId, id, ref, method) {

    fetch(hostAdmin + "update-owner-sold", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ id, ref, method })
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                window.location.href = adminLogSignURL;
            }
            // Throw an error for other HTTP errors
            throw new Error('HTTP error ' + response.status);
        }
        return response.json();
    })
    .then(() => {
        // Update the subscription status in the table
        const row = document.querySelector(`tr[data-id="${subscriptionId}"]`);
        if (row) {
            const statusSpan = row.querySelector('span');
            statusSpan.classList.remove('bg-danger');
            statusSpan.classList.add('bg-success');
            statusSpan.textContent = 'Approuvé';
        }
    })
    .catch(error => {
        // console.error('Error validating subscription:', error);
    });
}
