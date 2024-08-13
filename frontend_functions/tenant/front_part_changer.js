
const totalPayments = document.getElementById('totalPayments');
totalPayments.textContent = getNumberOfPayments() ?? 0;


const modal = document.getElementById('modal-set-pwd');
const modalContent = document.querySelector('.modal-content');

let setPwd = localStorage.getItem('setPwd');
if (setPwd != 1 && modal && modalContent) {
  modal.style.display = 'block'; // Affiche la modale
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
        fetch(tenantURL + '/dashboard')
          .then(response => response.text())
          .then(data => {
            document.querySelector('.details').innerHTML = data;
            
            // const unvalidReceiptsTable = document.getElementById('unvalidReceiptsTable')
            // const recentTenantsTable = document.getElementById('recentTenantsTable');
            const requireRecieptForm = document.getElementById("receipt-form");
            const toggleIcon = document.getElementById('toggle-icon');

            if(toggleIcon && requireRecieptForm) {
              toggleIcon.addEventListener('click', () => {
                const isFormVisible = requireRecieptForm.style.display === 'block';
                requireRecieptForm.style.display = isFormVisible ? 'none' : 'block';
                toggleIcon.className = isFormVisible ? 'bx bx-chevron-down' : 'bx bx-chevron-up';
              });
            }
            // if (recentTenantsTable && unvalidReceiptsTable) {
              
            //   getUnvalidReceiptsRequest();
            //   getRecentTenantsRequest();
            // }
          });
      }
      
      
      if (this.id === 'discuss-button') {
        fetch(tenantURL + '/discuss_part')
          .then(response => response.text())
          .then(data => {
            document.querySelector('.details').innerHTML = data;
            
            const toggleIcon = document.getElementById('toggle-icon');
            const messageForm = document.getElementById('message-form');

            if(toggleIcon && messageForm) {
              toggleIcon.addEventListener('click', () => {
                const isFormVisible = messageForm.style.display === 'block';
                messageForm.style.display = isFormVisible ? 'none' : 'block';
                toggleIcon.className = isFormVisible ? 'bx bx-chevron-down' : 'bx bx-chevron-up';
              });
            }
            
        });
      }

      if (this.id === 'porfile-button') {
        fetch(tenantURL + '/profile')
          .then(response => response.text())
          .then(data => {
            document.querySelector('.details').innerHTML = data;

            const uploadForm = document.getElementById('uploadForm');
            const tenantForm = document.getElementById('tenant-form');
            if (tenantForm) {
              // getTenant();
              tenantForm.addEventListener('submit', async function (e) {
                e.preventDefault();
                // updateTenant();
              });
            }
        })
      }
    })
  });

      