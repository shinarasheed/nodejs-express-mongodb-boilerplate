import express from 'express';
import reviewController from '../controllers/reviewController';
import { authenticate, restrictTo } from '../middleware/authMiddleware';

const router = express.Router({ mergeParams: true });

router.use(authenticate);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(restrictTo('user', 'admin'), reviewController.updateReview)
  .delete(restrictTo('user', 'admin'), reviewController.deleteReview);

export default router;
