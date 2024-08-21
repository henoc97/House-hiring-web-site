
function selectMonthsHelper(requireRecieptForm, tenantsPropertiesOption) {
    getTenantsPropertiesRequest(2);
    requireRecieptForm.addEventListener('submit', function(event) {
        event.preventDefault();
        requireRecieptRequest();
    });
    
    tenantsPropertiesOption.addEventListener('change', function() {
        const selectedOption = this.options[this.selectedIndex];
        const price = selectedOption.dataset.price;
        const sumPaid = document.getElementById('receipt-sumpayed');
        if (sumPaid) sumPaid.value = price ? price : '';
        updateSumpayed();
    });

    // Fonction pour générer les options des mois
    function generateMonthOptions(currentMonth, currentYear) {
        const months = [
            "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
            "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
        ];

        const monthsSelect = document.getElementById('receipt-months');
        monthsSelect.innerHTML = ''; // Vider les options existantes

        // Générer les 12 mois précédents
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

        // Générer le mois actuel et les 11 mois suivants
        for (let i = 0; i < 12; i++) {
            const monthName = months[currentMonth - 1];
            const monthYearKey = `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`;

            const option = document.createElement('option');
            option.value = monthYearKey;
            option.textContent = `${monthName} ${currentYear}`;
            monthsSelect.appendChild(option);

            // Passer au mois suivant
            currentMonth++;
            if (currentMonth > 12) {
                currentMonth = 1;
                currentYear++;
            }
        }
    }
        
        // Déterminer le mois et l'année de départ
        const startDate = new Date();
        const startMonth = startDate.getMonth() + 1; // Les mois commencent à 0 en JavaScript
        const startYear = startDate.getFullYear();
        
        // Générer les mois à partir du mois courant
        generateMonthOptions(startMonth, startYear);
        
        // Mettre à jour le coût total basé sur le locataire sélectionné et les mois sélectionnés
        function updateSumpayed() {
            const monthsSelect = document.getElementById('receipt-months');
            const selectedOption = tenantsPropertiesOption.selectedOptions[0];
            const pricePerMonth = parseFloat(selectedOption.dataset.price);
            const selectedMonths = Array.from(monthsSelect.selectedOptions);
            const monthsCount = selectedMonths.length;
            const sumPaid = document.getElementById('receipt-sumpayed')
            if (pricePerMonth && monthsCount > 0) {
                const totalCost = pricePerMonth * monthsCount;
                sumPaid.value = totalCost;
            } else {
                sumPaid.value = '';
            }
        }
    

    document.getElementById('receipt-months').addEventListener('change', function() {
        updateSumpayed();
        // Appel pour charger le propriétés de locataire au chargement de la page
        // getTenantsPropertiesRequest(2);
    });
  
}