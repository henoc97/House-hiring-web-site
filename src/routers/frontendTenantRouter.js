const express = require('express');
const router = express.Router();

// Routes pour les vues
router.get('/test', (req, res) => {
    res.render('some_view');
  });

// Routes pour les vues
router.get('/', (req, res) => {
  res.render('index', {
    myreceipts: 'myreceipts',
    requirereceipt: 'requirereceipt'
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