const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  console.error(`[API] ${req.method} ${req.originalUrl}`, err);
  return res.status(err.statusCode || 500).json({
    error: err.expose ? err.message : 'Erreur interne du serveur',
  });
};

module.exports = errorHandler;
