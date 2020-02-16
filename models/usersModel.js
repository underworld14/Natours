const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const usersScheema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Username is required !']
  },
  email: {
    type: String,
    required: [true, 'Email is required !'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required !'],
    minlength: [6, 'password must have minimal 6 characters'],
    select: false
  },
  confirmPassword: {
    type: String,
    required: [true, 'Confirm Password is required !'],
    validate: {
      validator: function(val) {
        return val === this.password;
      },
      message: 'Password and password confirm must same !'
    }
  },
  photo: String
});

usersScheema.methods.testPassword = async function(newPass, userPass) {
  return await bcrypt.compare(newPass, userPass);
};

// documents middleware
usersScheema.pre('save', async function(next) {
  // ONLY RUN this is password was actualy modified
  if (!this.isModified('password')) return next();

  // hashing password with bcrypt
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
});

const Users = mongoose.model('Users', usersScheema);

module.exports = Users;
