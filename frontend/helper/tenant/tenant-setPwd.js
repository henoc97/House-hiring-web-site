/**
 * Handles the password setting request.
 * Retrieves the password values from the form, validates them, and sends a POST request to update the password.
 * Also handles UI updates for the modal and message display.
 * @function
 * @returns {void}
 */
function setpwdRequest() {
  let setPwdForm = document.getElementById('set-pwd-form');
  let pwd = document.getElementById('set-pwd').value;
  let pwd1 = document.getElementById('set-pwd1').value;
  const messageDiv = document.getElementById('set-pwd-message');

  if (messageDiv) {
    // Reset the message
    messageDiv.textContent = '';
  }

  const value = validatePassword(pwd, pwd1, messageDiv);

  if (value == false) return;

  let userName = localStorage.getItem('userName');
  fetch(hostTenant + '/set-pwd', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      pwd: pwd,
      userName: userName,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          window.location.href = tenantLogSignURL;
        }
        // Redirect in case of other HTTP errors (e.g., 500)
        window.location.href = tenantError;
        throw new Error('HTTP error ' + response.status); // Throw an error to trigger .catch
      }
      return response.json();
    })
    .then((data) => {
      setPwdForm.reset();

      // Close the modal with a smooth animation
      const modal = document.getElementById('modal-set-pwd');
      const modalContent = modal.querySelector('.modal-content');

      // Remove the "show" class to start the closing animation
      modalContent.classList.remove('show');
      modal.classList.remove('show');

      // After the transition duration, completely hide the modal
      setTimeout(() => {
        modal.classList.remove('visible');
        modal.classList.add('hidden'); // Hide the modal
      }, 300); // Duration of the transition animation (300ms)

      // Save the fact that the password has been set
      localStorage.setItem('setPwd', 1);

      // Call another function after closing the modal
      getUnvalidReceiptsRequest(); // This will in turn call getValidReceiptsRequest()
    })
    .catch((error) => {
      window.location.href = tenantError;
    });
}
