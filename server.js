const dotenv = require('dotenv');

// env configuration file
dotenv.config({ path: './config.env' });

const server = require('./app');

const port = process.env.PORT || 8000;

// console.log(process.env);

// start the server
server.listen(port, () => {
  console.log(`>> Listening on port ${port} !`);
});
