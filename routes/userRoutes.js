const Router = require('express').Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const { protected, restrictTo } = authController;

Router.get('/', protected, restrictTo('admin'), userController.getAllUsers);

module.exports = Router;
