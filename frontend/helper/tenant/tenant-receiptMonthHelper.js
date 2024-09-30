/**
 * Initializes the month selection helper for the tenant property form.
 * Sets up event listeners for form submission and changes in tenant property options.
 * Generates month options for selection and updates the total cost based on selected options.
 * @function
 * @param {HTMLElement} tenantPropertyOption - The HTML select element for tenant property options.
 * @returns {void}
 */
function selectMonthsHelper(tenantPropertyOption) {
  // Request tenant property information
  getTenantPropertyRequest(2);

  // Add event listener for form submission
  requireRecieptForm.addEventListener('submit', function (event) {
    event.preventDefault();
    requireRecieptRequest();
  });

  // Update receipt amount based on the selected tenant property option
  tenantPropertyOption.addEventListener('change', function () {
    const selectedOption = this.options[this.selectedIndex];
    const price = selectedOption.dataset.price;
    document.getElementById('receipt-sumpayed').value = price ? price : '';
  });

  /**
   * Generates and populates the month options in the receipt form.
   * @param {number} currentMonth - The current month (1-12).
   * @param {number} currentYear - The current year.
   * @returns {void}
   */
  function generateMonthOptions(currentMonth, currentYear) {
    const months = [
      'Janvier',
      'Février',
      'Mars',
      'Avril',
      'Mai',
      'Juin',
      'Juillet',
      'Août',
      'Septembre',
      'Octobre',
      'Novembre',
      'Décembre',
    ];

    const monthsSelect = document.getElementById('receipt-months');
    monthsSelect.innerHTML = ''; // Clear existing options

    // Generate the previous 12 months
    for (let i = 12; i > 0; i--) {
      let previousMonth = currentMonth - i;
      let previousYear = currentYear;

      if (previousMonth < 1) {
        previousMonth += 12;
        previousYear -= 1;
      }

      const monthName = months[previousMonth - 1];
      const monthYearKey = `${previousYear}-${String(previousMonth).padStart(2, '0')}-01`;

      const option = document.createElement('option');
      option.value = monthYearKey;
      option.textContent = `${monthName} ${previousYear}`;
      monthsSelect.appendChild(option);
    }

    // Generate the current month and the next 11 months
    for (let i = 0; i < 12; i++) {
      const monthName = months[currentMonth - 1];
      const monthYearKey = `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`;

      const option = document.createElement('option');
      option.value = monthYearKey;
      option.textContent = `${monthName} ${currentYear}`;
      monthsSelect.appendChild(option);

      // Move to the next month
      currentMonth++;
      if (currentMonth > 12) {
        currentMonth = 1;
        currentYear++;
      }
    }
  }

  // Determine the start month and year
  const startDate = new Date();
  const startMonth = startDate.getMonth() + 1; // Months are 0-indexed in JavaScript
  const startYear = startDate.getFullYear();

  // Generate months from the current month
  generateMonthOptions(startMonth, startYear);

  /**
   * Updates the total amount to be paid based on the selected tenant property and months.
   * @returns {void}
   */
  function updateSumpayed() {
    const selectedOption = document.getElementById(
      'receipt-tenant-property-option'
    ).selectedOptions[0];
    const pricePerMonth = parseFloat(selectedOption.dataset.price);
    const selectedMonths = Array.from(
      document.getElementById('receipt-months').selectedOptions
    );
    const monthsCount = selectedMonths.length;

    if (pricePerMonth && monthsCount > 0) {
      const totalCost = pricePerMonth * monthsCount;
      document.getElementById('receipt-sumpayed').value = totalCost;
    } else {
      document.getElementById('receipt-sumpayed').value = '';
    }
  }

  // Add event listener for changes in month selection
  document
    .getElementById('receipt-months')
    .addEventListener('change', function () {
      updateSumpayed();
      // Call to load tenant properties on page load
      getTenantPropertyRequest(2);
    });
}
