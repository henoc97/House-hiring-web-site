const express = require('express');
const router = express.Router();

// Routes pour les vues
router.get('/tenant_test', (req, res) => {
  res.render('tenant_some_view');
});

router.get('/tenant_activate', (req, res) => {
  res.render('tenant_activation');
});

// Routes pour les vues
router.get('/tenant', (req, res) => {
  res.render('tenant_index', {
    sidebar : 'tenant_sidebar',
    topbar : 'tenant_topbar',
    cardboxes : 'tenant_cardboxes',
    setpwd : 'tenant_setpwd',
    myreceipts: 'tenant_myreceipts',
    requirereceipt: 'tenant_requirereceipt'
  });
});

router.get('/tenant_sign_log', (req, res) => {
  res.render('tenant_sign_log');
});

router.get('/tenant_dashboard', (req, res) => {
  res.render('tenant_dashboard', {
    setpwd : 'tenant_setpwd',
    myreceipts: 'tenant_myreceipts',
    requirereceipt: 'tenant_requirereceipt'
  });
});


router.get('/tenant_discuss_part', (req, res) => {
  res.render('tenant_discuss_part', {
    mymessages: 'tenant_mymessages',
    messageform : 'tenant_messageform'
  });
});

router.get('/tenant_profile', (req, res) => {
  res.render('tenant_profile_part', {
    accountinfo: 'tenant_accountinfo',
    houseinfo: 'tenant_houseinfo',
  });
});

router.get('/tenant_receipt', (req, res) => {
  res.render('tenant_receipt');
});

module.exports = router;