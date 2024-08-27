


const subscriptionsTable = document.getElementById('subscriptions-table');
if (subscriptionsTable) {    
  getSubscriptionsRequest();
}

// const totalTenants = document.getElementById('total-tenants');
// totalTenants.textContent = getNumberOfTenants() ?? 0;

// const totalTenantsProperties = document.getElementById('total-tenants-properties');
// totalTenantsProperties.textContent = getNumberOfTenantsProperties() ?? 0;

// const totalProperties = document.getElementById('total-properties');
// totalProperties.textContent = getNumberOfProperties() ?? 0;

// const totalPayments = document.getElementById('total-payments');
// totalPayments.textContent = getNumberOfPayments() ?? 0;

// showNewSold();

// const unValidReceiptsTable = document.getElementById('unvalid-receipts-table')
// unValidReceiptsTable.addEventListener('click', function(e) {
//   accessReceipt(e);
// });

const subscriptionForm = document.getElementById('subscription-form');
if (subscriptionForm) {
  subscriptionForm.addEventListener('submit', function(e) {
    e.preventDefault();
    insertSubscription();
  })
}

document.getElementById('btn').addEventListener('click', function() {
    document.querySelector('.sidebar').classList.toggle('open');
  });

  // Sélectionner tous les liens de menu
  const menuLinks = document.querySelectorAll('.sidebar ul li a');

  menuLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();

      // Supprimer la classe active de tous les liens
      menuLinks.forEach(l => l.classList.remove('active'));

      // Ajouter la classe active au lien cliqué
      this.classList.add('active');

      // Cacher les éléments actuels et afficher le contenu correspondant
      document.querySelector('.details').innerHTML = ''; // Nettoyer la section details

      if (this.id === 'dash-button') {
        fetch(adminURL + '/admin-dashboard')
          .then(response => response.text())
          .then(data => {
            document.querySelector('.details').innerHTML = data;
            
            const subscriptionsTable = document.getElementById('subscriptions-table');
            if (subscriptionsTable) {    
              getSubscriptionsRequest();
            }
        });
      } 
    });
  });