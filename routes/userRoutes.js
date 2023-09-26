const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const userRouter = express.Router();
userRouter.post('/signup', authController.signup);
userRouter.post('/login', authController.login);
userRouter.get('/logout', authController.logOut);
userRouter.post('/forgotPassword', authController.forgotPassword);
userRouter.patch('/resetPassword/:token', authController.resetPassword);

// Protect the rest of the endpoints
userRouter.use(authController.auth);
userRouter.patch('/updateMyPassword', authController.updatePassword);
userRouter.get('/me', userController.getMe);
userRouter.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
userRouter.delete('/deleteMe', userController.deteleMe);

// Restrict the rest of the endpoints to admin only
userRouter.use(authController.restrictTo('admin'));
userRouter
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.addUser);
userRouter.route('/:ID').get(userController.getUser);

module.exports = userRouter;
