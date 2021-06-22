import express from 'express';
import userController from '../controllers/userController';
import authController from '../controllers/authController';
import { authenticate, restrictTo } from '../middleware/authMiddleware';
import { uploadUserPhoto, resizeUserPhoto } from '../middleware/mediaUpload';

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgetpassword', authController.forgetPassword);
router.patch('/resetpassword/:token', authController.updatePassword);

//This will protect all the routes below this middlware
router.use(authenticate);

router.patch('/updatemypassword', authController.updatePassword);
router.get('/me', userController.getMe, userController.getUser);
router.patch(
  '/updateme',
  uploadUserPhoto,
  resizeUserPhoto,
  userController.updateMe
);
router.delete('/deleteme', userController.deleteMe);

//This will only authorize admins for the routes below
router.use(restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default router;
