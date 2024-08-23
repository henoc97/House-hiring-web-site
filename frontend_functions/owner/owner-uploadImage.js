

function uploadedImageLogic(uploadForm) {
    uploadForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        
        const formData = new FormData();
        const fileInput = document.getElementById('image-upload');
        formData.append('image', fileInput.files[0]);
        let token = localStorage.getItem('accessToken');
        try {
            const response = await fetch(host + '/upload', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
                body: formData
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    alert("problem")
                    return renewAccessToken().then(() => uploadedImageLogic(uploadForm));
                }
                window.location.href = ownerError;
                throw new Error('Erreur lors de l\'upload du fichier');
            }

            const result = await response.json();
            const uploadedImage = document.getElementById('uploaded-image');
            // uploadedImage.src = result.filename;
            uploadedImage.src = result.imageUrl; // Utilisez imageUrl ici
            console.log('imageUrl: ' + result.imageUrl + ', filename: ' + result.filename)
            // uploadedImage.style.display = 'block';
            uploadedImage.classList.remove('hidden');
            uploadedImage.classList.add('visible');

            // Sauvegarder le nom du fichier dans le localStorage
            localStorage.setItem('uploadedImageFilename', result.imageUrl);
        } catch (error) {
            console.error(error);
            window.location.href = ownerError;
            alert('Une erreur est survenue lors de l\'upload du fichier');
        }
    });
}