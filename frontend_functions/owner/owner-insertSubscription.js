

function insertSubscription() {

    const messageDiv = document.getElementById('message');

    // Réinitialise le message
    messageDiv.textContent = '';

    const inseredData = {
        email : document.getElementById('subscription-email').value,
        ref : document.getElementById('subscription-trx-id').value,
        sumpaid : document.getElementById('subscription-amount').value,
        method : document.querySelector('input[name="payment-method"]:checked').value,
    };

    console.log("inseredData: ", JSON.stringify(inseredData));
    let token = localStorage.getItem('accessToken');
    fetch(host + "insert-subscription", {
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
            // window.location.href = ownerError;
            throw new Error('HTTP error ' + response.status); // Lancer une erreur pour déclencher le .catch
        }
        return response.json();
    })
    .then((subscription) => {
        document.getElementById('subscription-form').reset();
        messageDiv.textContent = "Paiement signalé ! Nous traiterons votre demande dans les plus brefs délais...";
        messageDiv.classList.remove('red-message');
        messageDiv.classList.add('green-message');
    })
    .catch(error => {
        // window.location.href = ownerError;
        console.error('Error deleting subscription:', error)});

}
