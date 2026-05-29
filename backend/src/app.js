const express = require('express');
const cors = require('cors');

const config = require('./config/env');
const errorHandler = require('./middleware/error-handler');
const routes = require('./routes');

const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use('/uploads', express.static(config.app.uploadDir));
  app.use('/api', routes);
  app.use(errorHandler);

  return app;
};

module.exports = createApp;
