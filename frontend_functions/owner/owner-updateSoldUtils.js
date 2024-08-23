

function setSold(sold) {
    localStorage.setItem('sold', sold);
  }
  
  function getsold() {
    if (localStorage.getItem('sold') == 'undefined') return 0;
    return localStorage.getItem('sold');
  }

  function showNewSold(){
    document.getElementById('sold').innerHTML = 
        `<h3>Solde : ${getsold() ?? 0}</h3>`;
  }
  
  function updateSoldRequest(spend) {
      let token = localStorage.getItem('accessToken');
      fetch(host + 'update-sold', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "spend":spend
        })
      })
      .then(response => response.json())
      .then(data => {
        console.log("data received:", data); // Log les données reçues
  
        const sold = data;
        console.log("sold : ", sold);
        setSold(sold);

        document.getElementById('sold').innerHTML = `<h3>Solde : ${sold}</h3>`;
       
      })
      .catch((error) => console.error('Error fetching updateSoldRequest:', error));
    }
  
  
  
    