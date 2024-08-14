const express = require('express');
const router = express.Router();
const sharp = require('sharp');

const { getotp, createUserOwner, userauth, updateSold, refreshToken, updateOwner, myOwner } = require('../../controller/owner/user');
const { createProperties, myProperties, myProperty, updateProperty } = require('../../controller/owner/property');
const { createTenant, TenantsProperties, recentTenants, allTenants, myTenant, updateTenant } = require('../../controller/owner/tenant');
const { require_receipt, receipt_unValid, receipt_valid, validateReceipt } = require('../../controller/owner/receipt');
const { sendMessage, myMessages, deleteMessage } = require('../../controller/owner/support');
const { upload } = require('../../functions/storepicture');

// Routes pour les utilisateurs
router.post("/getotp", getotp);
router.post("/createUserOwner", createUserOwner);
router.post("/userauth", userauth);
router.post("/updateSold", updateSold);
router.post("/refreshToken", refreshToken);
router.post("/myOwner", myOwner);
router.post("/updateOwner", updateOwner);

// Routes pour les propriétés
router.post("/createProperties", createProperties);
router.post("/myProperties", myProperties);
router.post("/updateProperty", updateProperty);
router.post("/myProperty", myProperty);


// Routes pour les locataires
router.post("/createTenant", createTenant);
router.post("/TenantsProperties", TenantsProperties);
router.post("/recentTenants", recentTenants);
router.post("/allTenants", allTenants);
router.post("/myTenant", myTenant);
router.post("/updateTenant", updateTenant);


// Routes pour les reçus
router.post("/require_receipt", require_receipt);
router.post("/receipt_unValid", receipt_unValid);
router.post("/receipt_valid", receipt_valid);
router.post("/validateReceipt", validateReceipt);

// Routes pour les messages
router.post("/sendMessage", sendMessage);
router.post("/myMessages", myMessages);
router.post("/deleteMessage", deleteMessage);

// Route d'upload d'images
router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        // Vérifier si un fichier a été téléchargé
        if (!req.file) {
            return res.status(400).json({ message: 'Aucun fichier téléchargé' });
        }

        // // Traiter l'image avec sharp (si nécessaire)
        // const imagePath = req.file.path;
        // const processedImagePath = `public/img/${req.file.filename}`;

        // await sharp(imagePath)
        //     .resize(800) // Redimensionner l'image si nécessaire
        //     .toFile(processedImagePath);

        // Répondre avec l'URL de l'image et le nom du fichier
        res.status(200).json({
            imageUrl: `/img/${req.file.filename}`, // Chemin accessible publiquement
            filename: req.file.filename
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur lors de l\'upload du fichier' });
    }
});

module.exports = router;
