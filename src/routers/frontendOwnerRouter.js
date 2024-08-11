const express = require('express');
const router = express.Router();
const path = require('path');
require('dotenv').config();



router.get('/sign_log', (req, res) => {
  res.render('sign_log');
});

router.get('/redirect', (req, res) => {
  res.render('redirect');
});

// Routes pour les vues
router.get('/', (req, res) => {
  res.render('index');
});

router.get('/dashboard', (req, res) => {
  res.render('dashboard', {
    recentpayments: 'recentpayments',
    newcustomers: 'newcustomers'
  });
});

router.get('/profile', (req, res) => {
  res.render('profile_part', {
    accountinfo: 'accountinfo',
    uploadsignature: 'uploadsignature',
    payementmodalities: 'payementmodalities'
  });
});

router.get('/propertiespart', (req, res) => {
  res.render('propertiespart', {
    myproperties : "myproperties",
    addpropertyform : "addpropertyform"
  });
});

router.get('/tenant_home', (req, res) => {
  res.render('tenants_properties_part', {
    tenants_properties: "tenants_properties",
    addtenantform: "addtenantform"
  });
});

router.get('/tenants_part', (req, res) => {
  res.render('tenants_part', {
    mytenants : "mytenants",
    editTenant : "editTenant",
    tenantsmessages:"tenantsmessages"
  });
});

router.get('/receipts_part', (req, res) => {
  res.render('receipts_part', {
    myreceipts : "myreceipts",
    requirereceipt:"requirereceipt"
  });
});

router.get('/receipt', (req, res) => {
  res.render('receipt');
});

module.exports = router;
