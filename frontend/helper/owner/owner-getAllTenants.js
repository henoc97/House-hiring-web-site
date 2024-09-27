/**
 * Stores the number of tenants in localStorage.
 * @param {number} numberOfTenants - The number of tenants to store.
 */
function setNumberOfTenants(numberOfTenants) {
  localStorage.setItem('numberOfTenants', numberOfTenants);
}

/**
 * Retrieves the number of tenants from localStorage.
 * @returns {number} The number of tenants.
 */
function getNumberOfTenants() {
  const numberOfTenants = localStorage.getItem('numberOfTenants');
  return numberOfTenants === null ? 0 : parseInt(numberOfTenants, 10);
}

/**
 * Displays the number of tenants in the HTML element with ID 'total-tenants'.
 */
function showNumberOfTenants() {
  const totalTenants = document.getElementById('total-tenants');
  totalTenants.textContent = getNumberOfTenants();
}

/**
 * @param isSearch boolean indicating whether the search.
 * Fetches all, search tenants and updates the UI accordingly.
 */
function getAllTenantsRequest(isSearch) {
  const searchInput = document.getElementById("search-input");
  const searchValues = searchInput.value.split(' ');
  console.log("isSearch: " + isSearch);
  const route = !isSearch? 'all-tenants' : 'search-tenants';
  console.log("route: " + route);
  const reqBody = JSON.stringify(isSearch ? {lastname: searchValues[0], firstname: searchValues[1]?? ""} : {});
  console.log("reqBody: " + reqBody);
  fetch(host + route, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: reqBody,
    credentials: 'include',
  })
  .then(response => {
    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            window.location.href = ownerLogSignURL;
        }
        // window.location.href = ownerError;
        throw new Error('HTTP error ' + response.status);
    }
    return response.json();
  })
  .then(data => {
    const allTenants = data;
    isSearch && console.log("allTenants : "); console.log(allTenants);
    setNumberOfTenants(allTenants.length);
    showNumberOfTenants();
    
    const tableBody = document.getElementById("all-tenants-table");
    if (tableBody) {
      tableBody.innerHTML = '';

      allTenants.forEach((tenant) => {
        addTenantToTable(tenant);
      });

      const toggleDropdowns = document.querySelectorAll('.toggle-dropdown');
      toggleDropdowns.forEach(toggle => {
        toggle.addEventListener('click', function() {
          const dropdown = this.closest('.dropdown');
          dropdown.classList.toggle('show');
        });
      });

      window.addEventListener('click', function(event) {
        if (!event.target.matches('.toggle-dropdown')) {
          const dropdowns = document.querySelectorAll('.dropdown');
          dropdowns.forEach(dropdown => {
            dropdown.classList.remove('show');
          });
        }
      });

      const editModal = document.getElementById('edit-modal');
      const editModalContent = editModal.querySelector('.modal-content');
      const messageModal = document.getElementById('message-modal');
      const messageModalContent = messageModal.querySelector('.modal-content');
      const closeEditModal = editModal.querySelector('.close');

      document.querySelectorAll('.edit-icon').forEach(icon => {
        icon.addEventListener('click', function() {
          const tenantId = this.dataset.id;
          editTenant(tenantId);
          editModal.style.display = 'block';
          setTimeout(() => {
            editModal.classList.add('show');
            editModalContent.classList.add('show');
          }, 10);
        });
      });

      const chatIcons = document.querySelectorAll('.chat-icon');
      chatIcons.forEach(icon => {
        icon.addEventListener('click', function() {
          const tenantId = this.dataset.id;
          const submitButton = document.querySelector('#message-form button[type="submit"]');
          submitButton.dataset.tenantId = tenantId;
          messageModal.style.display = 'block';
          setTimeout(() => {
            messageModal.classList.add('show');
            messageModalContent.classList.add('show');
          }, 10);
          getMessagesRequest(tenantId);
          sendMessageRequest(tenantId);
          deleteMessageLogic(tenantId);
        });
      });

      document.querySelectorAll('.delete-icon').forEach(icon => {
        icon.addEventListener('click', function() {
          const tenantId = this.dataset.id;
          deleteTenant(tenantId);
        });
      });

      if (closeEditModal) {
        closeEditModal.onclick = function() {
          editModal.classList.remove('show');
          editModalContent.classList.remove('show');
          setTimeout(() => {
            editModal.style.display = 'none';
          }, 300);
        };
      }

      window.onclick = function(event) {
        if (event.target === editModal || event.target === messageModal) {
          if (event.target === editModal) {
            editModal.classList.remove('show');
            editModalContent.classList.remove('show');
            setTimeout(() => {
              editModal.style.display = 'none';
            }, 300);
          } else if (event.target === messageModal) {
            messageModal.classList.remove('show');
            messageModalContent.classList.remove('show');
            setTimeout(() => {
              messageModal.style.display = 'none';
              if (window.ws) {
                window.ws.close();
                getRecentMessagesRequest();
              }
            }, 300);
          }
        }
      };
    } else {
    }
  })
  .catch((error) => {
    console.log(error);
    // window.location.href = ownerError;
  });
}

/**
 * Retrieves and populates tenant data for editing.
 * @param {number} tenantId - The ID of the tenant to edit.
 */
function editTenant(tenantId) {
  fetch(host + "my-tenant", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({ "id": tenantId })
  })
  .then(response => {
    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            window.location.href = ownerLogSignURL;
        }
        window.location.href = ownerError;
        throw new Error('HTTP error ' + response.status);
    }
    return response.json();
  })
  .then(data => {
    document.getElementById('edit-lastname').value = data.lastname;
    document.getElementById('edit-firstname').value = data.firstname;
    document.getElementById('edit-contact-moov').value = data.contactmoov;
    document.getElementById('edit-contact-tg').value = data.contacttg;
    
    const fullDate = new Date(data.create_time);
    const formattedDate = fullDate.toISOString().split('T')[0];
    document.getElementById('edit-date').value = formattedDate;
    
    const submitButton = document.querySelector('#edit-tenant-form button[type="submit"]');
    const resetKeyButton = document.querySelector('#reset-tenant-key');
    submitButton.dataset.editingId = tenantId;
    resetKeyButton.dataset.editingId = tenantId;
  })
  .catch(error => {
    // window.location.href = ownerError;
  });
}

/**
 * Updates a tenant's information.
 * @param {number} editingId - The ID of the tenant being updated.
 */
function updateTenant(editingId) {
  const updatedData = {
    id: editingId,
    lastname: document.getElementById('edit-lastname').value,
    firstname: document.getElementById('edit-firstname').value,
    contactmoov: document.getElementById('edit-contact-moov').value,
    contacttg: document.getElementById('edit-contact-tg').value,
    date: document.getElementById('edit-date').value,
  };
  fetch(host + "update-tenant", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(updatedData)
  })
  .then(response => {
    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            window.location.href = ownerLogSignURL;
        }
        window.location.href = ownerError;
        throw new Error('HTTP error ' + response.status);
    }
    return response.json();
  })
  .then(data => {
    const formattedDate = new Date(data.create_time).toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).replace(',', '').replace(/\//g, '-');

    const row = document.getElementById("all-tenants-table")
      .querySelector(`tr[data-id="${editingId}"]`);
    if (row) {
      row.children[0].textContent = `${data.lastname} ${data.firstname}`;
      row.children[1].textContent = `${data.contactmoov}/${data.contacttg}`;
      row.children[6].textContent = formattedDate;
    }
    resetForm();
  })
  .catch(error => {
    window.location.href = ownerError;
  });
}

/**
 * Updates the tenant information when the form is submitted.
 */
function handleEditFormSubmit() {
  const submitButton = document.querySelector('#edit-tenant-form button[type="submit"]');
  submitButton.addEventListener('click', function(event) {
    event.preventDefault();
    const editingId = this.dataset.editingId;
    updateTenant(editingId);
  });
}

/**
 * Resets the form fields and hides the edit modal.
 */
function resetForm() {
  document.getElementById('edit-lastname').value = '';
  document.getElementById('edit-firstname').value = '';
  document.getElementById('edit-contact-moov').value = '';
  document.getElementById('edit-contact-tg').value = '';
  document.getElementById('edit-date').value = '';

  const editModal = document.getElementById('edit-modal');
  const editModalContent = editModal.querySelector('.modal-content');
  editModal.classList.remove('show');
  editModalContent.classList.remove('show');
}

/**
 * Deletes a tenant by ID.
 * @param {number} tenantId - The ID of the tenant to delete.
 */
function deleteTenant(tenantId) {
  fetch(host + "delete-tenant", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({ "id": tenantId })
  })
  .then(response => {
    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            window.location.href = ownerLogSignURL;
        }
        window.location.href = ownerError;
        throw new Error('HTTP error ' + response.status);
    }
    return response.json();
  })
  .then(data => {
    const row = document.getElementById("all-tenants-table")
      .querySelector(`tr[data-id="${tenantId}"]`);
    if (row) {
      row.remove();
      setNumberOfTenants(getNumberOfTenants() - 1);
      showNumberOfTenants();
    }
  })
  .catch(error => {
    window.location.href = ownerError;
  });
}

/**
 * Fetches recent messages for a specific tenant.
 * @param {number} tenantId - The ID of the tenant whose messages are to be fetched.
 */
function getMessagesRequest(tenantId) {
  fetch(host + 'get-messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({ "tenantId": tenantId })
  })
  .then(response => {
    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            window.location.href = ownerLogSignURL;
        }
        window.location.href = ownerError;
        throw new Error('HTTP error ' + response.status);
    }
    return response.json();
  })
  .then(data => {
    const messageList = document.getElementById('message-list');
    if (messageList) {
      messageList.innerHTML = '';
      data.forEach(message => {
        const messageItem = document.createElement('li');
        messageItem.textContent = message.content;
        messageList.appendChild(messageItem);
      });
    } else {
    }
  })
  .catch(error => {
    window.location.href = ownerError;
  });
}

/**
 * Handles the logic for deleting a message.
 * @param {number} tenantId - The ID of the tenant whose messages are being managed.
 */
function deleteMessageLogic(tenantId) {
  document.querySelectorAll('.delete-message-icon').forEach(icon => {
    icon.addEventListener('click', function() {
      const messageId = this.dataset.id;
      fetch(host + 'delete-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ "messageId": messageId })
      })
      .then(response => {
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                window.location.href = ownerLogSignURL;
            }
            window.location.href = ownerError;
            throw new Error('HTTP error ' + response.status);
        }
        return response.json();
      })
      .then(data => {
        getMessagesRequest(tenantId);
      })
      .catch(error => {
        window.location.href = ownerError;
      });
    });
  });
}

/**
 * Updates the tenant's key and copies the new key to the clipboard.
 * 
 * @param {number|string} editingId - The ID of the tenant whose key is being updated.
 * @returns {void}
 * 
 * This function sends a POST request to update the tenant's key based on the provided ID.
 * If the response is successful, it copies the new key to the clipboard and displays an alert.
 * In case of an HTTP error (401, 403, etc.), the user is redirected to the appropriate error page.
 * Any other errors will also redirect the user to an error page.
 */
function updateTenantKey(editingId) {
  const updatedData = {
    id : editingId
  };
  fetch(host + "update-tenant-key", {  
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body : JSON.stringify(updatedData)
  })
  .then(response => {
    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          window.location.href = ownerLogSignURL;
        }
        // Redirect in case of other HTTP errors (e.g., 500)
        window.location.href = ownerError;
        throw new Error('HTTP error ' + response.status); // Trigger the .catch by throwing an error
    }
    return response.json();
  })
  .then(data => {
    navigator.clipboard.writeText("Code : " + data.key).then(() => {
        alert('Code d\'activation copié dans le presse-papiers !');
    }).catch(err => {
      window.location.href = ownerError;
    });
    resetForm();
  })
  .catch(error => {
    window.location.href = ownerError;
  });
}
