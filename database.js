const mongoose = require('mongoose')
const { MONGO_URI } = require('./keys');

const connectionParams = {
  useNewUrlParser: true,
  // useCreateIndex: true,
  useUnifiedTopology: true
};

mongoose.connect(MONGO_URI, connectionParams)
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((err) => {
    console.error(`Error connecting to the database. \n${err}`);
  });

module.exports = mongoose;