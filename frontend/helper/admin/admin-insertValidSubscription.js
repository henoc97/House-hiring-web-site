

function insertSubscription() {

    const inseredData = {
        email : document.getElementById('subscription-email').value,
        ref : document.getElementById('subscription-trx-id').value,
        sumpaid : document.getElementById('subscription-amount').value,
        method : document.querySelector('input[name="payment-method"]:checked').value,
    };

    console.log("inseredData: ", JSON.stringify(inseredData));
    let token = localStorage.getItem('accessTokenAdmin');
    fetch(hostAdmin + "insert-subscription", {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(inseredData)
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                return renewAccessToken().then(() => insertSubscription());
            }
            // Redirection en cas d'autres erreurs HTTP (par exemple 500)
            window.location.href = adminError;
            throw new Error('HTTP error ' + response.status); // Lancer une erreur pour déclencher le .catch
        }
        return response.json();
    })
    .then((subscription) => {
        addSubscription(subscription);
        // Quand l'utilisateur clique sur une icône de suppression
        document.querySelectorAll('.delete-icon').forEach(icon => {
            icon.addEventListener('click', function() {
            const subscriptionId = this.dataset.id;
            deletesubscription(subscriptionId);
            });
        });

        // document.querySelectorAll('tr').forEach(tableRow => {
        //     tableRow.addEventListener('click', function() {
        //     const subscriptionId = this.dataset.id;
        //     fitSubscriptionForm(subscriptionId);
        //     });
        // });
    })
    .catch(error => {
        window.location.href = adminError;
        console.error('Error deleting subscription:', error)});

}

function validSubscription(subscriptionId, id, ref, method) {
    let token = localStorage.getItem('accessTokenAdmin');
    fetch(hostAdmin + "update-owner-sold", {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({id, ref, method})
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                return renewAccessToken().then(() => validSubscription(subscriptionId));
            }
            // Redirection en cas d'autres erreurs HTTP (par exemple 500)
            // window.location.href = adminError;
            throw new Error('HTTP error ' + response.status); // Lancer une erreur pour déclencher le .catch
        }
        return response.json();
    })
    .then((data) => {
        const row = document.querySelector(`tr[data-id="${subscriptionId}"]`);
        if (row) {
            row.querySelector('span').classList.remove('bg-danger');
            row.querySelector('span').classList.add('bg-success');
            row.querySelector('span').textContent = 'Approuvé';
        }
    })
    .catch(error => {
        // window.location.href = adminError;
        console.error('Error deleting subscription:', error)});
    }