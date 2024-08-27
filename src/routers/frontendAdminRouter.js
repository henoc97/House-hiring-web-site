const express = require('express');
const router = express.Router();
const path = require('path');
require('dotenv').config();



router.get('/admin-sign-log', (req, res) => {
  res.render('admin-sign-log', {nonce: res.locals.nonce});
});

router.get('/owner-error', (req, res) => {
  res.render('error-owner-request');
});

// Routes pour les vues
router.get('/admin', (req, res) => {
  res.render('admin-index', {
    nonce: res.locals.nonce,
    sidebar : 'admin-sidebar',
    topbar : 'admin-topbar',
    cardboxes : 'admin-cardboxes',
    subscriptions : 'admin-subscriptions',
    insertSubscription : 'admin-subscription-form',
  });
});

router.get('/admin-dashboard', (req, res) => {
  res.render('_admin-dashboard', {
    nonce: res.locals.nonce,
    subscriptions : 'admin-subscriptions',
    insertSubscription : 'admin-subscription-form',
  });
});

module.exports = router;
