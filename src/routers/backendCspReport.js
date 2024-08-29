const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const {logger} = require('../logger/logRotation');
const bodyParser = require('body-parser');

/**
 * Route for report csp violation.
 * POST /csp-violation-report
 */
router.post('/csp-violation', bodyParser.text({ type: 'application/csp-report' }), (req, res) => {
    console.log('Headers:', req.headers);
    console.log('Method:', req.method);

    // Parse manuellement le corps de la requête en JSON
    let report = {};
    try {
        report = JSON.parse(req.body)['csp-report'] || JSON.parse(req.body);
    } catch (e) {
        logger.error('Error parsing CSP report:', e);
    }

    console.log('Request received at /csp-violation:', req.body);
    console.log('CSP Violation Report:', report);

    fs.appendFile(path.join(__dirname, '../report/csp-reports.log'), `${new Date().toISOString()} -- ${JSON.stringify(report)}\n`, (err) => {
        if (err) {
            logger.error('Error recording CSP report:', err);
        }
    });

    res.status(204).end(); // Respond with no content
});


module.exports = router;
