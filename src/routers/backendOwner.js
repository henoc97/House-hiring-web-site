const express = require('express');
const router = express.Router();

// Middleware
const dbMiddleware = require('../../middlewares/http/database');
const authMiddleware = require('../../middlewares/http/auth')('owner');

// Controllers
const {
    getOtp,
    getResetPwdOtp,
    createUserOwner,
    userAuth,
    updateSold,
    updateOwner,
    myOwner,
    updatePwdOwner,
    insertSubscription,
    uploadImg
} = require('../../controller/owner/user');
const {
    createProperties,
    myProperties,
    myProperty,
    updateProperty,
    deleteProperty
} = require('../../controller/owner/property');
const {
    createTenant,
    tenantsProperties,
    recentTenants,
    allTenants,
    myTenant,
    updateTenant,
    updateTenantConnectKey,
    deleteTenant,
    deletePropertyTenant
} = require('../../controller/owner/tenant');
const {
    requireReceipt,
    receiptUnValid,
    receiptValid,
    validateReceipt,
    deleteReceipt
} = require('../../controller/owner/receipt');
const {
    myMessages,
    recentMessages,
    deleteMessage
} = require('../../controller/owner/support');
const { upload } = require('../../functions/storepicture');

// Apply database connection middleware to all routes.
router.use(dbMiddleware);

/**
 * Routes for user operations.
 */

/**
 * Generate OTP for user actions.
 * POST /get-otp
 */
router.post('/get-otp', getOtp);

/**
 * Create a new user owner.
 * POST /create-user-owner
 */
router.post('/create-user-owner', createUserOwner);

/**
 * User authentication.
 * POST /user-auth
 */
router.post('/user-auth', userAuth);

/**
 * Generate OTP for password reset.
 * POST /get-reset-pwd-otp
 */
router.post('/get-reset-pwd-otp', getResetPwdOtp);

/**
 * Reset password for user owner.
 * POST /reset-pwd
 */
router.post('/reset-pwd', updatePwdOwner);

// Apply authentication middleware to the following routes.
router.use(authMiddleware);

/**
 * Update user's sold status.
 * POST /update-sold
 */
router.post('/update-sold', updateSold);

/**
 * Get details of the authenticated owner.
 * POST /my-owner
 */
router.post('/my-owner', myOwner);

/**
 * Update details of the authenticated owner.
 * POST /update-owner
 */
router.post('/update-owner', updateOwner);

/**
 * Routes for property operations.
 */

/**
 * Create new property.
 * POST /create-properties
 */
router.post('/create-properties', createProperties);

/**
 * Get properties of the authenticated owner.
 * POST /my-properties
 */
router.post('/my-properties', myProperties);

/**
 * Update details of a property.
 * POST /update-property
 */
router.post('/update-property', updateProperty);

/**
 * Get details of a specific property.
 * POST /my-property
 */
router.post('/my-property', myProperty);

/**
 * Delete a property.
 * POST /delete-property
 */
router.post('/delete-property', deleteProperty);

/**
 * Routes for tenant operations.
 */

/**
 * Create a new tenant.
 * POST /create-tenant
 */
router.post('/create-tenant', createTenant);

/**
 * Get properties of tenants.
 * POST /tenants-properties
 */
router.post('/tenants-properties', tenantsProperties);

/**
 * Get recent tenants.
 * POST /recent-tenants
 */
router.post('/recent-tenants', recentTenants);

/**
 * Get all tenants.
 * POST /all-tenants
 */
router.post('/all-tenants', allTenants);

/**
 * Get details of a specific tenant.
 * POST /my-tenant
 */
router.post('/my-tenant', myTenant);

/**
 * Update details of a tenant.
 * POST /update-tenant
 */
router.post('/update-tenant', updateTenant);

/**
 * Update tenant's connection key.
 * POST /update-tenant-key
 */
router.post('/update-tenant-key', updateTenantConnectKey);

/**
 * Delete a tenant.
 * POST /delete-tenant
 */
router.post('/delete-tenant', deleteTenant);

/**
 * Delete property associated with a tenant.
 * POST /delete-tenant-property
 */
router.post('/delete-tenant-property', deletePropertyTenant);

/**
 * Routes for receipt operations.
 */

/**
 * Require a receipt.
 * POST /require-receipt
 */
router.post('/require-receipt', requireReceipt);

/**
 * Mark receipt as invalid.
 * POST /receipt-unValid
 */
router.post('/receipt-unValid', receiptUnValid);

/**
 * Mark receipt as valid.
 * POST /receipt-valid
 */
router.post('/receipt-valid', receiptValid);

/**
 * Validate a receipt.
 * POST /validate-receipt
 */
router.post('/validate-receipt', validateReceipt);

/**
 * Delete a receipt.
 * POST /delete-receipt
 */
router.post('/delete-receipt', deleteReceipt);

/**
 * Routes for message operations.
 */


/**
 * Get messages of the authenticated owner.
 * POST /my-messages
 */
router.post('/my-messages', myMessages);

/**
 * Get recent messages.
 * POST /recent-messages
 */
router.post('/recent-messages', recentMessages);

/**
 * Delete a message.
 * POST /delete-message
 */
router.post('/delete-message', deleteMessage);

/**
 * Delete a message.
 * POST /insert-subscription
 */
router.post("/insert-subscription", insertSubscription);

/**
 * Route to handle image uploads.
 * POST /upload
 */
router.post('/upload', upload.single('image'), uploadImg);

module.exports = router;
