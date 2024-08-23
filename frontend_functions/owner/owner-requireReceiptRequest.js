
function requireRecieptRequest() {
    let tenantsPropertiesOption = document.getElementById('tenants-properties-option');
    let selectedOption = tenantsPropertiesOption.options[tenantsPropertiesOption.selectedIndex];
    console.log('Selected option value:', selectedOption.value);
    console.log('Selected option text:', selectedOption.text);
    let idTenantProperty = document.getElementById('tenants-properties-option').value;
    console.log('idTenantProperty : ' + idTenantProperty);
    let sumpayed = document.getElementById('receipt-sumpayed').value;
    let months = Array.from(document.getElementById('receipt-months').selectedOptions).map(option => option.value);
    
    if (months.length === 0) {
        alert("Veuillez sélectionner au moins un mois.");
        return;
    }

    let token = localStorage.getItem('accessToken');

    // Si le coût est réparti également entre les mois
    let costPerMonth = parseFloat(sumpayed) / months.length;

    months.forEach(month => {
        fetch(host + 'require-receipt', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "idTenantProperty": idTenantProperty,
                "sumpayed": costPerMonth,
                "monthpayed": month.trim()
            })
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    return renewAccessToken().then(() => requireRecieptRequest());
                }
                // Redirection en cas d'autres erreurs HTTP (par exemple 500)
                window.location.href = ownerError;
                throw new Error('HTTP error ' + response.status); // Lancer une erreur pour déclencher le .catch
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            document.getElementById('receipt-form').reset();
        })
        .catch(error => {
            console.error('Erreur:', error);
            window.location.href = ownerError;
        });
    });

    document.getElementById('receipt-months').selectedIndex = -1; // Réinitialiser la sélection
}
