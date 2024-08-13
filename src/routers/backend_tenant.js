const express = require('express');
const router = express.Router();
const sharp = require('sharp');

const { getotp, userauth, refreshToken, activateTenantAccount, setpwd } = require('../../controller/tenant/user');
// const { createProperties, myProperties, myProperty, updateProperty } = require('../../controller/tenant/property');
// const { createTenant, TenantsProperties, recentTenants, allTenants, myTenant, updateTenant } = require('../../controller/tenant/tenant');
// const { require_receipt, receipt_unValid, receipt_valid, validateReceipt } = require('../../controller/tenant/receipt');
const { upload } = require('../../functions/storepicture');

// Routes pour les utilisateurs
router.post("/getotp", getotp);
router.post("/userauth", userauth);
router.post("/refreshToken", refreshToken);
router.post("/activateTenantAccount", activateTenantAccount);
router.post("/setpwd", setpwd);


module.exports = router;
