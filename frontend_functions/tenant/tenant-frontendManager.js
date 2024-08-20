

if (receiptsTable) { // est definie en bas
  getUnvalidReceiptsRequest(); // Elle appelera à son tour getValidReceiptsRequest()
}

const requireRecieptForm = document.getElementById("receipt-form");
const toggleIconRecieptForm = document.getElementById('toggle-icon');
const tenantPropertyOption = document.getElementById("tenant-property-option");
if (requireRecieptForm && tenantPropertyOption) {
  selectMonthsHelper(); // Aide a selectionner les mois pour les reçus
}

const totalPayments = document.getElementById('total-payments');
totalPayments.textContent = getNumberOfPayments() ?? 0;

// const totalPayments = document.getElementById('totalPayments');
// totalPayments.textContent = getNumberOfPayments() ?? 0;

// const totalPayments = document.getElementById('totalPayments');
// totalPayments.textContent = getNumberOfPayments() ?? 0;


const modal = document.getElementById('modal-set-pwd');
const modalContent = document.querySelector('.modal-content');

let setPwd = localStorage.getItem('setPwd');
if (setPwd != 1 && modal && modalContent) {
  modal.classList.remove('hidden');
  modal.classList.add('visible'); // Affiche la modale
  setTimeout(() => {
    modal.classList.add('show');
    modalContent.classList.add('show');
  }, 10);

  const setpwdForm = document.getElementById('set-pwd-form');
  if (setpwdForm) {
    setpwdForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      setpwdRequest();
    });
  }
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
        fetch(tenantURL + '/tenant-dashboard')
          .then(response => response.text())
          .then(data => {
            document.querySelector('.details').innerHTML = data;
            
            const receiptsTable = document.getElementById('receiptsTable');
            selectMonthsHelper(); // Aide a selectionner les mois pour les reçus
            if (receiptsTable) {
              getUnvalidReceiptsRequest(); // Elle appelera à son tour getValidReceiptsRequest()
            }
         });
      }
      
      
      if (this.id === 'discuss-button') {
        fetch(tenantURL + '/tenant-discussion')
          .then(response => response.text())
          .then(data => {
            document.querySelector('.details').innerHTML = data;
            
            const messageForm = document.getElementById('message-form');

            if(messageForm) {
              sendMessageRequest();
            }
            getMessagesRequest();
            deleteMessageLogic();
        });
      }

      if (this.id === 'profile-button') {
        fetch(tenantURL + '/tenant-profile')
          .then(response => response.text())
          .then(data => {
            document.querySelector('.details').innerHTML = data;

            const tenantForm = document.getElementById('tenant-form');
            if (tenantForm) {
              getTenantPropertyRequest(1);
              tenantForm.addEventListener('submit', async function (e) {
                e.preventDefault();
              });
            }
        })
      }
    })
  });

      