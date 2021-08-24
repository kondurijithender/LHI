const ApiError = require('./ApiError');

function apiErrorHandler(err, req, res, next) {
  // in prod, don't use console.log or console.err because
  // it is not async
  console.error(err);

  if (err instanceof ApiError) {
    console.log('err', err.status, err.message);
    res.status(err.status).json({ status: err.status, message: err.message });
    return;
  }

  res.status(500).json('something went wrong');
}

module.exports = apiErrorHandler;