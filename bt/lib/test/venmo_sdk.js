'use strict';

var generate = function(number) {
  return 'stub-' + number;
};

var VenmoSdk = {
  generateTestPaymentMethodCode: generate,
  VisaPaymentMethodCode: generate('4111111111111111'),
  InvalidPaymentMethodCode: 'stub-invalid-payment-method-code',
  Session: 'stub-session',
  InvalidSession: 'stub-invalid-session'
};

exports.VenmoSdk = VenmoSdk;
