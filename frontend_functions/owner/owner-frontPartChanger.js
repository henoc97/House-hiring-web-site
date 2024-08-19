


const recentTenantsTable = document.getElementById('recent-tenants-table');
if (recentTenantsTable) {    
  // alert('Please select');          
  getUnvalidReceiptsRequest();
  getRecentTenantsRequest();
}

const totalTenants = document.getElementById('total-tenants');
totalTenants.textContent = getNumberOfTenants() ?? 0;

const totalTenantsProperties = document.getElementById('total-tenants-properties');
totalTenantsProperties.textContent = getNumberOfTenantsProperties() ?? 0;

const totalProperties = document.getElementById('total-properties');
totalProperties.textContent = getNumberOfProperties() ?? 0;

const totalPayments = document.getElementById('total-payments');
totalPayments.textContent = getNumberOfPayments() ?? 0;

showNewSold();

const unValidReceiptsTable = document.getElementById('unvalid-receipts-table')
unValidReceiptsTable.addEventListener('click', function(e) {
  accessReceipt(e);
});

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
        fetch(ownerURL + '/owner-dashboard')
          .then(response => response.text())
          .then(data => {
            document.querySelector('.details').innerHTML = data;
            
            const unValidReceiptsTable = document.getElementById('unvalid-receipts-table')
            const recentTenantsTable = document.getElementById('recent-tenants-table');
            if (recentTenantsTable && unValidReceiptsTable) {
              getUnvalidReceiptsRequest();
              getRecentTenantsRequest();
              unValidReceiptsTable.addEventListener('click', function(e) {
                accessReceipt(e);
              });
            }
        });
      } 

      if (this.id === 'profile-button') {
        fetch(ownerURL + '/owner-profile')
          .then(response => response.text())
          .then(data => {
            document.querySelector('.details').innerHTML = data;
            const uploadForm = document.getElementById('upload-form');
            const ownerForm = document.getElementById('owner-form');
            if (ownerForm) {
              getOwner();
              ownerForm.addEventListener('submit', async function (e) {
                e.preventDefault();
                updateOwner();
              });
            }
            if (uploadForm) {
              uploadedImageLogic(uploadForm);
            }
          // Check if an image filename is stored in local storage
          const filename = localStorage.getItem('uploadedImageFilename');
          if (filename) {
              const uploadedImage = document.getElementById('uploaded-image');
              uploadedImage.src = `${filename}`;
              uploadedImage.classList.add('hidden');
              uploadedImage.classList.add('visible');
          }
        });
      } 

      if (this.id === 'proprietes-button') {
        fetch(ownerURL + '/owner-properties')
          .then(response => response.text())
          .then(data => {
            document.querySelector('.details').innerHTML = data;
            const propertyForm = document.getElementById('property-form');
            const propertiesTable = document.getElementById('my-Properties-table');
            if (propertyForm && propertiesTable) {
            }
            propertyForm.addEventListener('submit', function(event) {
              event.preventDefault(); // Empêche le rechargement de la page
              const submitButton = event.target.querySelector('#property-form button[type="submit"]');
              const editingId = submitButton.dataset.editingId;
              if (editingId && submitButton.textContent === "Modifier") {
                // Mode Modification
                updateProperty(editingId);
              } else {
                // Mode Ajout
                createPropertyRequest();
              }
            });
            getPropertiesRequest(1);
          });
      } 

      if (this.id === 'tenant-button') {
        fetch(ownerURL + '/owner-tenants')
          .then(response => response.text())
          .then(data => {
            document.querySelector('.details').innerHTML = data;
            const tenantsTable = document.getElementById('all-tenants-table');
            const editTenantForm = document.getElementById('edit-tenant-form');
            const messageForm = document.getElementById('message-form');
            if (tenantsTable) {
              getAllTenantsRequest()
            }
            if (editTenantForm) {
              editTenantForm.addEventListener('submit', function(event) {
                event.preventDefault(); // Empêche le rechargement de la page
                  const submitButton = event.target.querySelector('#edit-tenant-form button[type="submit"]');
                  const editingId = submitButton.dataset.editingId;
                  if (editingId) {
                    updateTenant(editingId);
                  }
               });
            }
            if (messageForm) {
              messageForm.addEventListener('submit', function(event) {
                event.preventDefault(); // Empêche le rechargement de la page
                  const submitButton = event.target.querySelector('#message-form button[type="submit"]');
                  const tenantId = submitButton.dataset.tenantId;
                  if (tenantId) {
                    // sendMessageRequest(tenantId);
                  }
               });
            }
          });
      }

      if (this.id === 'tenant-home-button') {
        fetch(ownerURL + '/owner-tenant-home')
          .then(response => response.text())
          .then(data => {
            document.querySelector('.details').innerHTML = data;

            const tenantproperty = document.getElementById("tenants-properties-table");
            const tenantForm = document.getElementById("tenant-form");
            if (tenantForm && tenantproperty) {
              getTenantsPropertiesRequest(1);

              getPropertiesRequest(2);

              tenantForm.addEventListener('submit', function(event) {
                  event.preventDefault();
                  
                  createTenantRequest();
              })
            }
          });
      }

      if (this.id === 'myreceipt-button') {
        fetch(ownerURL + '/owner-receipts')
        .then(response => response.text())
        .then(data => {
          document.querySelector('.details').innerHTML = data;
          const validReceiptsTable = document.getElementById("valid-receipts-table");
          if (validReceiptsTable) {
            console.log("ccol");
            getValidReceiptsRequest();
          }
          validReceiptsTable.addEventListener('click', function(e) {
            accessReceipt(e);
          });
          const requireRecieptForm = document.getElementById("receipt-form");
          const tenantsPropertiesoption = document.getElementById("tenants-properties-option");
          if (tenantsPropertiesoption && requireRecieptForm) {
            selectMonthsHelper(requireRecieptForm, tenantsPropertiesoption); // Aide a selectionner les moi pour les reçus
          }
        });
      }
    });
  });