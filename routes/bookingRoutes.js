const express = require('express');
const bookingController = require('../controllers/bookingController');
const { authenticate, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticate);

router.get(
  '/checkout-session/:tourId',
  authenticate,
  bookingController.getCheckoutSession
);

router.use(restrictTo('admin', 'lead-guide'));

router
  .route('/')
  .get(bookingController.getAllBooking)
  .post(bookingController.createBooking);

router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;
