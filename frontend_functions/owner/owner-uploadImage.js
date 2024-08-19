

function uploadedImageLogic(uploadForm) {
    uploadForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        
        const formData = new FormData();
        const fileInput = document.getElementById('image-upload');
        formData.append('image', fileInput.files[0]);

        try {
            const response = await fetch(host + '/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Erreur lors de l\'upload du fichier');
            }

            const result = await response.json();
            const uploadedImage = document.getElementById('uploaded-image');
            uploadedImage.src = result.filename;
            // uploadedImage.style.display = 'block';
            uploadedImage.classList.add('hidden');
            uploadedImage.classList.add('visible');

            // Sauvegarder le nom du fichier dans le localStorage
            localStorage.setItem('uploadedImageFilename', result.filename);
        } catch (error) {
            console.error(error);
            alert('Une erreur est survenue lors de l\'upload du fichier');
        }
      });
}