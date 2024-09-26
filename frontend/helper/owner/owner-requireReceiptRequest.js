/**
 * Handles the submission of the receipt request.
 * This function retrieves selected options, calculates the cost per month, 
 * and sends a POST request to create receipts for each selected month.
 */
function requireRecieptRequest() {
     // Get the tenant property ID 
    let idTenantProperty = document.getElementById('tenants-properties-option').value;
    
    // Get the tenant property  amount
    let sumpayed = document.getElementById('receipt-sumpayed').value;
    
    // Get the tenant property accessory fees
    let accessoryFees = document.getElementById('receipt-accessory_fees').value;
    
    // Get the tenant payment reference
    let ref = document.getElementById('receipt-txn-id').value;
    
    // Get the tenant payment method
    let method = document.querySelector('input[name="receipt-payment-method"]:checked').value;
    
    // Get the tenant payment date
    let createDate = document.getElementById('receipt-date-hour').value;

    // Get the selected months
    let months = Array.from(document.getElementById('receipt-months').selectedOptions).map(option => option.value);
    
    // Validate that at least one month is selected
    if (months.length === 0) {
        alert("Veuillez sélectionner au moins un mois."); // Alerts the user in French
        return;
    }


    // Calculate the cost per month
    let costPerMonth = parseFloat(sumpayed) / months.length;

    // Send a POST request for each selected month
    months.forEach(month => {
        fetch(host + 'require-receipt', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                "idTenantProperty": idTenantProperty,
                "sumpayed": costPerMonth,
                "accessoryFees": accessoryFees,
                "ref": ref,
                "method": method,
                "monthpayed": month.trim(),
                "createDate": createDate
            })
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    window.location.href = ownerLogSignURL;
                }
                // Redirect on other HTTP errors (e.g., 500)
                window.location.href = ownerError;
                throw new Error('HTTP error ' + response.status); // Throws an error to trigger the .catch
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('receipt-form').reset(); // Reset the form after successful request
            // Format local date and set it into dateTimeInput
            const dateTimeInput = document.getElementById('receipt-date-hour');
            const now = new Date();
            const formattedDateTime = now.toISOString().slice(0, 16);
            dateTimeInput.value = formattedDateTime;
        })
        .catch(error => {
            window.location.href = ownerError; // Redirects to the error page
        });
    });

    // "pm2 start config/ecosystem.config.js --no-daemon --env development",
    
    // Reset the month selection
    document.getElementById('receipt-months').selectedIndex = -1; // Resets the selection
}
