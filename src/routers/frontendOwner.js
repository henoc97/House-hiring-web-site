const express = require('express');
const router = express.Router();
require('dotenv').config();

/**
 * Renders the owner sign-in and log-in page.
 * GET /sign-log
 */
router.get('/sign-log', (req, res) => {
  res.render('owner-sign-log', {
    nonce: res.locals.nonce, // Passes nonce for CSP
  });
});

/**
 * Renders the owner redirect page.
 * GET /redirect
 */
router.get('/redirect', (req, res) => {
  res.render('owner-redirect');
});

/**
 * Renders the page to send an email for resetting the password.
 * GET /send-email
 */
router.get('/send-email', (req, res) => {
  res.render('owner-send-email-reset-pwd-otp');
});

/**
 * Renders the owner password reset page.
 * GET /reset-pwd
 */
router.get('/reset-pwd', (req, res) => {
  res.render('owner-reset-pwd');
});

/**
 * Renders the error page for owner requests.
 * GET /error
 */
router.get('/error', (req, res) => {
  res.render('error-owner-request');
});

/**
 * Renders the main owner page with sidebar, topbar, and various sections.
 * GET /owner
 */
router.get('/home', (req, res) => {
  res.render('owner-index', {
    nonce: res.locals.nonce, // Passes nonce for CSP
    sidebar: 'owner-sidebar',
    topbar: 'owner-topbar',
    cardboxes: 'owner-cardboxes',
    recentPayments: 'owner-recent-payments',
    recentTenants: 'owner-recent-tenants',
  });
});

/**
 * Renders the owner dashboard page with recent payments and tenants.
 * GET /dashboard
 */
router.get('/dashboard', (req, res) => {
  res.render('_owner-dashboard', {
    nonce: res.locals.nonce, // Passes nonce for CSP
    recentPayments: 'owner-recent-payments',
    recentTenants: 'owner-recent-tenants',
  });
});

/**
 * Renders the owner profile page with account info, signature upload, and payment modalities.
 * GET /profile
 */
router.get('/profile', (req, res) => {
  res.render('_owner-profile', {
    accountInfo: 'owner-account-info',
    uploadSignature: 'owner-upload-signature',
    paymentModalities: 'owner-payment-modalities',
  });
});

/**
 * Renders the page for managing properties with an option to add a new property.
 * GET /properties
 */
router.get('/properties', (req, res) => {
  res.render('_owner-properties', {
    myProperties: 'owner-my-properties',
    addPropertyForm: 'owner-add-property-form',
  });
});

/**
 * Renders the page for managing tenant properties with an option to add a new tenant.
 * GET /tenant-home
 */
router.get('/tenant-home', (req, res) => {
  res.render('_owner-tenants-properties', {
    tenantsProperties: 'owner-tenants-properties',
    addTenantForm: 'owner-add-tenant-form',
  });
});

/**
 * Renders the page for managing tenants with options to edit tenants and view messages.
 * GET /tenants
 */
router.get('/tenants', (req, res) => {
  res.render('_owner-tenants', {
    myTenants: 'owner-my-tenants',
    editTenant: 'owner-edit-tenant',
    discussion: 'owner-discussion',
    tenantsMessages: 'owner-tenants-messages',
  });
});

/**
 * Renders the page for managing receipts with options to view and request receipts.
 * GET /receipts
 */
router.get('/receipts', (req, res) => {
  res.render('_owner-receipts', {
    myReceipts: 'owner-my-receipts',
    requireReceipt: 'owner-require-receipt',
  });
});

/**
 * Renders the subscription management page with a form and subscription information.
 * GET /subscription
 */
router.get('/subscription', (req, res) => {
  res.render('_owner-subscription', {
    subscriptionForm: 'owner-subscription-form',
    subscriptionInfo: 'owner-subscription-info',
  });
});

/**
 * Renders the owner receipt page.
 * GET /receipt
 */
router.get('/receipt', (req, res) => {
  res.render('owner-receipt');
});

module.exports = router;
