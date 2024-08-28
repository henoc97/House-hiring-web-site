/**
 * Initializes the month selection helper by setting up event listeners and generating month options.
 * This function handles the form submission, updates the payment amount based on selected months,
 * and dynamically generates month options in the form.
 *
 * @param {HTMLFormElement} requireRecieptForm - The form element used for requesting receipts.
 * @param {HTMLSelectElement} tenantsPropertiesOption - The select element containing tenant properties options.
 */
function selectMonthsHelper(requireRecieptForm, tenantsPropertiesOption) {
    // Fetch tenant properties and update the form when it is submitted
    getTenantsPropertiesRequest(2);
    requireRecieptForm.addEventListener('submit', function(event) {
        event.preventDefault();
        requireRecieptRequest();
    });

    // Update the payment amount when the tenant property option changes
    tenantsPropertiesOption.addEventListener('change', function() {
        const selectedOption = this.options[this.selectedIndex];
        const price = selectedOption.dataset.price;
        const sumPaid = document.getElementById('receipt-sumpayed');
        if (sumPaid) sumPaid.value = price ? price : '';
        updateSumpayed();
    });

    /**
     * Generates month options for the select element based on the current month and year.
     * This function creates options for the previous 12 months and the current month plus the next 11 months.
     *
     * @param {number} currentMonth - The current month (1-12).
     * @param {number} currentYear - The current year.
     */
    function generateMonthOptions(currentMonth, currentYear) {
        const months = [
                "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
                "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
            ];

        const monthsSelect = document.getElementById('receipt-months');
        monthsSelect.innerHTML = ''; // Clear existing options

        // Generate the 12 previous months
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

    // Determine the starting month and year
    const startDate = new Date();
    const startMonth = startDate.getMonth() + 1; // Months start at 0 in JavaScript
    const startYear = startDate.getFullYear();

    // Generate month options starting from the current month
    generateMonthOptions(startMonth, startYear);

    /**
     * Updates the total payment amount based on the selected months and property price.
     * This function calculates the total cost by multiplying the price per month with the number of selected months.
     */
    function updateSumpayed() {
        const monthsSelect = document.getElementById('receipt-months');
        const selectedOption = tenantsPropertiesOption.selectedOptions[0];
        const pricePerMonth = parseFloat(selectedOption.dataset.price);
        const selectedMonths = Array.from(monthsSelect.selectedOptions);
        const monthsCount = selectedMonths.length;
        const sumPaid = document.getElementById('receipt-sumpayed');
        if (pricePerMonth && monthsCount > 0) {
            const totalCost = pricePerMonth * monthsCount;
            sumPaid.value = totalCost;
        } else {
            sumPaid.value = '';
        }
    }

    // Update payment amount when months are selected
    document.getElementById('receipt-months').addEventListener('change', function() {
        updateSumpayed();
    });
}
