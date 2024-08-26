const express = require('express');
const router = express.Router();



router.get('/tenant-sign-log', (req, res) => {
  res.render('tenant-sign-log', {nonce: res.locals.nonce});
});

// Routes pour les vues
router.get('/tenant-test', (req, res) => {
  res.render('tenant-some-view');
});

router.get('/tenant-activate', (req, res) => {
  res.render('tenant-activation');
});

router.get('/tenant-reset-pwd', (req, res) => {
  res.render('tenant-reset-pwd');
});

router.get('/tenant-error', (req, res) => {
  res.render('error-tenant-request');
});
// Routes pour les vues
router.get('/tenant', (req, res) => {
  res.render('tenant-index', {
    sidebar : 'tenant-sidebar',
    topbar : 'tenant-topbar',
    cardboxes : 'tenant-cardboxes',
    setPwd : 'tenant-set-pwd',
    myReceipts: 'tenant-my-receipts',
    requireReceipt: 'tenant-require-receipt'
  });
});

router.get('/tenant-sign-log', (req, res) => {
  res.render('tenant-sign-log');
});

router.get('/tenant-dashboard', (req, res) => {
  res.render('_tenant-dashboard', {
    setPwd : 'tenant-set-pwd',
    myReceipts: 'tenant-my-receipts',
    requireReceipt: 'tenant-require-receipt'
  });
});


router.get('/tenant-discussion', (req, res) => {
  res.render('_tenant-discussion', {
    myMessages: 'tenant-my-messages',
    messageForm : 'tenant-message-form'
  });
});

router.get('/tenant-profile', (req, res) => {
  res.render('_tenant-profile', {
    accountInfo: 'tenant-account-info',
    houseInfo: 'tenant-house-info',
  });
});

router.get('/tenant-receipt', (req, res) => {
  res.render('tenant-receipt');
});

module.exports = router;