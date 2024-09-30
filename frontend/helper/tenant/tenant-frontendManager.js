/**
 * Initialize the receipts table and its event listener.
 */
const receiptsTable = document.getElementById('receipts-table');
if (receiptsTable) {
  // Format local date and set it into dateTimeInput
  const dateTimeInput = document.getElementById('receipt-date-hour');
  const now = new Date();
  const formattedDateTime = now.toISOString().slice(0, 16);
  dateTimeInput.value = formattedDateTime;

  // Calls function to get invalid receipts, which in turn calls getValidReceiptsRequest
  getUnvalidReceiptsRequest();
}

// Add click event listener to the receipts table
receiptsTable.addEventListener('click', function (e) {
  e.preventDefault();
  accessReceipt(e);
});

/**
 * Initialize the receipt form and tenant property options.
 */
const requireRecieptForm = document.getElementById('receipt-form');
const tenantPropertyOption = document.getElementById(
  'receipt-tenant-property-option'
);
if (requireRecieptForm && tenantPropertyOption) {
  // Helper function to select months for receipts
  selectMonthsHelper(tenantPropertyOption);
}

/**
 * Update the total payments displayed on the page.
 */
const totalPayments = document.getElementById('total-payments');
totalPayments.textContent = getNumberOfPayments() ?? 0;

/**
 * Handle the password setting modal display.
 */
const modal = document.getElementById('modal-set-pwd');
const modalContent = document.querySelector('.modal-content');

let setPwd = localStorage.getItem('setPwd');
if (setPwd != 1 && modal && modalContent) {
  // Show the modal if password is not set
  modal.classList.remove('hidden');
  modal.classList.add('visible');

  setTimeout(() => {
    modal.classList.add('show');
    modalContent.classList.add('show');
  }, 10);

  const setpwdForm = document.getElementById('set-pwd-form');
  if (setpwdForm) {
    const userNameDiv = document.getElementById('user-name');
    if (userNameDiv) {
      // Reset and set the user name in the modal
      userNameDiv.textContent = '';
      userNameDiv.textContent = localStorage.getItem('userName');
    }
    // Add event listener for form submission
    setpwdForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      setpwdRequest();
    });
  }
}

const userName = document.querySelector('.username-wrapper#username h3');
if (userName) userName.textContent = localStorage.getItem('userName');

/**
 * Toggle sidebar visibility.
 */
document.getElementById('btn').addEventListener('click', function () {
  document.querySelector('.sidebar').classList.toggle('open');
});

/**
 * Handle menu link clicks and load corresponding content.
 */
const menuLinks = document.querySelectorAll('.sidebar ul li a');

menuLinks.forEach((link) => {
  link.addEventListener('click', function (e) {
    e.preventDefault();

    // Remove active class from all menu links
    menuLinks.forEach((l) => l.classList.remove('active'));

    // Add active class to the clicked link
    this.classList.add('active');

    // Clear the current details section
    document.querySelector('.details').innerHTML = '';

    // Fetch and display content based on the clicked menu item
    if (this.id === 'dash-button') {
      fetch(tenantURL + '/dashboard')
        .then((response) => response.text())
        .then((data) => {
          document.querySelector('.details').innerHTML = data;

          const receiptsTable = document.getElementById('receipts-table');
          const tenantPropertyOption = document.getElementById(
            'receipt-tenant-property-option'
          );
          selectMonthsHelper(tenantPropertyOption); // Helper for selecting receipt months
          if (receiptsTable) {
            getUnvalidReceiptsRequest(); // Calls function to get invalid receipts
            // Format local date and set it into dateTimeInput
            const dateTimeInput = document.getElementById('receipt-date-hour');
            const now = new Date();
            const formattedDateTime = now.toISOString().slice(0, 16);
            dateTimeInput.value = formattedDateTime;
            receiptsTable.addEventListener('click', function (e) {
              e.preventDefault();
              accessReceipt(e);
            });
          }
        });
    }

    if (this.id === 'discuss-button') {
      fetch(tenantURL + '/discussion')
        .then((response) => response.text())
        .then((data) => {
          document.querySelector('.details').innerHTML = data;

          const messageForm = document.getElementById('message-form');

          if (messageForm) {
            sendMessageRequest();
          }
          getMessagesRequest();
          deleteMessageLogic();
        });
    }

    if (this.id === 'profile-button') {
      fetch(tenantURL + '/profile')
        .then((response) => response.text())
        .then((data) => {
          document.querySelector('.details').innerHTML = data;

          const tenantForm = document.getElementById('tenant-form');
          if (tenantForm) {
            getTenantPropertyRequest(1);
            tenantForm.addEventListener('submit', async function (e) {
              e.preventDefault();
              updateTenant();
            });
          }
        });
    }
  });
});
