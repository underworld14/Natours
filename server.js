const dotenv = require('dotenv');
const mongoose = require('mongoose');

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
  .then(() => console.log('connection successfull'));

const app = require('./app');

const port = process.env.PORT || 8000;

// start the server
const server = app.listen(port, () => {
  console.log(`>> Listening on port ${port} !`);
});

// handling err unhandled rejection
process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION ERR, SHUTTINGDOWN APPLICATION');

  server.close(() => {
    process.exit(1);
  });
});

// handling err uncaught exception
process.on('uncaughtException', err => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXPRESSION ERR, SHUTTINGDOWN APPLICATION');

  server.close(() => {
    process.exit(1);
  });
});
