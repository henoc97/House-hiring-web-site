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
  console.log("Function getNumberOfTenants is called");
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
 * Fetches all tenants and updates the UI accordingly.
 */
function getAllTenantsRequest() {
  const token = localStorage.getItem('accessToken');

  console.log('Fetching all tenants with token:', token);
  fetch(host + 'all-tenants', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
  })
  .then(response => {
    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            return renewAccessToken().then(() => getAllTenantsRequest());
        }
        window.location.href = ownerError;
        throw new Error('HTTP error ' + response.status);
    }
    return response.json();
  })
  .then(data => {
    console.log("Data received:", data);

    const allTenants = data;
    setNumberOfTenants(allTenants.length);
    showNumberOfTenants();
    
    const tableBody = document.getElementById("all-tenants-table");
    if (tableBody) {
      tableBody.innerHTML = '';

      allTenants.forEach((tenant) => {
        console.log("Tenant data:", tenant);
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
                console.log('WebSocket connection closed');
              }
            }, 300);
          }
        }
      };
    } else {
      console.error("Element with ID 'all-tenants-table' not found.");
    }
  })
  .catch((error) => {
    window.location.href = ownerError;
    console.error('Error fetching tenants:', error);
  });
}

/**
 * Retrieves and populates tenant data for editing.
 * @param {number} tenantId - The ID of the tenant to edit.
 */
function editTenant(tenantId) {
  const token = localStorage.getItem('accessToken');
  fetch(host + "my-tenant", {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ "id": tenantId })
  })
  .then(response => {
    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            return renewAccessToken().then(() => editTenant(tenantId));
        }
        window.location.href = ownerError;
        throw new Error('HTTP error ' + response.status);
    }
    return response.json();
  })
  .then(data => {
    console.log("Editing tenant:", data);
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
    window.location.href = ownerError;
    console.error('Error fetching tenant details:', error);
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
  const token = localStorage.getItem('accessToken');
  fetch(host + "update-tenant", {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedData)
  })
  .then(response => {
    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            return renewAccessToken().then(() => updateTenant(editingId));
        }
        window.location.href = ownerError;
        throw new Error('HTTP error ' + response.status);
    }
    return response.json();
  })
  .then(data => {
    console.log('Tenant updated:', data);
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
      row.children[3].textContent = formattedDate;
    }
    resetForm();
  })
  .catch(error => {
    window.location.href = ownerError;
    console.error('Error updating tenant:', error);
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
  const token = localStorage.getItem('accessToken');
  fetch(host + "delete-tenant", {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ "id": tenantId })
  })
  .then(response => {
    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            return renewAccessToken().then(() => deleteTenant(tenantId));
        }
        window.location.href = ownerError;
        throw new Error('HTTP error ' + response.status);
    }
    return response.json();
  })
  .then(data => {
    console.log('Tenant deleted:', data);
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
    console.error('Error deleting tenant:', error);
  });
}

/**
 * Fetches recent messages for a specific tenant.
 * @param {number} tenantId - The ID of the tenant whose messages are to be fetched.
 */
function getMessagesRequest(tenantId) {
  const token = localStorage.getItem('accessToken');
  fetch(host + 'get-messages', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ "tenantId": tenantId })
  })
  .then(response => {
    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            return renewAccessToken().then(() => getMessagesRequest(tenantId));
        }
        window.location.href = ownerError;
        throw new Error('HTTP error ' + response.status);
    }
    return response.json();
  })
  .then(data => {
    console.log("Messages received:", data);
    const messageList = document.getElementById('message-list');
    if (messageList) {
      messageList.innerHTML = '';
      data.forEach(message => {
        const messageItem = document.createElement('li');
        messageItem.textContent = message.content;
        messageList.appendChild(messageItem);
      });
    } else {
      console.error("Element with ID 'message-list' not found.");
    }
  })
  .catch(error => {
    window.location.href = ownerError;
    console.error('Error fetching messages:', error);
  });
}

/**
 * Handles sending a message to a tenant.
 * @param {number} tenantId - The ID of the tenant to send a message to.
 */
function sendMessageRequest(tenantId) {
  const submitButton = document.querySelector('#message-form button[type="submit"]');
  submitButton.addEventListener('click', function(event) {
    event.preventDefault();
    const messageContent = document.querySelector('#message-content').value;
    const token = localStorage.getItem('accessToken');
    fetch(host + 'send-message', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "tenantId": tenantId,
        "content": messageContent
      })
    })
    .then(response => {
      if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
              return renewAccessToken().then(() => sendMessageRequest(tenantId));
          }
          window.location.href = ownerError;
          throw new Error('HTTP error ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      console.log('Message sent:', data);
      document.querySelector('#message-content').value = '';
      getMessagesRequest(tenantId);
    })
    .catch(error => {
      window.location.href = ownerError;
      console.error('Error sending message:', error);
    });
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
      const token = localStorage.getItem('accessToken');
      fetch(host + 'delete-message', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "messageId": messageId })
      })
      .then(response => {
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                return renewAccessToken().then(() => deleteMessageLogic(tenantId));
            }
            window.location.href = ownerError;
            throw new Error('HTTP error ' + response.status);
        }
        return response.json();
      })
      .then(data => {
        console.log('Message deleted:', data);
        getMessagesRequest(tenantId);
      })
      .catch(error => {
        window.location.href = ownerError;
        console.error('Error deleting message:', error);
      });
    });
  });
}