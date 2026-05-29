const config = require('../config/env');

const requireAllowedOrigin = (req, res, next) => {
  const origin = req.get('Origin');

  if (origin && config.app.allowedOrigins.includes(origin)) {
    return next();
  }

  return res.status(403).json({
    error: 'Accès API refusé pour cette origine.',
    allowedOrigins: config.app.allowedOrigins,
  });
};

module.exports = requireAllowedOrigin;
