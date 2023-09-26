const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const viewController = require('../controllers/viewController');
const bookingController = require('../controllers/bookingController');
const viewRouter = express.Router();
viewRouter.use(authController.isLoggedIn);

viewRouter.get('/', authController.isLoggedIn, viewController.getOverview);
viewRouter.get(
  '/tour/:slug',
  authController.isLoggedIn,
  viewController.getTour
);
viewRouter.get(
  '/login',
  authController.isLoggedIn,
  viewController.getLoginForm
);
viewRouter.get('/me', authController.auth, viewController.getAccount);
viewRouter.get(
  '/signup',
  authController.isLoggedIn,
  viewController.getSignupForm
);
viewRouter.get('/my-tours', authController.auth, viewController.getMyTours);
viewRouter.post(
  '/submit-user-data',
  authController.auth,
  viewController.updateUserData
);
module.exports = viewRouter;
