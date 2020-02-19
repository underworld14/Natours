const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');

// auth routes
router.post('/signup', authController.signUp);
router.post('/signin', authController.signIn);
router.get('/getMe', authController.protected, authController.getMe);
router.patch('/updateUser', authController.protected, authController.updateUser);
router.patch('/updatePassword', authController.protected, authController.updatePassword);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.delete('/deleteMe', authController.protected, authController.deleteMe);

module.exports = router;
