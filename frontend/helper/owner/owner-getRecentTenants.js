

/**
 * Fetches recent tenants from the server and updates the UI.
 * 
 * This function sends a POST request to the server to retrieve recent tenants.
 * If the request is successful, it updates the table with the received tenants.
 * It also handles token renewal in case of authentication errors.
 */
function getRecentTenantsRequest() {
  // Retrieve the access token from localStorage
  let token = localStorage.getItem('accessToken');

  // Send a POST request to fetch recent tenants
  fetch(host + 'recent-tenants', {
      method: 'POST',
      headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
      },
  })
  .then(response => {
    // Check if the response is not OK
    if (!response.ok) {
        // Handle unauthorized or forbidden errors
        if (response.status === 401 || response.status === 403) {
            return renewAccessToken().then(() => getRecentTenantsRequest());
        }
        // Redirect in case of other HTTP errors (e.g., 500)
        window.location.href = ownerError;
        throw new Error('HTTP error ' + response.status); // Throw an error to trigger the .catch
    }
    // Parse the response JSON
    return response.json();
  })
  .then(data => {
      console.log("Data received:", data); // Log received data

      // Assuming tenants are in an array
      const recentTenants = data;

      // Get the table body element
      const tableBody = document.getElementById("recent-tenants-table");
      if (tableBody) {
          tableBody.innerHTML = ''; // Clear existing rows

          // Iterate over the recent tenants and create table rows
          recentTenants.forEach((recentTenant) => {
              console.log("Recent tenants data:", recentTenant); // Log each tenant data

              // Format the creation date
              const formattedDate = new Date(recentTenant.create_time).toLocaleString('fr-FR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
              }).replace(',', '').replace(/\//g, '-');

              // Create a new table row
              const row = document.createElement('tr');
              row.innerHTML = `
                <td>
                    <h4>${recentTenant.lastname} ${recentTenant.firstname.split(' ')[0]} <br> 
                        <span>
                            ${recentTenant.contactmoov} / ${recentTenant.contacttg}
                        </span>
                    </h4>
                </td>
                <td>${formattedDate}</td>
              `;
              tableBody.appendChild(row);
          });
      } else {
          console.error("Element with ID 'recent-tenants-table' not found.");
      }
  })
  .catch((error) => {
    // Handle any errors during the fetch operation
    console.error('Error fetching recent tenants:', error);
  });
}
