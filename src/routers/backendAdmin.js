const express = require('express');
const router = express.Router();
const sharp = require('sharp');

const dbMiddleware = require('../../middlewares/http/database');
const authMiddleware = require('../../middlewares/http/auth');

const { userAuth, refreshToken } = require('../../controller/admin/user');
const { mySubscription, updateOwnerSold, subscriptions, insertSubscription, deleteSubscription, isDeletedSubscription } = require('../../controller/admin/owner');


// Appliquer les middlewares à toutes les routes
router.use(dbMiddleware);
router.use(authMiddleware);

// Routes pour les utilisateurs
router.post("/admin-auth", userAuth);

// Routes pour les propriétés
router.post("/get-subscription", mySubscription);
router.post("/update-owner-sold", updateOwnerSold);
router.post("/get-all-subscriptions", subscriptions);
router.post("/insert-subscription", insertSubscription);
router.post("/delete-permanently-subscription", deleteSubscription);
router.post("/delete-subscription", isDeletedSubscription);

module.exports = router;
