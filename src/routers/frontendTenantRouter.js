const express = require('express');
const router = express.Router();

// Routes pour les vues
router.get('/test', (req, res) => {
  res.render('some_view');
});

router.get('/activate', (req, res) => {
  res.render('activation');
});

// Routes pour les vues
router.get('/', (req, res) => {
  res.render('index', {
    setpwd : 'setpwd',
    myreceipts: 'myreceipts',
    requirereceipt: 'requirereceipt'
  });
});

router.get('/sign_log', (req, res) => {
  res.render('sign_log');
});

router.get('/dashboard', (req, res) => {
  res.render('dashboard', {
    setpwd : 'setpwd',
    myreceipts: 'myreceipts',
    requirereceipt: 'requirereceipt'
  });
});


router.get('/discuss_part', (req, res) => {
  res.render('discuss_part', {
    mymessages: "mymessages",
    messageform : "messageform"
  });
});

router.get('/profile', (req, res) => {
  res.render('profile_part', {
    accountinfo: 'accountinfo',
    houseinfo: 'houseinfo',
  });
});

router.get('/receipt', (req, res) => {
  res.render('receipt');
});

module.exports = router;