/**
 * Handles the submission of the receipt request.
 * This function retrieves selected options, calculates the cost per month, 
 * and sends a POST request to create receipts for each selected month.
 */
function requireRecieptRequest() {
    // Retrieve the selected tenant property option
    let tenantsPropertiesOption = document.getElementById('tenants-properties-option');
    let selectedOption = tenantsPropertiesOption.options[tenantsPropertiesOption.selectedIndex];
    // console.log('Selected option value:', selectedOption.value);
    // console.log('Selected option text:', selectedOption.text);

    // Get the tenant property ID and receipt amount
    let idTenantProperty = document.getElementById('tenants-properties-option').value;
    // console.log('idTenantProperty : ' + idTenantProperty);
    let sumpayed = document.getElementById('receipt-sumpayed').value;

    // Get the selected months
    let months = Array.from(document.getElementById('receipt-months').selectedOptions).map(option => option.value);
    
    // Validate that at least one month is selected
    if (months.length === 0) {
        alert("Veuillez sélectionner au moins un mois."); // Alerts the user in French
        return;
    }

    // Retrieve the access token
    let token = localStorage.getItem('accessToken');

    // Calculate the cost per month
    let costPerMonth = parseFloat(sumpayed) / months.length;

    // Send a POST request for each selected month
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
                // Redirect on other HTTP errors (e.g., 500)
                window.location.href = ownerError;
                throw new Error('HTTP error ' + response.status); // Throws an error to trigger the .catch
            }
            return response.json();
        })
        .then(data => {
            // console.log(data);
            document.getElementById('receipt-form').reset(); // Reset the form after successful request
        })
        .catch(error => {
            // console.error('Erreur:', error); // Logs the error
            window.location.href = ownerError; // Redirects to the error page
        });
    });

    // Reset the month selection
    document.getElementById('receipt-months').selectedIndex = -1; // Resets the selection
}
