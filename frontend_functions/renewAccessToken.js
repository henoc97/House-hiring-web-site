
function renewAccessToken() {
    let refreshToken = getCookie('refreshToken');

    return fetch(host + 'refreshToken', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        
        body: JSON.stringify({ refreshToken: refreshToken })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Renouvellement du token échoué');
        }
        return response.json();
    })
    .then(data => {
        localStorage.setItem('accessToken', data.accessToken);
        setCookie("refreshToken", data.accessToken, 7);
        console.log(data.accessToken);
    })
    .catch(error => {
        console.error('Erreur de renouvellement du token:', error);
        // Si le renouvellement échoue, rediriger l'utilisateur vers la page de login
        window.location.href = '/sign_log';
    });
}