const express = require('express');
const router = express.Router();

// Routes pour les vues
router.get('/', (req, res) => {
    res.render('some_view');
  });


  module.exports = router;
