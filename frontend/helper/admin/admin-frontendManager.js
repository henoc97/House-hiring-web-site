/**
 * Initializes event listeners and fetches data for the page elements.
 * Handles form submission, sidebar toggle, and menu link clicks.
 */

// Get the table element for subscriptions
const subscriptionsTable = document.getElementById('subscriptions-table');
if (subscriptionsTable) {
    // Fetch subscription data if the table is present
    getSubscriptionsRequest();
}

// Get the subscription form element
const subscriptionForm = document.getElementById('subscription-form');
if (subscriptionForm) {
    /**
     * Handles the form submission event to insert a new subscription.
     * Prevents default form submission behavior and calls the `insertSubscription` function.
     * @param {Event} e - The submit event object.
     */
    subscriptionForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent the default form submission
        insertSubscriptionAdmin(); // Call the function to insert a new subscription
    });
}

// Add click event listener to the toggle button
document.getElementById('btn').addEventListener('click', function() {
    // Toggle the 'open' class on the sidebar to show or hide it
    document.querySelector('.sidebar').classList.toggle('open');
});

// Select all menu links within the sidebar
const menuLinks = document.querySelectorAll('.sidebar ul li a');

/**
 * Adds click event listeners to menu links for handling navigation and content display.
 * @param {NodeListOf<HTMLElement>} menuLinks - The menu links to add event listeners to.
 */
menuLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent the default link behavior

        // Remove the 'active' class from all menu links
        menuLinks.forEach(l => l.classList.remove('active'));

        // Add the 'active' class to the clicked link
        this.classList.add('active');

        // Clear the current details section
        document.querySelector('.details').innerHTML = '';

        // Fetch and display content based on the clicked menu link
        if (this.id === 'dash-button') {
            fetch(adminURL + '/admin-dashboard')
                .then(response => response.text())
                .then(data => {
                    // Update the details section with the fetched data
                    document.querySelector('.details').innerHTML = data;
                    
                    // Reinitialize the subscriptions table if present
                    const subscriptionsTable = document.getElementById('subscriptions-table');
                    if (subscriptionsTable) {
                        getSubscriptionsRequest();
                    }
                })
                .catch(error => {
                    // Handle fetch errors
                    // console.error('Error fetching dashboard data:', error);
                });
        }
    });
});
