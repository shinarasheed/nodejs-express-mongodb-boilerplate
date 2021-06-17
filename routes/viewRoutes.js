const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../middleware/authMiddleware');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.get(
  '/',
  bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewsController.getOverView
);
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/me', authController.authenticate, viewsController.getAccount);
router.get(
  '/my-tours',
  authController.authenticate,
  viewsController.getMyTours
);

router.post(
  '/submit-user-data',
  authController.authenticate,
  viewsController.updateUserData
);

module.exports = router;
