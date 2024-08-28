

document.addEventListener("DOMContentLoaded", function() {
  // URL for activating the tenant account
  const url = hostTenant + 'activate-tenant-account';
  
  // Extract query parameters from the URL
  const params = new URLSearchParams(window.location.search);
  const key = params.get('key'); // Activation key
  const prTenId = params.get('pr_ten'); // Property/Tenant ID
  
  // Send a POST request to the server to activate the tenant account
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json' // Specify JSON content type
    },
    body: JSON.stringify({ key, prTenId }) // Send key and ID in the request body
  })
  .then(async response => {
    // Check if the response is not OK
    if (!response.ok) {
      // Parse and throw error message if the response is not OK
      const errorData = await response.json();
      throw new Error(errorData.message || 'Unknown error');
    }
    // Parse and return JSON data from the response
    return response.json();
  })
  .then(data => {
    // Log the data received from the server
    console.log("data: " + JSON.stringify(data));
    
    // Check if the data contains an access token
    if (data.accessToken) {
      // Log the access token and store it in localStorage
      console.log(data.accessToken);
      localStorage.setItem('accessTokenTenant', data.accessToken);
      
      // Set a refresh token cookie valid for 7 days
      setCookie("refreshTokenTenant", data.refreshToken, 7);
      
      // Store additional user information in localStorage
      localStorage.setItem('setPwd', 0);
      localStorage.setItem('userName', data.userName + data.count);
      localStorage.setItem('createTime', data.createTime);
      
      // Redirect to the tenant dashboard
      window.location.href = tenantDashboardURL;
    } else {
      // Show an error alert if no access token is returned
      alert('Login error');
    }
  })
  .catch(error => {
    // Log the error and show an alert message for errors during account creation
    console.error('Error:', error);  // Log the full error in the console
    alert('Error creating account: invalid link'); // Show a descriptive error message
  });
});