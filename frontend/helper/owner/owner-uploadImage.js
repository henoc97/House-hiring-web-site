/**
 * Handles the logic for uploading an image through a form submission.
 * @param {HTMLFormElement} uploadForm - The form element used for image upload.
 */
function uploadedImageLogic(uploadForm) {
    uploadForm.addEventListener('submit', async function (e) {
        e.preventDefault(); // Prevents the default form submission
        
        const formData = new FormData(); // Creates a new FormData object
        const fileInput = document.getElementById('image-upload'); // Retrieves the file input element
        formData.append('image', fileInput.files[0]); // Appends the selected file to FormData
        
        let token = localStorage.getItem('accessToken'); // Retrieves the access token from localStorage
        
        try {
            // Sends a POST request to upload the image
            const response = await fetch(host + '/upload', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + token, // Sets the Authorization header
                },
                body: formData // Sends the FormData object as the request body
            });
            
            // Checks if the response is not OK
            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    alert("Problème avec l'authentification. Renouvellement du token d'accès.");
                    // Attempts to renew the access token and retries the upload
                    return renewAccessToken().then(() => uploadedImageLogic(uploadForm));
                }
                window.location.href = ownerError; // Redirects to an error page
                throw new Error('Erreur lors de l\'upload du fichier'); // Throws an error if the response is not OK
            }

            const result = await response.json(); // Parses the response as JSON
            const uploadedImage = document.getElementById('uploaded-image'); // Retrieves the image element
            uploadedImage.src = result.imageUrl; // Sets the src attribute to the uploaded image URL
            console.log('imageUrl: ' + result.imageUrl + ', filename: ' + result.filename);
            // Updates the display of the uploaded image
            uploadedImage.classList.remove('hidden');
            uploadedImage.classList.add('visible');
            uploadForm.reset(); // Resets the form after upload
            
            // Updates the balance and shows the new balance
            updateSoldRequest(insertPic);
            showNewSold();
        } catch (error) {
            console.error(error); // Logs any errors
            window.location.href = ownerError; // Redirects to an error page if an exception is caught
        }
    });
}