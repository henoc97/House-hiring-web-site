// Sélectionne la modale et son contenu
const modal = document.getElementById('editModal');
const modalContent = document.querySelector('.modal-content');
const closeModal = document.querySelector('.modal .close');

// Quand l'utilisateur clique sur une icône de modification
document.querySelectorAll('.edit-icon').forEach(icon => {
  icon.addEventListener('click', function() {
    alert('Je click')
    const tenantId = this.dataset.id;
    
    // Remplir le formulaire avec les données du locataire ici (utilisez tenantId)
    
    modal.style.display = 'block'; // Affiche la modale
    setTimeout(() => {
      modal.classList.add('show');
      modalContent.classList.add('show');
    }, 10); // Ajout du délai pour permettre la transition
  });
});

// Quand l'utilisateur clique sur <span> (x), ferme la modale
if (closeModal) {
    closeModal.onclick = function() {
    modal.classList.remove('show');
    modalContent.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300); // Correspond à la durée de l'animation en CSS
    }
}


// Quand l'utilisateur clique n'importe où en dehors de la modale, la fermer
window.onclick = function(event) {
  if (event.target == modal) {
    modal.classList.remove('show');
    modalContent.classList.remove('show');
    setTimeout(() => {
      modal.style.display = 'none';
    }, 300); // Correspond à la durée de l'animation en CSS
  }
}
