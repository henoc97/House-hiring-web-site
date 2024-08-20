const express = require('express');
const router = express.Router();

// Routes pour les vues
router.get('/tenant-test', (req, res) => {
  res.render('tenant-some-view');
});

router.get('/tenant-activate', (req, res) => {
  res.render('tenant-activation');
});

// Routes pour les vues
router.get('/tenant', (req, res) => {
  res.render('tenant-index', {
    sidebar : 'tenant-sidebar',
    topbar : 'tenant-topbar',
    cardboxes : 'tenant-cardboxes',
    setpwd : 'tenant-setpwd',
    myreceipts: 'tenant-myreceipts',
    requirereceipt: 'tenant-requirereceipt'
  });
});

router.get('/tenant-sign-log', (req, res) => {
  res.render('tenant-sign-log');
});

router.get('/tenant-dashboard', (req, res) => {
  res.render('_tenant-dashboard', {
    setpwd : 'tenant-set-pwd',
    myreceipts: 'tenant-my-receipts',
    requirereceipt: 'tenant-require-receipt'
  });
});


router.get('/tenant-discuss-part', (req, res) => {
  res.render('_tenant-discussion', {
    mymessages: 'tenant-my-messages',
    messageform : 'tenant-message-form'
  });
});

router.get('/tenant-profile', (req, res) => {
  res.render('_tenant-profile', {
    accountinfo: 'tenant-account-info',
    houseinfo: 'tenant-house-info',
  });
});

router.get('/tenant-receipt', (req, res) => {
  res.render('tenant-receipt');
});

module.exports = router;