




function getRecentTenantsRequest() {
    let token = localStorage.getItem('accessToken');
    fetch(host + 'recent-tenants', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
    })
    .then(response => {
      if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
              return renewAccessToken().then(() => getRecentTenantsRequest());
          }
          // Redirection en cas d'autres erreurs HTTP (par exemple 500)
          window.location.href = ownerError;
          throw new Error('HTTP error ' + response.status); // Lancer une erreur pour déclencher le .catch
      }
      return response.json();
  })
    .then(data => {
      console.log("data received:", data); // Log les données reçues

      // Si les propriétés sont enveloppées dans un objet { myProperties }
      const recentTenants = data;

      const tableBody = document.getElementById("recent-tenants-table");
      if (tableBody) {
        tableBody.innerHTML = ''; // Clear existing rows

        recentTenants.forEach((recentTenant) => {
          console.log("recentTenants data:", recentTenant); // Log chaque propriété
          const formattedDate = new Date(recentTenant.create_time).toLocaleString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
          }).replace(',', '').replace(/\//g, '-');
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
        console.error("Element with ID 'tenantspropertiesTable' not found.");
      }
    })
    .catch((error) => {
      // window.location.href = ownerError;
      console.error('Error fetching tenantsproperties:', error)});
  }



  