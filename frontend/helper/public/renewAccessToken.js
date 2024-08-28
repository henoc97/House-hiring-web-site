

/**
 * @fileoverview This file contains a function to renew the access token
 * using a refresh token. If the renewal fails, the user is redirected
 * to the login page.
 */

/**
 * Renews the access token using a refresh token.
 * The refresh token is retrieved from cookies and sent to the server.
 * If the renewal is successful, the new access token is stored in localStorage
 * and the refresh token is updated in cookies.
 * In case of failure, the user is redirected to the login page.
 * @returns {Promise<void>} A promise that resolves when the access token is successfully renewed.
 */
function renewAccessToken() {
    // Retrieve the refresh token from cookies
    let refreshToken = getCookie('refreshToken');

    return fetch(host + 'refresh-token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken: refreshToken })
    })
    .then(response => {
        // Check if the response is ok (status code in the range 200-299)
        if (!response.ok) {
            throw new Error('Renouvellement du token échoué');
        }
        return response.json();
    })
    .then(data => {
        // Store the new access token in localStorage
        localStorage.setItem('accessToken', data.accessToken);
        // Update the refresh token in cookies with a 7-day expiration
        setCookie("refreshToken", data.accessToken, 7);
        console.log(data.accessToken);
    })
    .catch(error => {
        // Log the error and redirect the user to the login page
        console.error('Erreur de renouvellement du token:', error);
        window.location.href = ownerLogSignURL;
    });
}
