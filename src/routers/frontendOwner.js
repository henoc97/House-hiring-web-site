const express = require('express');
const router = express.Router();
require('dotenv').config();

/**
 * Renders the owner sign-in and log-in page.
 * GET /owner-sign-log
 */
router.get('/owner-sign-log', (req, res) => {
    res.render('owner-sign-log', {
        nonce: res.locals.nonce // Passes nonce for CSP
    });
});

/**
 * Renders the owner redirect page.
 * GET /owner-redirect
 */
router.get('/owner-redirect', (req, res) => {
    res.render('owner-redirect');
});

/**
 * Renders the page to send an email for resetting the password.
 * GET /owner-send-email
 */
router.get('/owner-send-email', (req, res) => {
    res.render('owner-send-email-reset-pwd-otp');
});

/**
 * Renders the owner password reset page.
 * GET /owner-reset-pwd
 */
router.get('/owner-reset-pwd', (req, res) => {
    res.render('owner-reset-pwd');
});

/**
 * Renders the error page for owner requests.
 * GET /owner-error
 */
router.get('/owner-error', (req, res) => {
    res.render('error-owner-request');
});

/**
 * Renders the main owner page with sidebar, topbar, and various sections.
 * GET /owner
 */
router.get('/owner', (req, res) => {
    res.render('owner-index', {
        nonce: res.locals.nonce, // Passes nonce for CSP
        sidebar: 'owner-sidebar',
        topbar: 'owner-topbar',
        cardboxes: 'owner-cardboxes',
        recentPayments: 'owner-recent-payments',
        recentTenants: 'owner-recent-tenants'
    });
});

/**
 * Renders the owner dashboard page with recent payments and tenants.
 * GET /owner-dashboard
 */
router.get('/owner-dashboard', (req, res) => {
    res.render('_owner-dashboard', {
        nonce: res.locals.nonce, // Passes nonce for CSP
        recentPayments: 'owner-recent-payments',
        recentTenants: 'owner-recent-tenants'
    });
});

/**
 * Renders the owner profile page with account info, signature upload, and payment modalities.
 * GET /owner-profile
 */
router.get('/owner-profile', (req, res) => {
    res.render('_owner-profile', {
        accountInfo: 'owner-account-info',
        uploadSignature: 'owner-upload-signature',
        paymentModalities: 'owner-payment-modalities'
    });
});

/**
 * Renders the page for managing properties with an option to add a new property.
 * GET /owner-properties
 */
router.get('/owner-properties', (req, res) => {
    res.render('_owner-properties', {
        myProperties: 'owner-my-properties',
        addPropertyForm: 'owner-add-property-form'
    });
});

/**
 * Renders the page for managing tenant properties with an option to add a new tenant.
 * GET /owner-tenant-home
 */
router.get('/owner-tenant-home', (req, res) => {
    res.render('_owner-tenants-properties', {
        tenantsProperties: 'owner-tenants-properties',
        addTenantForm: 'owner-add-tenant-form'
    });
});

/**
 * Renders the page for managing tenants with options to edit tenants and view messages.
 * GET /owner-tenants
 */
router.get('/owner-tenants', (req, res) => {
    res.render('_owner-tenants', {
        myTenants: 'owner-my-tenants',
        editTenant: 'owner-edit-tenant',
        discussion: 'owner-discussion',
        tenantsMessages: 'owner-tenants-messages'
    });
});

/**
 * Renders the page for managing receipts with options to view and request receipts.
 * GET /owner-receipts
 */
router.get('/owner-receipts', (req, res) => {
    res.render('_owner-receipts', {
        myReceipts: 'owner-my-receipts',
        requireReceipt: 'owner-require-receipt'
    });
});

/**
 * Renders the subscription management page with a form and subscription information.
 * GET /owner-subscription
 */
router.get('/owner-subscription', (req, res) => {
    res.render('_owner-subscription', {
        subscriptionForm: 'owner-subscription-form',
        subscriptionInfo: 'owner-subscription-info'
    });
});

/**
 * Renders the owner receipt page.
 * GET /owner-receipt
 */
router.get('/owner-receipt', (req, res) => {
    res.render('owner-receipt');
});

module.exports = router;
