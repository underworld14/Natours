const Router = require('express').Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const { protected, restrictTo } = authController;

Router.use(protected, restrictTo('admin'));

Router.route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

Router.route('/pass/:id').patch(userController.updatePassword);

Router.route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = Router;
