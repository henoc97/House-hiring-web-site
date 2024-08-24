const express = require('express');
const router = express.Router();
const sharp = require('sharp');

const dbMiddleware = require('../../middlewares/http/database');
const authMiddleware = require('../../middlewares/http/auth');

const { getOtp, createUserOwner, userAuth, updateSold, refreshToken, updateOwner, myOwner, uploadImg } = require('../../controller/owner/user');
const { createProperties, myProperties, myProperty, updateProperty, deleteProperty } = require('../../controller/owner/property');
const { createTenant, tenantsProperties, recentTenants, allTenants, myTenant, updateTenant, deleteTenant, deletePropertyTenant } = require('../../controller/owner/tenant');
const { requireReceipt, receiptUnValid, receiptValid, validateReceipt, deleteReceipt} = require('../../controller/owner/receipt');
const { sendMessage, myMessages, RecentMessages, deleteMessage } = require('../../controller/owner/support');
const { upload } = require('../../functions/storepicture');



// Routes pour les utilisateurs
router.post("/get-otp", getOtp);
router.post("/refresh-token", refreshToken);

// Appliquer les middlewares à toutes les routes
router.use(dbMiddleware);

// Routes pour les utilisateurs
router.post("/create-user-owner", createUserOwner);
router.post("/user-auth", userAuth);

// Appliquer les middlewares à toutes les routes
router.use(authMiddleware);

// Routes pour les utilisateurs
router.post("/update-sold", updateSold);
router.post("/my-owner", myOwner);
router.post("/update-owner", updateOwner);

// Routes pour les propriétés
router.post("/create-properties", createProperties);
router.post("/my-properties", myProperties);
router.post("/update-property", updateProperty);
router.post("/my-property", myProperty);
router.post("/delete-property", deleteProperty);


// Routes pour les locataires
router.post("/create-tenant", createTenant);
router.post("/tenants-properties", tenantsProperties);
router.post("/recent-tenants", recentTenants);
router.post("/all-tenants", allTenants);
router.post("/my-tenant", myTenant);
router.post("/update-tenant", updateTenant);
router.post("/delete-tenant", deleteTenant);
router.post("/delete-tenant-property", deletePropertyTenant);


// Routes pour les reçus
router.post("/require-receipt", requireReceipt);
router.post("/receipt-unValid", receiptUnValid);
router.post("/receipt-valid", receiptValid);
router.post("/validate-receipt", validateReceipt);
router.post("/delete-receipt", deleteReceipt);

// Routes pour les messages
router.post("/send-message", sendMessage);
router.post("/my-messages", myMessages);
router.post("/recent-messages", RecentMessages);
router.post("/delete-message", deleteMessage);

// Route d'upload d'images
router.post('/upload', upload.single('image'), uploadImg);

module.exports = router;
