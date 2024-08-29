/**
 * Fetches the details of the owner and updates the user interface.
 * This function retrieves the owner's information from the server and
 * populates the form fields with the received data. It also handles
 * cases where some information is missing and updates the visual elements
 * accordingly.
 */
function getOwner() {

  // Send a POST request to fetch the owner's details
  fetch(host + "my-owner", {
      method: 'POST',
      headers: { 
          'Content-Type': 'application/json'
      },
      credentials: 'include',
  })
  .then(response => {
      // Check if the response is OK (status code 200-299)
      if (!response.ok) {
          // Handle unauthorized or forbidden responses
          if (response.status === 401 || response.status === 403) {
              window.location.href = ownerLogSignURL;
          }
          // Handle other HTTP errors (e.g., 500 Internal Server Error)
          window.location.href = ownerError;
          throw new Error('HTTP error ' + response.status); // Throw error to trigger catch block
      }
      // Parse the JSON response
      return response.json();
  })
  .then(data => {
      // Check if data is undefined or null
      if (!data) return; // Stop execution if data is undefined (e.g., due to redirection)


      // Check for missing information and update the action indicator
      if (data.lastname == null || 
          data.contactmoov == null || 
          data.contacttg == null) {
          document.querySelector('#action-indicator')
              .textContent = 'Complete the information'; 
      }

      // Populate the form fields with the owner's data
      document.getElementById('owner-lastname').value = data.lastname;
      document.getElementById('owner-firstname').value = data.firstname;
      document.getElementById('owner-email').value = data.email;
      document.getElementById('owner-contact-moov').value = data.contactmoov;
      document.getElementById('owner-contact-tg').value = data.contacttg;

      // Update the uploaded image
      const uploadedImage = document.getElementById('uploaded-image');
      uploadedImage.src = data.img_url;
      uploadedImage.classList.remove('hidden');
      uploadedImage.classList.add('visible');
      
      setSold(data.sold); // Set sold status
      showNewSold(); // Update the display based on new sold status
  })
  .catch(error => {
      // Redirect on error and log the error details
      window.location.href = ownerError;
  });
}

/**
* Updates the owner's details on the server with the data from the form.
* This function sends the updated owner information to the server and
* handles responses, including errors. On successful update, it shows
* an alert to the user.
*/
function updateOwner() {
  // Collect updated data from form fields
  const updatedData = {
      lastname: document.getElementById('owner-lastname').value,
      firstname: document.getElementById('owner-firstname').value,
      email: document.getElementById('owner-email').value,
      contactmoov: document.getElementById('owner-contact-moov').value,
      contacttg: document.getElementById('owner-contact-tg').value,
  };


  // Send a POST request to update the owner's details
  fetch(host + "update-owner", {
      method: 'POST',
      headers: { 
          'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(updatedData) // Send updated data in the request body
  })
  .then(response => {
      // Check if the response is OK (status code 200-299)
      if (!response.ok) {
          // Handle unauthorized or forbidden responses
          if (response.status === 401 || response.status === 403) {
              window.location.href = ownerLogSignURL;
          }
          // Handle other HTTP errors (e.g., 500 Internal Server Error)
          window.location.href = ownerError;
          throw new Error('HTTP error ' + response.status); // Throw error to trigger catch block
      }
      // Parse the JSON response
      return response.json();
  })
  .then(data => {
      alert("Modification réussie..."); // Notify the user of successful update
      // Optionally reload properties or reset the form here
      // getPropertiesRequest(1); // Reload properties to show changes
  })
  .catch(error => {
      // Redirect on error and log the error details
      window.location.href = ownerError;
  });
}
