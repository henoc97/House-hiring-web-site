/**
 * Sets the 'sold' value in localStorage.
 * @param {number} sold - The amount to set as the new balance.
 */
function setSold(sold) {
  localStorage.setItem('sold', sold);
}

/**
 * Retrieves the 'sold' value from localStorage.
 * @returns {number} - The stored balance, or 0 if 'sold' is not defined.
 */
function getsold() {
  // Returns 0 if 'sold' is not set or if 'sold' is 'undefined'
  if (localStorage.getItem('sold') === 'undefined') return 0;
  return localStorage.getItem('sold') || 0;
}

/**
 * Updates the HTML element with the ID 'sold' to display the current balance.
 */
function showNewSold() {
  document.getElementById('sold').innerHTML = `<h3>Solde : ${getsold()}</h3>`;
}

/**
 * Sends a request to update the balance and updates the display.
 * @param {number} spend - The amount to be subtracted from the balance.
 */
function updateSoldRequest(spend) {
  // Retrieve the access token from localStorage

  // Send a POST request to update the balance
  fetch(host + 'update-sold', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      spend: spend,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      const sold = data;

      setSold(sold); // Update localStorage with the new balance

      // Update the HTML element with the new balance
      document.getElementById('sold').innerHTML = `<h3>Solde : ${sold}</h3>`;
    })
    .catch((error) => {});
}
