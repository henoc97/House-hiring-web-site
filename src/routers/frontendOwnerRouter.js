const express = require('express');
const router = express.Router();
const path = require('path');
require('dotenv').config();



router.get('/owner_sign_log', (req, res) => {
  res.render('owner_sign_log', {nonce: res.locals.nonce});
});

router.get('/owner_redirect', (req, res) => {
  res.render('owner_redirect');
});

// Routes pour les vues
router.get('/owner', (req, res) => {
  res.render('owner_index', {
    nonce: res.locals.nonce,
    sidebar : 'owner_sidebar',
    topbar : 'owner_topbar',
    cardboxes : 'owner_cardboxes',
    recentpayments : 'owner_recentpayments',
    newcustomers : 'owner_newcustomers'
  });
});

router.get('/owner_dashboard', (req, res) => {
  res.render('owner_dashboard', {
    nonce: res.locals.nonce,
    recentpayments: 'owner_recentpayments', 
    newcustomers: 'owner_newcustomers'
  });
});

router.get('/owner_profile', (req, res) => {
  res.render('owner_profile_part', {
    accountinfo: 'owner_accountinfo',
    uploadsignature: 'owner_uploadsignature',
    payementmodalities: 'owner_payementmodalities'
  });
});

router.get('/owner_propertiespart', (req, res) => {
  res.render('owner_propertiespart', {
    myproperties : 'owner_myproperties',
    addpropertyform : 'owner_addpropertyform'
  });
});

router.get('/owner_tenant_home', (req, res) => {
  res.render('owner_tenants_properties_part', {
    tenants_properties: 'owner_tenants_properties',
    addtenantform: 'owner_addtenantform'
  });
});

router.get('/owner_tenants_part', (req, res) => {
  res.render('owner_tenants_part', {
    mytenants : 'owner_mytenants',
    editTenant : 'owner_editTenant',
    discussPart : 'owner_discussPart',
    tenantsmessages:'owner_tenantsmessages'
  });
});

router.get('/owner_receipts_part', (req, res) => {
  res.render('owner_receipts_part', {
    myreceipts : 'owner_myreceipts',
    requirereceipt:'owner_requirereceipt'
  });
});

router.get('/owner_receipt', (req, res) => {
  res.render('owner_receipt');
});

module.exports = router;
