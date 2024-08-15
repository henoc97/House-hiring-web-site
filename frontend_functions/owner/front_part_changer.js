



if (recentTenantsTable) {    
  // alert('Please select');          
  getUnvalidReceiptsRequest();
  getRecentTenantsRequest();
}

const totalTenants = document.getElementById('totalTenants');
totalTenants.textContent = getNumberOfTenants() ?? 0;

const totalTenantsProperties = document.getElementById('totalTenantsProperties');
totalTenantsProperties.textContent = getNumberOfTenantsProperties() ?? 0;

const totalProperties = document.getElementById('totalProperties');
totalProperties.textContent = getNumberOfProperties() ?? 0;

const totalPayments = document.getElementById('totalPayments');
totalPayments.textContent = getNumberOfPayments() ?? 0;

showNewSold();

validateReceiptLogic();

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
        fetch(ownerURL + '/dashboard')
          .then(response => response.text())
          .then(data => {
            document.querySelector('.details').innerHTML = data;
            
            const unvalidReceiptsTable = document.getElementById('unvalidReceiptsTable')
            const recentTenantsTable = document.getElementById('recentTenantsTable');
            if (recentTenantsTable && unvalidReceiptsTable) {
              
              getUnvalidReceiptsRequest();
              getRecentTenantsRequest();
              validateReceiptLogic();
            }
          });
      } 

      if (this.id === 'porfile-button') {
        fetch(ownerURL + '/profile')
          .then(response => response.text())
          .then(data => {
            document.querySelector('.details').innerHTML = data;

            const uploadForm = document.getElementById('uploadForm');
            const ownerForm = document.getElementById('owner-form');
            if (ownerForm) {
              getOwner();
              ownerForm.addEventListener('submit', async function (e) {
                e.preventDefault();
                updateOwner();
              });
            }

            if (uploadForm) {
              uploadForm.addEventListener('submit', async function (e) {
                e.preventDefault();
                
                const formData = new FormData();
                const fileInput = document.getElementById('imageUpload');
                formData.append('image', fileInput.files[0]);
    
                try {
                    const response = await fetch(host + '/upload', {
                        method: 'POST',
                        body: formData
                    });

                    if (!response.ok) {
                        throw new Error('Erreur lors de l\'upload du fichier');
                    }

                    const result = await response.json();
                    const uploadedImage = document.getElementById('uploadedImage');
                    uploadedImage.src = result.filename;
                    uploadedImage.style.display = 'block';

                    // Sauvegarder le nom du fichier dans le localStorage
                    localStorage.setItem('uploadedImageFilename', result.filename);
                } catch (error) {
                    console.error(error);
                    alert('Une erreur est survenue lors de l\'upload du fichier');
                }
            });
            }
  
          // Check if an image filename is stored in local storage
          const filename = localStorage.getItem('uploadedImageFilename');
          if (filename) {
              const uploadedImage = document.getElementById('uploadedImage');
              uploadedImage.src = `${filename}`;
              uploadedImage.style.display = 'block';
          }
            
          });
      } 

      if (this.id === 'proprietes-button') {
        fetch(ownerURL + '/propertiespart')
          .then(response => response.text())
          .then(data => {
            document.querySelector('.details').innerHTML = data;

            const propertyForm = document.getElementById('property-form');
            const propertiesTable = document.getElementById('myPropertiesTable');
            const toggleIcon = document.getElementById('toggle-icon');
            if (propertyForm && propertiesTable && toggleIcon) {
              toggleIcon.addEventListener('click', () => {
                const isFormVisible = propertyForm.style.display === 'block';
                propertyForm.style.display = isFormVisible ? 'none' : 'block';
                toggleIcon.className = isFormVisible ? 'bx bx-chevron-down' : 'bx bx-chevron-up';
              });

              propertyForm.addEventListener('submit', function(event) {
                event.preventDefault(); // Empêche le rechargement de la page
            
                const submitButton = event.target.querySelector('button[type="submit"]');
                const editingId = submitButton.dataset.editingId;
            
                if (editingId && submitButton.textContent === "Modifier") {
                  // Mode Modification
                  update_property(editingId);
                } else {
                  // Mode Ajout
                  createPropertyRequest();
                }
              });
              getPropertiesRequest(1);
            }
          });
      } 

      if (this.id === 'tenant-button') {
        fetch(ownerURL + '/tenants_part')
          .then(response => response.text())
          .then(data => {
            document.querySelector('.details').innerHTML = data;

            const tenantsTable = document.getElementById('alltenantsTable');
            const editTenantForm = document.getElementById('edit-tenant-form');
            const messageForm = document.getElementById('message-form');
            // const toggleIcon = document.getElementById('toggle-icon');
            if (tenantsTable) {
              /* toggleIcon.addEventListener('click', () => {
                const isFormVisible = propertyForm.style.display === 'block';
                propertyForm.style.display = isFormVisible ? 'none' : 'block';
                toggleIcon.className = isFormVisible ? 'bx bx-chevron-down' : 'bx bx-chevron-up';
              }); */
              getAllTenantsRequest()
            }

            editTenantForm.addEventListener('submit', function(event) {
              event.preventDefault(); // Empêche le rechargement de la page
              if (editTenantForm) {
                const submitButton = event.target.querySelector('#edit-tenant-form button[type="submit"]');
                const editingId = submitButton.dataset.editingId;
                if (editingId) {
                  updateTenant(editingId);
                }
              }
            });
            
            messageForm.addEventListener('submit', function(event) {
              event.preventDefault(); // Empêche le rechargement de la page
              if (messageForm) {
                const submitButton = event.target.querySelector('#message-form button[type="submit"]');
                const tenantId = submitButton.dataset.tenantId;
                if (tenantId) {
                  // sendMessageRequest(tenantId);
                }
              }
            });
          });
      }

      if (this.id === 'tenant_home-button') {
        fetch(ownerURL + '/tenant_home')
          .then(response => response.text())
          .then(data => {
            document.querySelector('.details').innerHTML = data;

            const tenantproperty = document.getElementById("tenantspropertiesTable");
            const tenantForm = document.getElementById("tenant-form");
            const toggleIcon = document.getElementById('toggle-icon');
            if (tenantForm && tenantproperty && toggleIcon) {
              toggleIcon.addEventListener('click', () => {
                const isFormVisible = tenantForm.style.display === 'block';
                tenantForm.style.display = isFormVisible ? 'none' : 'block';
                toggleIcon.className = isFormVisible ? 'bx bx-chevron-down' : 'bx bx-chevron-up';
              });
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
        fetch(ownerURL + '/receipts_part')
        .then(response => response.text())
        .then(data => {

          document.querySelector('.details').innerHTML = data;
          const validReceiptsTable = document.getElementById("validReceiptsTable");
          if (validReceiptsTable) {
            console.log("ccol");
            getValidReceiptsRequest();
          }

          validReceiptsTable.addEventListener('click', function(e) {
            if (e.target && e.target.closest('.govalidreceipt')) {
              
              e.preventDefault();
              const receiptData = JSON.parse(e.target.closest('.govalidreceipt').getAttribute('data-receipt'));
          
              // Generate a unique receipt number
              const receiptNumber = 'REC' + Date.now(); // Example: REC1627890123456
          
              // Get the current date
              const currentDate = new Date();
              const formattedDate = currentDate.toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              });
          
              // Add receipt number and issue date to receipt data
              receiptData.receiptNumber = receiptNumber;
              receiptData.issueDate = formattedDate;
          
              // Store the complete receipt data in localStorage
              localStorage.setItem('selectedReceipt', JSON.stringify(receiptData));
          
              // Redirect to the validation page
              window.location.href = receiptURL;
            }
          });

          const requireRecieptForm = document.getElementById("receipt-form");
          const tenantsPropertiesoption = document.getElementById("tenantsProperties-option");
          const toggleIcon = document.getElementById('toggle-icon');

          if (tenantsPropertiesoption && requireRecieptForm && toggleIcon) {
              toggleIcon.addEventListener('click', () => {
                  const isFormVisible = requireRecieptForm.style.display === 'block';
                  requireRecieptForm.style.display = isFormVisible ? 'none' : 'block';
                  toggleIcon.className = isFormVisible ? 'bx bx-chevron-down' : 'bx bx-chevron-up';
              });

              getTenantsPropertiesRequest(2);

              requireRecieptForm.addEventListener('submit', function(event) {
                  event.preventDefault();
                  requireRecieptRequest();
              });

              tenantsPropertiesoption.addEventListener('change', function() {
                  const selectedOption = this.options[this.selectedIndex];
                  const price = selectedOption.dataset.price;
                  document.getElementById('sumpayed').value = price ? price : '';
              });

              // Fonction pour générer les options des mois
            function generateMonthOptions(startMonth, startYear) {
              const months = [
                  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
                  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
              ];

              const monthsSelect = document.getElementById('months');
              monthsSelect.innerHTML = ''; // Vider les options existantes

              let currentMonth = startMonth;
              let currentYear = startYear;

              for (let i = 0; i < 12; i++) {
                  const monthName = months[currentMonth - 1];
                  const monthYearKey = `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`;

                  const option = document.createElement('option');
                  option.value = monthYearKey;
                  option.textContent = `${monthName} ${currentYear}`;
                  monthsSelect.appendChild(option);

                  // Passer au mois suivant
                  currentMonth++;
                  if (currentMonth > 12) {
                      currentMonth = 1;
                      currentYear++;
                  }
              }
          }

          // Déterminer le mois et l'année de départ
          const startDate = new Date();
          const startMonth = startDate.getMonth() + 1; // Les mois commencent à 0 en JavaScript
          const startYear = startDate.getFullYear();

          // Générer les mois à partir du mois courant
          generateMonthOptions(startMonth, startYear);

          // Mettre à jour le coût total basé sur le locataire sélectionné et les mois sélectionnés
          function updateSumpayed() {
              const selectedOption = document.getElementById('tenantsProperties-option').selectedOptions[0];
              const pricePerMonth = parseFloat(selectedOption.dataset.price);
              const selectedMonths = Array.from(document.getElementById('months').selectedOptions);
              const monthsCount = selectedMonths.length;

              if (pricePerMonth && monthsCount > 0) {
                  const totalCost = pricePerMonth * monthsCount;
                  document.getElementById('sumpayed').value = totalCost;
              } else {
                  document.getElementById('sumpayed').value = '';
              }
          }

          // Afficher les mois sélectionnés
          function updateSelectedMonths() {
              const selectedMonths = Array.from(document.getElementById('months').selectedOptions).map(option => {
                  const [year, monthNumber] = option.value.split('-');
                  return `${getMonthName(parseInt(monthNumber))} ${year}`;
              });
              document.getElementById('selected-months').textContent = selectedMonths.join(', ');
          }

          // Obtenir le nom du mois à partir du numéro du mois
          function getMonthName(monthNumber) {
              const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", 
                "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
              return monthNames[monthNumber - 1];
          }

          // Événements de changement pour mettre à jour le coût et les mois sélectionnés
          document.getElementById('tenantsProperties-option').addEventListener('change', function() {
              updateSumpayed();
          });

          document.getElementById('months').addEventListener('change', function() {
              updateSumpayed();
              updateSelectedMonths();
              // Appel pour charger les propriétés des locataires au chargement de la page
              getTenantsPropertiesRequest(2);
          });
          }
        });
      }
    });
  });