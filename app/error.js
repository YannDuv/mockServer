'use strict';

exports.handleError = function(res, err) {
  console.error(err);
  res.status(500).send(err);
};
