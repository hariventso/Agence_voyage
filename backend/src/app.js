const express = require('express');
const cors = require('cors');

const config = require('./config/env');
const errorHandler = require('./middleware/error-handler');
const requireAllowedOrigin = require('./middleware/require-allowed-origin');
const routes = require('./routes');

const corsOptions = {
  origin(origin, callback) {
    if (origin && config.app.allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(null, false);
  },
};

const createApp = () => {
  const app = express();

  app.use(express.json());
  app.use('/uploads', express.static(config.app.uploadDir));
  app.use('/api', cors(corsOptions), requireAllowedOrigin, routes);
  app.use(errorHandler);

  return app;
};

module.exports = createApp;
