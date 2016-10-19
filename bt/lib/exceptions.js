'use strict';

var errorTypes = require('./error_types');

var errorMaker = function(type) {
  return function(message) {
    var err;
    err = new Error(message || '');
    err.type = err.name = type;
    return err;
  };
};

exports.AuthenticationError = errorMaker(errorTypes.authenticationError);
exports.AuthorizationError = errorMaker(errorTypes.authorizationError);
exports.DownForMaintenanceError = errorMaker(errorTypes.downForMaintenanceError);
exports.InvalidSignatureError = errorMaker(errorTypes.invalidSignatureError);
exports.InvalidChallengeError = errorMaker(errorTypes.invalidChallengeError);
exports.InvalidTransparentRedirectHashError = errorMaker(errorTypes.invalidTransparentRedirectHashError);
exports.NotFoundError = errorMaker(errorTypes.notFoundError);
exports.ServerError = errorMaker(errorTypes.serverError);
exports.TestOperationPerformedInProductionError = errorMaker(errorTypes.testOperationPerformedInProductionError);
exports.TooManyRequestsError = errorMaker(errorTypes.tooManyRequestsError);
exports.UnexpectedError = errorMaker(errorTypes.unexpectedError);
exports.UpgradeRequired = errorMaker(errorTypes.upgradeRequired);
