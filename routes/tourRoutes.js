const express = require('express');
const tourController = require('../controllers/tourController');
const reviewRouter = require('../routes/reviewRoutes');
const { authenticate, restrictTo } = require('../middleware/authMiddleware');
const {
  uploadTourImages,
  resizeTourImages,
} = require('../middleware/mediaUpload');

const router = express.Router();

//REVIEWS
router.use('/:tourId/reviews', reviewRouter);

//should something like this work for explore
//this is good for a request that is frequently made
router
  .route('/top-5-cheap-tours')
  .get(tourController.aliasTopTous, tourController.getAllTours);
router.route('/tour-stats').get(tourController.getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    authenticate,
    restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMostBusyMonth
  );

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authenticate,
    restrictTo('admin', 'lead-guide'),
    tourController.createTour
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authenticate,
    uploadTourImages,
    resizeTourImages,
    restrictTo('admin', 'lead-guide'),
    tourController.updateTour
  )
  .delete(
    authenticate,
    restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
