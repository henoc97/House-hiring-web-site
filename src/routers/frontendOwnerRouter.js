const express = require('express');
const router = express.Router();
const path = require('path');
require('dotenv').config();



router.get('/owner-sign-log', (req, res) => {
  res.render('owner-sign-log', {nonce: res.locals.nonce});
});

router.get('/owner-redirect', (req, res) => {
  res.render('owner-redirect');
});

router.get('/owner-error', (req, res) => {
  res.render('error-owner-request');
});

// Routes pour les vues
router.get('/owner', (req, res) => {
  res.render('owner-index', {
    nonce: res.locals.nonce,
    sidebar : 'owner-sidebar',
    topbar : 'owner-topbar',
    cardboxes : 'owner-cardboxes',
    recentPayments : 'owner-recent-payments',
    recentTenants : 'owner-recent-tenants',
  });
});

router.get('/owner-dashboard', (req, res) => {
  res.render('_owner-dashboard', {
    nonce: res.locals.nonce,
    recentPayments: 'owner-recent-payments', 
    recentTenants: 'owner-recent-tenants',
  });
});

router.get('/owner-profile', (req, res) => {
  res.render('_owner-profile', {
    accountInfo: 'owner-account-info',
    uploadSignature: 'owner-upload-signature',
    payementModalities: 'owner-payement-modalities'
  });
});

router.get('/owner-properties', (req, res) => {
  res.render('_owner-properties', {
    myProperties : 'owner-my-properties',
    addPropertyForm : 'owner-add-property-form'
  });
});

router.get('/owner-tenant-home', (req, res) => {
  res.render('_owner-tenants-properties', {
    tenantsProperties: 'owner-tenants-properties',
    addTenantForm: 'owner-add-tenant-form'
  });
});

router.get('/owner-tenants', (req, res) => {
  res.render('_owner-tenants', {
    myTenants : 'owner-my-tenants',
    editTenant : 'owner-edit-tenant',
    discussion : 'owner-discussion',
    tenantsMessages:'owner-tenants-messages'
  });
});

router.get('/owner-receipts', (req, res) => {
  res.render('_owner-receipts', {
    myReceipts : 'owner-my-receipts',
    requireReceipt:'owner-require-receipt'
  });
});

router.get('/owner-subscription', (req, res) => {
  res.render('_owner-subscription', {
    subscriptionForm : 'owner-subscription-form',
    subscriptionInfo:'owner-subscription-info'
  });
});

router.get('/owner-receipt', (req, res) => {
  res.render('owner-receipt');
});

module.exports = router;
