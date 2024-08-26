const express = require('express');
const router = express.Router();
const sharp = require('sharp');


const dbMiddleware = require('../../middlewares/http/database');
const authMiddleware = require('../../middlewares/http/auth');

const { getotp, userAuth, refreshToken, activateTenantAccount, setPwd, myTenant, updateTenant, updatePwdTenant} = require('../../controller/tenant/user');
const { requireReceipt, receiptUnvalid, receiptValid, deleteReceipt } = require('../../controller/tenant/receipt');
const { tenantProperty, myProperty } = require('../../controller/tenant/property');
const { sendMessage, myMessages, deleteMessage } = require('../../controller/tenant/support');


// Appliquer les middlewares à toutes les routes
router.use(dbMiddleware);

// Routes pour les utilisateurs
router.post("/activate-tenant-account", activateTenantAccount);
router.post("/auth-tenant-account", userAuth);
router.post("/reset-pwd", updatePwdTenant);

// Appliquer les middlewares à toutes les routes
router.use(authMiddleware);

// Routes pour les utilisateurs
router.post("/set-pwd", setPwd);
router.post("/my-tenant", myTenant);
router.post("/update-tenant", updateTenant);

// Routes pour les reçus
router.post("/require-receipt", requireReceipt);
router.post("/receipt-unValid", receiptUnvalid);
router.post("/receipt-valid", receiptValid);
router.post("/delete-receipt", deleteReceipt);

// Routes pour les tenant_property
router.post("/tenant-property", tenantProperty);
router.post("/my-property", myProperty);

// Routes pour les messages
router.post("/send-message", sendMessage);
router.post("/my-messages", myMessages);
router.post("/delete-message", deleteMessage);


module.exports = router;
