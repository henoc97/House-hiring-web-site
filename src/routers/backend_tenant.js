const express = require('express');
const router = express.Router();
const sharp = require('sharp');


const dbMiddleware = require('../../middlewares/http/database');
const authMiddleware = require('../../middlewares/http/auth');

const { getotp, userauth, refreshToken, activateTenantAccount, setpwd } = require('../../controller/tenant/user');
const { require_receipt, receipt_unValid, receipt_valid } = require('../../controller/tenant/receipt');
const { tenantProperty } = require('../../controller/tenant/property');
const { sendMessage, myMessages, deleteMessage } = require('../../controller/tenant/support');

const { upload } = require('../../functions/storepicture');


// Appliquer les middlewares à toutes les routes
router.use(dbMiddleware);

// Routes pour les utilisateurs
router.post("/activateTenantAccount", activateTenantAccount);

// Appliquer les middlewares à toutes les routes
router.use(authMiddleware);

// Routes pour les utilisateurs
router.post("/setpwd", setpwd);

// Routes pour les reçus
router.post("/require_receipt", require_receipt);
router.post("/receipt_unValid", receipt_unValid);
router.post("/receipt_valid", receipt_valid);

// Routes pour les tenant_property
router.post("/tenantProperty", tenantProperty);

// Routes pour les messages
router.post("/sendMessage", sendMessage);
router.post("/myMessages", myMessages);
router.post("/deleteMessage", deleteMessage);


module.exports = router;
