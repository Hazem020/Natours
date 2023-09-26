const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');
const reviewRouter = express.Router({ mergeParams: true });

reviewRouter.use(authController.auth);

reviewRouter.post(
  '/',
  reviewController.restrictUser,
  reviewController.addReview
);
reviewRouter.get('/', reviewController.getAllReviews);
reviewRouter.get('/:ID', reviewController.getReview);
reviewRouter.delete(
  '/:ID',
  authController.restrictTo('admin', 'user'),
  reviewController.deleteReview
);
reviewRouter.patch(
  '/:ID',
  authController.restrictTo('admin', 'user'),
  reviewController.updateReview
);
module.exports = reviewRouter;
