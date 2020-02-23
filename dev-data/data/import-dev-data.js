const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs');

const Tours = require('../../models/toursModels');
const Users = require('../../models/usersModel');
const Reviews = require('../../models/reviewsModels');

// env configuration file
dotenv.config({ path: './config.env' });

const { DATABASE } = process.env;

// connecting to database
mongoose
  .connect(DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('connection successfull'))
  .catch(err => console.log(err));

// read all tours data from the file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));

const deleteData = async () => {
  try {
    await Users.deleteMany();
    await Tours.deleteMany();
    await Reviews.deleteMany();

    console.log('Data successfull deleted');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

const importData = async () => {
  try {
    await Users.create(users, { validateBeforeSave: false });
    await Tours.create(tours);
    await Reviews.create(reviews);

    console.log('Data successfull deleted');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

// option on running file
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
