const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs');

const Tours = require('../../models/toursModels');

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

const deleteData = () => {
  Tours.deleteMany()
    .then(() => {
      console.log('Data successfull deleted');
      process.exit();
    })
    .catch(err => console.log(err));
};

const importData = () => {
  Tours.create(tours)
    .then(() => {
      console.log('Data successfull imported');
      process.exit();
    })
    .catch(err => console.log(err));
};

// option on running file
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
