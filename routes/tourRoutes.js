const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');
const tourRouter = express.Router();

// tourRouter.param('ID', tourController.checkID);
tourRouter.use(authController.auth);
tourRouter
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);
tourRouter.route('/tour-stats').get(tourController.getTourStats);
tourRouter
  .route('/monthly-plan/:year')
  .get(
    authController.auth,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan
  );

tourRouter
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.auth,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.addTour
  );

tourRouter
  .route('/:ID')
  .get(tourController.getTour)
  .patch(
    authController.restrictTo('admin', 'lead-guide'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour
  )
  .delete(
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

tourRouter
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);

tourRouter
  .route('/distances/:latlng/unit/:unit')
  .get(tourController.getDistances);

tourRouter.use('/:tourID/reviews', reviewRouter);

module.exports = tourRouter;
