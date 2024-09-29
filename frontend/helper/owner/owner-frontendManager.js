// Add an event listener for when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Select the table elements
    const recentTenantsTable = document.getElementById('recent-tenants-table');

    const searchInput = document.getElementById("search-input");

    // If the recent tenants table exists, perform initial requests
    if (recentTenantsTable) {
        getUnvalidReceiptsRequest(false);
        searchInput.addEventListener("input", function () {
            this.value !== "" ? getUnvalidReceiptsRequest(true)
                : getUnvalidReceiptsRequest(false)
            // Tu peux ajouter ici une fonction à exécuter lors du changement de l'input.
        });
        getRecentTenantsRequest(); // Fetch recent tenants 
        updateSoldRequest(0); // Update sold items with a default value
    }

    // Update the total tenants count
    const totalTenants = document.getElementById('total-tenants');
    totalTenants.textContent = getNumberOfTenants() ?? 0;

    // Update the total tenants properties count
    const totalTenantsProperties = document.getElementById('total-tenants-properties');
    totalTenantsProperties.textContent = getNumberOfTenantsProperties() ?? 0;

    // Update the total properties count
    const totalProperties = document.getElementById('total-properties');
    totalProperties.textContent = getNumberOfProperties() ?? 0;

    // Update the total payments count
    const totalPayments = document.getElementById('total-payments');
    totalPayments.textContent = getNumberOfPayments() ?? 0;

    // Show new sold items
    showNewSold();

    // Add an event listener for clicks on the invalid receipts table
    const unValidReceiptsTable = document.getElementById('unvalid-receipts-table');
    unValidReceiptsTable.addEventListener('click', function (e) {
        accessReceipt(e); // Handle receipt access
    });

    // Add an event listener for the sidebar toggle button
    document.getElementById('btn').addEventListener('click', function () {
        document.querySelector('.sidebar').classList.toggle('open'); // Toggle sidebar open state
    });


    // Select all menu links
    const menuLinks = document.querySelectorAll('.sidebar ul li a');

    // Add click event listeners to all menu links
    menuLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent default link behavior

            // Remove active class from all links
            menuLinks.forEach(l => l.classList.remove('active'));

            // Add active class to the clicked link
            this.classList.add('active');

            // Clear the details section
            document.querySelector('.details').innerHTML = '';

            // Handle dashboard button click
            if (this.id === 'dash-button') {
                fetch(ownerURL + '/dashboard')
                    .then(response => response.text())
                    .then(data => {
                        document.querySelector('.details').innerHTML = data;

                        // Reinitialize tables and add event listeners
                        const unValidReceiptsTable = document.getElementById('unvalid-receipts-table');
                        const recentTenantsTable = document.getElementById('recent-tenants-table');
                        if (recentTenantsTable && unValidReceiptsTable) {
                            getUnvalidReceiptsRequest(false);
                            searchInput.addEventListener("input", function () {
                                this.value !== "" ? getUnvalidReceiptsRequest(true)
                                    : getUnvalidReceiptsRequest(false)
                                // Tu peux ajouter ici une fonction à exécuter lors du changement de l'input.
                            });
                            getRecentTenantsRequest();
                            unValidReceiptsTable.addEventListener('click', function (e) {
                                accessReceipt(e); // Handle receipt access
                            });
                        }
                    });
            }

            // Handle profile button click
            if (this.id === 'profile-button') {
                fetch(ownerURL + '/profile')
                    .then(response => response.text())
                    .then(data => {
                        document.querySelector('.details').innerHTML = data;
                        const uploadForm = document.getElementById('upload-form');
                        const ownerForm = document.getElementById('owner-form');
                        if (ownerForm) {
                            getOwner(); // Fetch owner data
                            ownerForm.addEventListener('submit', async function (e) {
                                e.preventDefault(); // Prevent form submission
                                updateOwner(); // Update owner data
                            });
                        }
                        if (uploadForm) {
                            uploadedImageLogic(uploadForm); // Handle image upload
                        }
                    });
            }

            // Handle properties button click
            if (this.id === 'proprietes-button') {
                fetch(ownerURL + '/properties')
                    .then(response => response.text())
                    .then(data => {
                        document.querySelector('.details').innerHTML = data;
                        const propertyForm = document.getElementById('property-form');
                        const propertiesTable = document.getElementById('my-properties-table');
                        if (propertyForm && propertiesTable) {
                            // Add event listener to the property form
                            propertyForm.addEventListener('submit', function (event) {
                                event.preventDefault(); // Prevent page reload
                                const submitButton = event.target.querySelector('#property-form button[type="submit"]');
                                const editingId = submitButton.dataset.editingId;
                                if (editingId && submitButton.textContent === "Modifier") {
                                    // Edit mode
                                    updateProperty(editingId);
                                } else {
                                    // Add mode
                                    createPropertyRequest();
                                }
                            });
                            getPropertiesRequest(1, false); // Fetch properties
                            searchInput.addEventListener("input", function () {
                                this.value !== "" ? getPropertiesRequest(1, true) // Search tenants
                                    : getPropertiesRequest(1, false) // Fetch all tenants
                                // Tu peux ajouter ici une fonction à exécuter lors du changement de l'input.
                            });
                        }
                    });
            }

            // Handle tenants button click
            if (this.id === 'tenant-button') {
                fetch(ownerURL + '/tenants')
                    .then(response => response.text())
                    .then(data => {
                        document.querySelector('.details').innerHTML = data;
                        const tenantsTable = document.getElementById('all-tenants-table');
                        const editTenantForm = document.getElementById('edit-tenant-form');
                        const messageForm = document.getElementById('message-form');
                        if (tenantsTable && searchInput) {
                            getAllTenantsRequest(false) // Fetch all tenants
                            searchInput.addEventListener("input", function () {
                                this.value !== "" ? getAllTenantsRequest(true) // Search tenants
                                    : getAllTenantsRequest(false) // Fetch all tenants
                            });
                        }
                        if (editTenantForm) {
                            editTenantForm.addEventListener('submit', function (event) {
                                event.preventDefault(); // Prevent page reload
                                const submitButton = event.target.querySelector('#edit-tenant-form button[type="submit"]');
                                const editingId = submitButton.dataset.editingId;
                                if (editingId) {
                                    updateTenant(editingId); // Update tenant data
                                }
                            });
                            const resetKeyButton = document.querySelector('#reset-tenant-key');
                            resetKeyButton.onclick = () => {
                                const editingId2 = resetKeyButton.dataset.editingId;
                                if (editingId2) {
                                    updateTenantKey(editingId2); // Update tenant key
                                }
                            };
                        }
                        if (messageForm) {
                            messageForm.addEventListener('submit', function (event) {
                                event.preventDefault(); // Prevent page reload
                                const submitButton = event.target.querySelector('#message-form button[type="submit"]');
                                const tenantId = submitButton.dataset.tenantId;
                                if (tenantId) {
                                    // sendMessageRequest(tenantId); // Send message request
                                }
                            });
                        }
                        // Fetch recent messages
                        getRecentMessagesRequest();
                    });
            }

            // Handle tenant home button click
            if (this.id === 'tenant-home-button') {
                fetch(ownerURL + '/tenant-home')
                    .then(response => response.text())
                    .then(data => {
                        document.querySelector('.details').innerHTML = data;

                        const tenantproperty = document.getElementById("tenants-properties-table");
                        const tenantForm = document.getElementById("tenant-form");
                        if (tenantForm && tenantproperty) {
                            getTenantsPropertiesRequest(1, false); // Fetch tenant properties
                            searchInput.addEventListener("input", function () {
                                this.value !== "" ? getTenantsPropertiesRequest(1, true) // Search tenant properties
                                    : getTenantsPropertiesRequest(1, false) // Fetch all tenant properties
                            });
                            getPropertiesRequest(2, false); // Fetch properties
                            tenantForm.addEventListener('submit', function (event) {
                                event.preventDefault(); // Prevent page reload
                                createTenantRequest(); // Create new tenant request
                            });
                        }
                    });
            }

            // Handle my receipts button click
            if (this.id === 'myreceipt-button') {
                fetch(ownerURL + '/receipts')
                    .then(response => response.text())
                    .then(data => {
                        document.querySelector('.details').innerHTML = data;
                        const validReceiptsTable = document.getElementById("valid-receipts-table");
                        if (validReceiptsTable) {
                            // Fetch valid receipts
                            getValidReceiptsRequest(false);
                            searchInput.addEventListener("input", function () {
                                this.value !== "" ? getValidReceiptsRequest(true) 
                                    : getValidReceiptsRequest(false) 
                                // Tu peux ajouter ici une fonction à exécuter lors du changement de l'input.
                            });
                        }
                        validReceiptsTable.addEventListener('click', function (e) {
                            accessReceipt(e); // Handle receipt access
                        });
                        const requireRecieptForm = document.getElementById("receipt-form");
                        const tenantsPropertiesoption = document.getElementById("tenants-properties-option");
                        if (tenantsPropertiesoption && requireRecieptForm) {
                            // Format local date and set it into dateTimeInput
                            const dateTimeInput = document.getElementById('receipt-date-hour');
                            const now = new Date();
                            const formattedDateTime = now.toISOString().slice(0, 16);
                            dateTimeInput.value = formattedDateTime;

                            selectMonthsHelper(requireRecieptForm, tenantsPropertiesoption); // Help select months for receipts
                        }
                    });
            }

            // Handle subscription button click
            if (this.id === 'subscription-button') {
                fetch(ownerURL + '/subscription')
                    .then(response => response.text())
                    .then(data => {
                        document.querySelector('.details').innerHTML = data;
                        const subscriptionForm = document.getElementById('subscription-form');
                        subscriptionForm.addEventListener('submit', function (e) {
                            e.preventDefault(); // Prevent form submission
                            insertSubscription(); // Insert subscription
                        });
                    });
            }
        });
    });
});
