
const toggleIcon = document.getElementById('toggle-icon');
const propertyForm = document.getElementById('property-form');

if (toggleIcon && propertyForm) {
    toggleIcon.addEventListener('click', () => {
    const isFormVisible = propertyForm.style.display === 'block';
    propertyForm.style.display = isFormVisible ? 'none' : 'block';
    toggleIcon.className = isFormVisible ? 'bx bx-down-arrow' : 'bx bx-up-arrow';
    });
}
