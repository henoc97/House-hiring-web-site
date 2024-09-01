/**
 * Adds a tenant to the tenants table.
 * @param {Object} tenant - The tenant data to add to the table.
 */
function addTenantToTable(tenant) {
  const tableBody = document.getElementById("all-tenants-table");
  const formattedDate = new Date(tenant.create_time).toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).replace(',', '').replace(/\//g, '-');
  
  var late = tenant.unpaid_months ?? '';
  
  // Function to reformat dates
  function formatMonthYear(dateStr) {
    const [year, month] = dateStr.split('-');
    return `${month}-${year}`;
  }

  // Reformat unpaid months
  const formattedLate = late.split(',').map(formatMonthYear).join(', ');
  const formattedLateIsUndifined = formattedLate != 'undefined-';
  
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
            <i class='bx bx-trash delete-icon' data-id="${tenant.id}" title="Suppression"></i>
          </div>
        </div>
    </td>
  `;
  tableBody.appendChild(row);
  
  // Add hover events
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

/**
 * Adds tenant properties to the properties table.
 * @param {Object} tenantProperty - The tenant property data to add to the table.
 */
function addtenantsPropertiestable(tenantProperty) {
  const tableBody = document.getElementById("tenants-properties-table");
  // Generate the activation link
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
      `<td><i class='bx bx-copy' title="Copy the activation link"></i></td>`
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
  
  // Add click event to copy the link to clipboard
  const copyIcon = row.querySelector('.bx-copy');
  if (copyIcon) {
    copyIcon.addEventListener('click', () => {
      navigator.clipboard.writeText("Lien à usage unique: " + activationLink).then(() => {
          alert('Lien d\'activation copié dans le presse-papiers !');
      }).catch(err => {
        window.location.href = ownerError;
      });
    });
  }
}

/**
 * Sends a request to create a new tenant.
 */
function createTenantRequest() {
  if ((getsold() - registerTenant) > 0) {
    let id = document.getElementById('property-option').value;
    let lastname = document.getElementById('tenant-lastname').value;
    let firstname = document.getElementById('tenant-firstname').value;
    let contactmoov = document.getElementById('tenant-contact-moov').value;
    let contacttg = document.getElementById('tenant-contact-tg').value;

    fetch(host + 'create-tenant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        "id": id,
        "lastname": lastname,
        "firstname": firstname,
        "contactmoov": contactmoov,
        "contacttg": contacttg
      })
    })
    .then(response => {
      if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            window.location.href = ownerLogSignURL;
          }
          // Redirect in case of other HTTP errors (e.g., 500)
          window.location.href = ownerError;
          throw new Error('HTTP error ' + response.status); // Throw an error to trigger the .catch
      }
      return response.json();
    })
    .then(data => {
        updateSoldRequest(registerTenant);
        document.getElementById('tenant-form').reset();
        addtenantsPropertiestable(data);
        removePropertyOptionByValue(id);
        setNumberOfTenantsProperties(parseInt(getNumberOfTenantsProperties(), 10) + 1);
        setNumberOfTenants(parseInt(getNumberOfTenants(), 10) + 1);
        showNumberOfTenants();
        showNumberOfTenantsProperties();
        showNewSold();
    })
    .catch(error => {
      window.location.href = ownerError;
    });
  } else {
    alert(`solde insuffisant. Cette opération coûte ${registerTenant} XOF`);
  }
}

/**
 * Removes a property option by its value.
 * @param {string} value - The value of the option to remove.
 */
function removePropertyOptionByValue(value) {
  const propertyOption = document.getElementById("property-option");
  
  if (propertyOption) {
      const options = propertyOption.options;

      for (let i = 0; i < options.length; i++) {
          if (options[i].value === value) {
              propertyOption.remove(i);
              break; // Stop loop after removing the option
          }
      }
  } else {
  }
}
