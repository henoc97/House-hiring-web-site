
function addTenantToTable(tenant) {
  const tableBody = document.getElementById("all-tenants-table");
  const formattedDate = new Date(tenant.create_time).toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).replace(',', '').replace(/\//g, '-');
  
  var late = tenant.unpaid_months ?? '';
  // Fonction pour reformater les dates
  function formatMonthYear(dateStr) {
    const [year, month] = dateStr.split('-');
    return `${month}-${year}`;
  }

  // Reformater les mois impayés
  const formattedLate = late.split(',').map(formatMonthYear).join(', ');
  const formattedLateIsUndifined = formattedLate != 'undefined-';
  console.log("formattedLate: ", formattedLate); 
  const row = document.createElement('tr');
  row.dataset.id = tenant.id;
  row.innerHTML = `
    <td>${tenant.lastname} ${tenant.firstname}</td>
    <td>${tenant.contactmoov} / ${tenant.contacttg}</td>
    <td>
      <span class="late-count">${late == '' ? 0 : late.split(",").length}</span>
      ${formattedLateIsUndifined ? 
        `<div class="late-months hidden">
          ${formattedLate}
        </div>` : ``
      }
    </td>
    <td>${formattedDate}</td>
    <td>
        <div class="dropdown">
          <i class='bx bx-dots-vertical-rounded toggle-dropdown'></i>
          <div class="dropdown-content">
            <i class='bx bx-message-dots chat-icon' data-id="${tenant.id}" title="Discussion"></i>
            <i class='bx bx-edit-alt edit-icon' data-id="${tenant.id}" title="Modification"></i>
            <i class='bx bx-trash delete-icon' data-id="${tenant.id}" title="Supprission"></i>
          </div>
        </div>
    </td>
  `;
  tableBody.appendChild(row);
  
  // Ajouter les événements de survol
  row.addEventListener('mouseover', function() {
    const lateCount = row.querySelector('.late-count');
    const lateMonths = row.querySelector('.late-months');
    if (lateCount.textContent != 0) {
      lateMonths.classList.toggle('hidden');
      lateMonths.classList.toggle('visible');
    }
  });

  row.addEventListener('mouseout', function() {
    if (formattedLateIsUndifined) {
      const lateMonths = row.querySelector('.late-months');
      lateMonths.classList.toggle('visible');
      lateMonths.classList.toggle('hidden');
    }
  });
}

function addtenantsPropertiestable(tenantProperty) {
  const tableBody = document.getElementById("tenants-properties-table");
  // Génération du lien d'activation
  const activationLink = activateURL + `?key=${tenantProperty.conn_key}&pr_ten=${tenantProperty.id}`;

  const row = document.createElement('tr');
  row.dataset.id = tenantProperty.id;
  row.innerHTML = `
    <td>${tenantProperty.lastname} ${tenantProperty.firstname}</td>
    <td>${tenantProperty.contactmoov} / ${tenantProperty.contacttg}</td>
    <td>${tenantProperty.address}</td>
    <td>${tenantProperty.price}</td>
    ${tenantProperty.is_activated ? 
      `<td>--</td>` : 
      `<td><i class='bx bx-copy' title="Copier le lien d'activation"></i></td>`
    }
    <td>
        <div class="dropdown">
            <i class='bx bx-dots-vertical-rounded toggle-dropdown'></i>
            <div class="dropdown-content">
                <i class='bx bx-trash delete-icon' data-id="${tenantProperty.id}"></i>
            </div>
        </div>
    </td>
  `;
  
  tableBody.insertBefore(row, tableBody.firstChild);
  // Ajouter un événement de clic pour copier le lien dans le presse-papiers
  const copyIcon = row.querySelector('.bx-copy');
  if (copyIcon) {
    copyIcon.addEventListener('click', () => {
      navigator.clipboard.writeText("Lien à usage unique : " + activationLink).then(() => {
          alert('Lien d\'activation copié dans le presse-papiers !');
      }).catch(err => {
        window.location.href = ownerError;
        console.error('Échec de la copie du lien : ', err);
      });
   });
  }
}


function createTenantRequest(){

  if((getsold() - registerTenant) > 0){
    let id = document.getElementById('property-option').value;
    let lastname = document.getElementById('tenant-lastname').value;
    let firstname = document.getElementById('tenant-firstname').value;
    let contactmoov = document.getElementById('tenant-contact-moov').value;
    let contacttg = document.getElementById('tenant-contact-tg').value;

    let token = localStorage.getItem('accessToken');

    fetch(host + 'create-tenant', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body : JSON.stringify({
        "id": id,
        "lastname":lastname,
        "firstname":firstname,
        "contactmoov":contactmoov,
        "contacttg":contacttg
      })
    })
    .then(response => {
      if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
              return renewAccessToken().then(() => createTenantRequest());
          }
          // Redirection en cas d'autres erreurs HTTP (par exemple 500)
          window.location.href = ownerError;
          throw new Error('HTTP error ' + response.status); // Lancer une erreur pour déclencher le .catch
      }
      return response.json();
  })
    .then(data => {
        updateSoldRequest(registerTenant);
        console.log(data);
        document.getElementById('tenant-form').reset();
        addtenantsPropertiestable(data);
        removePropertyOptionByValue(id);
        showNewSold();
    })
    .catch(error => {
      window.location.href = ownerError;
      console.error('Erreur:', error);
    });
  } else {
    alert('solde insuffisant. Cette opération coute 0.25€')
  }
}

function removePropertyOptionByValue(value) {
  const propertyOption = document.getElementById("property-option");
  
  if (propertyOption) {
      const options = propertyOption.options;

      for (let i = 0; i < options.length; i++) {
          if (options[i].value === value) {
              propertyOption.remove(i);
              break; // Stopper la boucle après avoir supprimé l'option
          }
      }
  } else {
      console.error("Element with ID 'property-option' not found.");
  }
}