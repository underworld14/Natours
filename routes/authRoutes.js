const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');

// auth routes
router.post('/signup', authController.signUp);
router.post('/signin', authController.signIn);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// protected routes
router.use(authController.protected);
router.get('/getMe', authController.getMe);
router.patch('/updateUser', authController.updateUser);
router.patch('/updatePassword', authController.updatePassword);
router.delete('/deleteMe', authController.deleteMe);

module.exports = router;
