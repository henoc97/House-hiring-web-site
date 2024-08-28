const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

/**
 * Route for report csp violation.
 * POST /csp-violation-report
 */
router.post('/csp-violation', (req, res) => {
    console.log('Request received at /csp-violation:', req.body);
    const report = req.body['csp-report'] || req.body;
    console.log('CSP Violation Report:', report);

    fs.appendFile(path.join(__dirname, '../log/csp-reports.log'), `${new Date().toISOString()} -- ${JSON.stringify(report)}\n`, (err) => {
        if (err) {
            console.error('Error recording CSP report:', err);
        }
    });

    res.status(204).end(); // Respond with no content
});

module.exports = router;
