const express = require('express');
const router = express.Router();

/**
 * Renders the tenant sign-in and log-in page.
 * GET /sign-log
 */
router.get('/sign-log', (req, res) => {
    res.render('tenant-sign-log', {
        nonce: res.locals.nonce // Passes nonce for CSP
    });
});

/**
 * Renders a test page for tenants.
 * GET /test
 */
router.get('/test', (req, res) => {
    res.render('tenant-some-view');
});

/**
 * Renders the tenant account activation page.
 * GET /activate
 */
router.get('/activate', (req, res) => {
    res.render('tenant-activation');
});

/**
 * Renders the tenant password reset page.
 * GET /reset-pwd
 */
router.get('/reset-pwd', (req, res) => {
    res.render('tenant-reset-pwd');
});

/**
 * Renders the error page for tenant requests.
 * GET /error
 */
router.get('/error', (req, res) => {
    res.render('error-tenant-request');
});

/**
 * Renders the main tenant page with sidebar, topbar, and various sections.
 * GET /tenant
 */
router.get('/home', (req, res) => {
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
 * GET /dashboard
 */
router.get('/dashboard', (req, res) => {
    res.render('_tenant-dashboard', {
        setPwd: 'tenant-set-pwd',
        myReceipts: 'tenant-my-receipts',
        requireReceipt: 'tenant-require-receipt'
    });
});

/**
 * Renders the tenant discussion page with options to view messages and send a new message.
 * GET /discussion
 */
router.get('/discussion', (req, res) => {
    res.render('_tenant-discussion', {
        myMessages: 'tenant-my-messages',
        messageForm: 'tenant-message-form'
    });
});

/**
 * Renders the tenant profile page with account and house information.
 * GET /profile
 */
router.get('/profile', (req, res) => {
    res.render('_tenant-profile', {
        accountInfo: 'tenant-account-info',
        houseInfo: 'tenant-house-info'
    });
});

/**
 * Renders the tenant receipt page.
 * GET /receipt
 */
router.get('/receipt', (req, res) => {
    res.render('tenant-receipt');
});

module.exports = router;
