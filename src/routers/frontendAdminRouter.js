const express = require('express');
const router = express.Router();
require('dotenv').config();

/**
 * Renders the admin sign-in and log-in page.
 * GET /admin-sign-log
 */
router.get('/admin-sign-log', (req, res) => {
    res.render('admin-sign-log', {
        nonce: res.locals.nonce // Passes nonce for CSP
    });
});

/**
 * Renders the admin error page.
 * GET /admin-error
 */
router.get('/admin-error', (req, res) => {
    res.render('error-admin-request');
});

/**
 * Renders the main admin page with sidebar, topbar, and various sections.
 * GET /admin
 */
router.get('/admin', (req, res) => {
    res.render('admin-index', {
        nonce: res.locals.nonce, // Passes nonce for CSP
        sidebar: 'admin-sidebar',
        topbar: 'admin-topbar',
        cardboxes: 'admin-cardboxes',
        subscriptions: 'admin-subscriptions',
        insertSubscription: 'admin-subscription-form'
    });
});

/**
 * Renders the admin dashboard page with subscriptions and a subscription form.
 * GET /admin-dashboard
 */
router.get('/admin-dashboard', (req, res) => {
    res.render('_admin-dashboard', {
        nonce: res.locals.nonce, // Passes nonce for CSP
        subscriptions: 'admin-subscriptions',
        insertSubscription: 'admin-subscription-form'
    });
});

module.exports = router;
