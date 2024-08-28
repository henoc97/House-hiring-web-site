const express = require('express');
const router = express.Router();

// Middleware
const dbMiddleware = require('../../middlewares/http/database');
const authMiddleware = require('../../middlewares/http/auth');

// Controllers
const {
    getotp,
    userAuth,
    refreshToken,
    activateTenantAccount,
    setPwd,
    myTenant,
    updateTenant,
    updatePwdTenant
} = require('../../controller/tenant/user');
const {
    requireReceipt,
    receiptUnvalid,
    receiptValid,
    deleteReceipt
} = require('../../controller/tenant/receipt');
const {
    tenantProperty,
} = require('../../controller/tenant/property');
const {
    sendMessage,
    myMessages,
    deleteMessage
} = require('../../controller/tenant/support');

// Apply database connection middleware to all routes.
router.use(dbMiddleware);

/**
 * Routes for tenant account operations.
 */

/**
 * Activate a tenant's account.
 * POST /activate-tenant-account
 */
router.post('/activate-tenant-account', activateTenantAccount);

/**
 * Authenticate tenant account.
 * POST /auth-tenant-account
 */
router.post('/auth-tenant-account', userAuth);

/**
 * Reset tenant password.
 * POST /reset-pwd
 */
router.post('/reset-pwd', updatePwdTenant);

// Apply authentication middleware to the following routes.
router.use(authMiddleware);

/**
 * Routes for tenant operations.
 */

/**
 * Set new password for the tenant.
 * POST /set-pwd
 */
router.post('/set-pwd', setPwd);

/**
 * Get details of the authenticated tenant.
 * POST /my-tenant
 */
router.post('/my-tenant', myTenant);

/**
 * Update details of the authenticated tenant.
 * POST /update-tenant
 */
router.post('/update-tenant', updateTenant);

/**
 * Routes for receipt operations.
 */

/**
 * Request a receipt.
 * POST /require-receipt
 */
router.post('/require-receipt', requireReceipt);

/**
 * Mark receipt as invalid.
 * POST /receipt-unValid
 */
router.post('/receipt-unValid', receiptUnvalid);

/**
 * Mark receipt as valid.
 * POST /receipt-valid
 */
router.post('/receipt-valid', receiptValid);

/**
 * Delete a receipt.
 * POST /delete-receipt
 */
router.post('/delete-receipt', deleteReceipt);

/**
 * Routes for property operations.
 */

/**
 * Get properties associated with the tenant.
 * POST /tenant-property
 */
router.post('/tenant-property', tenantProperty);

/**
 * Routes for message operations.
 */

/**
 * Send a message.
 * POST /send-message
 */
router.post('/send-message', sendMessage);

/**
 * Get messages of the authenticated tenant.
 * POST /my-messages
 */
router.post('/my-messages', myMessages);

/**
 * Delete a message.
 * POST /delete-message
 */
router.post('/delete-message', deleteMessage);

module.exports = router;
