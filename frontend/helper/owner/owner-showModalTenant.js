/**
 * Handles the display and interaction of a modal for editing tenant information.
 * This includes opening the modal with tenant data, closing the modal, and hiding it
 * when clicking outside the modal.
 */

// Select the modal and its content
const modal = document.getElementById('editModal');
const modalContent = document.querySelector('.modal-content');
const closeModal = document.querySelector('.modal .close');

/**
 * Opens the modal and populates it with tenant data when an edit icon is clicked.
 * Adds event listeners to each edit icon to show the modal.
 */
document.querySelectorAll('.edit-icon').forEach(icon => {
  icon.addEventListener('click', function() {
    alert('Clicked'); // Alert for debugging purposes
    
    const tenantId = this.dataset.id; // Get the tenant ID from the data-id attribute
    
    // TODO: Populate the form with tenant data here (use tenantId)
    
    modal.style.display = 'block'; // Show the modal
    setTimeout(() => {
      modal.classList.add('show');
      modalContent.classList.add('show');
    }, 10); // Add a delay to allow the transition
  });
});

/**
 * Closes the modal when the close button is clicked.
 * Removes the show class and hides the modal after the animation.
 */
if (closeModal) {
    closeModal.onclick = function() {
    modal.classList.remove('show');
    modalContent.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300); // Corresponds to the duration of the CSS animation
    }
}

/**
 * Closes the modal when clicking anywhere outside of it.
 * Hides the modal after removing the show class and waiting for the animation to finish.
 */
window.onclick = function(event) {
  if (event.target === modal) {
    modal.classList.remove('show');
    modalContent.classList.remove('show');
    setTimeout(() => {
      modal.style.display = 'none';
    }, 300); // Corresponds to the duration of the CSS animation
  }
}
