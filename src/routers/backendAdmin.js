const express = require('express');
const router = express.Router();

// Middleware
const dbMiddleware = require('../../middlewares/http/database');
const authMiddleware = require('../../middlewares/http/auth')('admin');

// Controllers
const { userAuth } = require('../../controller/admin/user');
const {
  mySubscription,
  updateOwnerSold,
  subscriptions,
  insertSubscription,
  deleteSubscription,
  isDeletedSubscription,
} = require('../../controller/admin/owner');

/**
 * Apply database connection middleware to all routes.
 */
router.use(dbMiddleware);

/**
 * Route for user authentication.
 * POST /admin-auth
 */
router.post('/admin-auth', userAuth);

/**
 * Apply authentication middleware to the following routes.
 */
router.use(authMiddleware);

/**
 * Route to get user subscription details.
 * POST /get-subscription
 */
router.post('/get-subscription', mySubscription);

/**
 * Route to update the owner's sold status.
 * POST /update-owner-sold
 */
router.post('/update-owner-sold', updateOwnerSold);

/**
 * Route to get all subscriptions.
 * POST /get-all-subscriptions
 */
router.post('/get-all-subscriptions', subscriptions);

/**
 * Route to insert a new subscription.
 * POST /insert-subscription
 */
router.post('/insert-subscription', insertSubscription);

/**
 * Route to permanently delete a subscription.
 * POST /delete-permanently-subscription
 */
router.post('/delete-permanently-subscription', deleteSubscription);

/**
 * Route to mark a subscription as deleted (soft delete).
 * POST /delete-subscription
 */
router.post('/delete-subscription', isDeletedSubscription);

/**
 * Global error handling middleware.
 * This should be the last middleware added.
 */
router.use((err, req, res, next) => {
  logger.error('Server Error:', err.stack);
  res.status(500).json({ message: 'An unexpected error occurred' });
});

module.exports = router;
