const express = require('express');
const router = express.Router();

/**
 * Renders the tenant sign-in and log-in page.
 * GET /tenant-sign-log
 */
router.get('/tenant-sign-log', (req, res) => {
    res.render('tenant-sign-log', {
        nonce: res.locals.nonce // Passes nonce for CSP
    });
});

/**
 * Renders a test page for tenants.
 * GET /tenant-test
 */
router.get('/tenant-test', (req, res) => {
    res.render('tenant-some-view');
});

/**
 * Renders the tenant account activation page.
 * GET /tenant-activate
 */
router.get('/tenant-activate', (req, res) => {
    res.render('tenant-activation');
});

/**
 * Renders the tenant password reset page.
 * GET /tenant-reset-pwd
 */
router.get('/tenant-reset-pwd', (req, res) => {
    res.render('tenant-reset-pwd');
});

/**
 * Renders the error page for tenant requests.
 * GET /tenant-error
 */
router.get('/tenant-error', (req, res) => {
    res.render('error-tenant-request');
});

/**
 * Renders the main tenant page with sidebar, topbar, and various sections.
 * GET /tenant
 */
router.get('/tenant', (req, res) => {
    res.render('tenant-index', {
        sidebar: 'tenant-sidebar',
        topbar: 'tenant-topbar',
        cardboxes: 'tenant-cardboxes',
        setPwd: 'tenant-set-pwd',
        myReceipts: 'tenant-my-receipts',
        requireReceipt: 'tenant-require-receipt'
    });
});

/**
 * Renders the tenant dashboard page with sections for password setup, receipts, and receipt requests.
 * GET /tenant-dashboard
 */
router.get('/tenant-dashboard', (req, res) => {
    res.render('_tenant-dashboard', {
        setPwd: 'tenant-set-pwd',
        myReceipts: 'tenant-my-receipts',
        requireReceipt: 'tenant-require-receipt'
    });
});

/**
 * Renders the tenant discussion page with options to view messages and send a new message.
 * GET /tenant-discussion
 */
router.get('/tenant-discussion', (req, res) => {
    res.render('_tenant-discussion', {
        myMessages: 'tenant-my-messages',
        messageForm: 'tenant-message-form'
    });
});

/**
 * Renders the tenant profile page with account and house information.
 * GET /tenant-profile
 */
router.get('/tenant-profile', (req, res) => {
    res.render('_tenant-profile', {
        accountInfo: 'tenant-account-info',
        houseInfo: 'tenant-house-info'
    });
});

/**
 * Renders the tenant receipt page.
 * GET /tenant-receipt
 */
router.get('/tenant-receipt', (req, res) => {
    res.render('tenant-receipt');
});

module.exports = router;
