const dotenv = require('dotenv');
const mongoose = require('mongoose');

// env configuration file
dotenv.config({ path: './config.env' });

const { DATABASE } = process.env;

mongoose
  .connect(DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('connection successfull'))
  .catch(err => console.log(err));

const server = require('./app');

const port = process.env.PORT || 8000;

// start the server
server.listen(port, () => {
  console.log(`>> Listening on port ${port} !`);
});
