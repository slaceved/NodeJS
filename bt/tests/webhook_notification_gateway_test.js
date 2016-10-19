'use strict';

require('./testHelper');
var ValidationErrorCodes = require('../lib/validation_error_codes').ValidationErrorCodes;
var WebhookNotification = require('../lib/webhook_notification').WebhookNotification;
var Dispute = require('../lib/dispute').Dispute;
var errorTypes = require('../lib/error_types').errorTypes;

describe('WebhookNotificationGateway', function() {
  describe('verify', function() {
    it('creates a verification string for the challenge', function() {
      var result;
      result = testHelper.defaultGateway.webhookNotification.verify('20f9f8ed05f77439fe955c977e4c8a53');
      return GLOBAL.assert.equal(result, 'integration_public_key|d9b899556c966b3f06945ec21311865d35df3ce4');
    });
    it('throws an error when challenge contains non-hex chars', function(done) {
      var webhookNotification;
      webhookNotification = testHelper.defaultGateway.webhookNotification;
      assert.throws((function() {
        return webhookNotification.verify('bad challenge');
      }));
      return done();
    });
    return it('returns an errback with InvalidChallengeError when challenge contains non-hex chars', function(done) {
      return testHelper.defaultGateway.webhookNotification.verify('bad challenge', function(err, response) {
        GLOBAL.assert.equal(err.type, errorTypes.invalidChallengeError);
        GLOBAL.assert.equal(err.message, 'challenge contains non-hex characters');
        return done();
      });
    });
  });
  return describe('sampleNotification', function() {
    it('returns a parsable signature and payload', function(done) {
      var bt_payload, bt_signature, ref;
      ref = testHelper.defaultGateway.webhookTesting.sampleNotification(WebhookNotification.Kind.SubscriptionWentPastDue, 'my_id'),
        bt_signature = ref.bt_signature, bt_payload = ref.bt_payload;
      return testHelper.defaultGateway.webhookNotification.parse(bt_signature, bt_payload, function(err, webhookNotification) {
        GLOBAL.assert.equal(webhookNotification.kind, WebhookNotification.Kind.SubscriptionWentPastDue);
        GLOBAL.assert.equal(webhookNotification.subscription.id, 'my_id');
        assert.ok(webhookNotification.timestamp != null);
        return done();
      });
    });
    it('retries a payload with a newline', function(done) {
      var bt_payload, bt_signature, ref;
      ref = testHelper.defaultGateway.webhookTesting.sampleNotification(WebhookNotification.Kind.SubscriptionWentPastDue, 'my_id'),
        bt_signature = ref.bt_signature, bt_payload = ref.bt_payload;
      return testHelper.defaultGateway.webhookNotification.parse(bt_signature, bt_payload.replace(/\n$/, ''), function(err, webhookNotification) {
        GLOBAL.assert.equal(err, null);
        GLOBAL.assert.equal(webhookNotification.kind, WebhookNotification.Kind.SubscriptionWentPastDue);
        GLOBAL.assert.equal(webhookNotification.subscription.id, 'my_id');
        assert.ok(webhookNotification.timestamp != null);
        return done();
      });
    });
    it('returns an errback with InvalidSignatureError when signature is invalid', function(done) {
      var bt_payload, bt_signature, ref;
      ref = testHelper.defaultGateway.webhookTesting.sampleNotification(WebhookNotification.Kind.SubscriptionWentPastDue, 'my_id'),
        bt_signature = ref.bt_signature, bt_payload = ref.bt_payload;
      return testHelper.defaultGateway.webhookNotification.parse('bad_signature', bt_payload, function(err, webhookNotification) {
        GLOBAL.assert.equal(err.type, errorTypes.invalidSignatureError);
        return done();
      });
    });
    it('returns an errback with InvalidSignatureError when the public key does not match', function(done) {
      var bt_payload, bt_signature, ref;
      ref = testHelper.defaultGateway.webhookTesting.sampleNotification(WebhookNotification.Kind.SubscriptionWentPastDue, 'my_id'),
        bt_signature = ref.bt_signature, bt_payload = ref.bt_payload;
      return testHelper.defaultGateway.webhookNotification.parse('bad' + bt_signature, bt_payload, function(err, webhookNotification) {
        GLOBAL.assert.equal(err.type, errorTypes.invalidSignatureError);
        GLOBAL.assert.equal(err.message, 'no matching public key');
        return done();
      });
    });
    it('returns an errback with InvalidSignatureError when the signature is modified', function(done) {
      var bt_payload, bt_signature, ref;
      ref = testHelper.defaultGateway.webhookTesting.sampleNotification(WebhookNotification.Kind.SubscriptionWentPastDue, 'my_id'),
        bt_signature = ref.bt_signature, bt_payload = ref.bt_payload;
      return testHelper.defaultGateway.webhookNotification.parse(bt_signature + 'bad', bt_payload, function(err, webhookNotification) {
        GLOBAL.assert.equal(err.type, errorTypes.invalidSignatureError);
        return done();
      });
    });
    it('returns an errback with InvalidSignatureError when the payload is modified', function(done) {
      var bt_payload, bt_signature, ref;
      ref = testHelper.defaultGateway.webhookTesting.sampleNotification(WebhookNotification.Kind.SubscriptionWentPastDue, 'my_id'),
        bt_signature = ref.bt_signature, bt_payload = ref.bt_payload;
      return testHelper.defaultGateway.webhookNotification.parse(bt_signature, 'bad' + bt_payload, function(err, webhookNotification) {
        GLOBAL.assert.equal(err.type, errorTypes.invalidSignatureError);
        GLOBAL.assert.equal(err.message, 'signature does not match payload - one has been modified');
        return done();
      });
    });
    it('returns an errback with InvalidSignatureError when the payload contains invalid characters', function(done) {
      var bt_payload, bt_signature, ref;
      ref = testHelper.defaultGateway.webhookTesting.sampleNotification(WebhookNotification.Kind.SubscriptionWentPastDue, 'my_id'),
        bt_signature = ref.bt_signature, bt_payload = ref.bt_payload;
      bt_payload = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+=/\n';
      return testHelper.defaultGateway.webhookNotification.parse(bt_signature, bt_payload, function(err, webhookNotification) {
        GLOBAL.assert.equal(err.type, errorTypes.invalidSignatureError);
        assert.notEqual(err.message, 'payload contains illegal characters');
        return done();
      });
    });
    it('allows all valid characters', function(done) {
      var bt_payload, bt_signature, ref;
      ref = testHelper.defaultGateway.webhookTesting.sampleNotification(WebhookNotification.Kind.SubscriptionWentPastDue, 'my_id'),
        bt_signature = ref.bt_signature, bt_payload = ref.bt_payload;
      return testHelper.defaultGateway.webhookNotification.parse(bt_signature, '^& bad ,* chars @!', function(err, webhookNotification) {
        GLOBAL.assert.equal(err.type, errorTypes.invalidSignatureError);
        GLOBAL.assert.equal(err.message, 'payload contains illegal characters');
        return done();
      });
    });
    it('returns a parsable signature and payload for merchant account approvals', function(done) {
      var bt_payload, bt_signature, ref;
      ref = testHelper.defaultGateway.webhookTesting.sampleNotification(WebhookNotification.Kind.SubMerchantAccountApproved, 'my_id'),
        bt_signature = ref.bt_signature, bt_payload = ref.bt_payload;
      return testHelper.defaultGateway.webhookNotification.parse(bt_signature, bt_payload, function(err, webhookNotification) {
        GLOBAL.assert.equal(webhookNotification.kind, WebhookNotification.Kind.SubMerchantAccountApproved);
        GLOBAL.assert.equal(webhookNotification.merchantAccount.id, 'my_id');
        assert.ok(webhookNotification.timestamp != null);
        return done();
      });
    });
    it('returns a parsable signature and payload for merchant account declines', function(done) {
      var bt_payload, bt_signature, ref;
      ref = testHelper.defaultGateway.webhookTesting.sampleNotification(WebhookNotification.Kind.SubMerchantAccountDeclined, 'my_id'),
        bt_signature = ref.bt_signature, bt_payload = ref.bt_payload;
      return testHelper.defaultGateway.webhookNotification.parse(bt_signature, bt_payload, function(err, webhookNotification) {
        GLOBAL.assert.equal(webhookNotification.kind, WebhookNotification.Kind.SubMerchantAccountDeclined);
        GLOBAL.assert.equal(webhookNotification.merchantAccount.id, 'my_id');
        GLOBAL.assert.equal(webhookNotification.errors['for']('merchantAccount').on('base')[0].code,
          ValidationErrorCodes.MerchantAccount.ApplicantDetails.DeclinedOFAC);
        GLOBAL.assert.equal(webhookNotification.message, 'Credit score is too low');
        assert.ok(webhookNotification.timestamp != null);
        return done();
      });
    });
    it('returns a parsable signature and payload for disbursed transaction', function(done) {
      var bt_payload, bt_signature, ref;
      ref = testHelper.defaultGateway.webhookTesting.sampleNotification(WebhookNotification.Kind.TransactionDisbursed, 'my_id'),
        bt_signature = ref.bt_signature, bt_payload = ref.bt_payload;
      return testHelper.defaultGateway.webhookNotification.parse(bt_signature, bt_payload, function(err, webhookNotification) {
        GLOBAL.assert.equal(webhookNotification.kind, WebhookNotification.Kind.TransactionDisbursed);
        GLOBAL.assert.equal(webhookNotification.transaction.id, 'my_id');
        GLOBAL.assert.equal(webhookNotification.transaction.amount, '100');
        assert.ok(webhookNotification.transaction.disbursementDetails.disbursementDate != null);
        return done();
      });
    });
    it('returns a parsable signature and payload for dispute opened', function(done) {
      var bt_payload, bt_signature, ref;
      ref = testHelper.defaultGateway.webhookTesting.sampleNotification(WebhookNotification.Kind.DisputeOpened, 'my_id'),
        bt_signature = ref.bt_signature, bt_payload = ref.bt_payload;
      return testHelper.defaultGateway.webhookNotification.parse(bt_signature, bt_payload, function(err, webhookNotification) {
        GLOBAL.assert.equal(webhookNotification.kind, WebhookNotification.Kind.DisputeOpened);
        GLOBAL.assert.equal(Dispute.Status.Open, webhookNotification.dispute.status);
        GLOBAL.assert.equal(Dispute.Kind.Chargeback, webhookNotification.dispute.kind);
        GLOBAL.assert.equal('2014-03-28', webhookNotification.dispute.dateOpened);
        return done();
      });
    });
    it('returns a parsable signature and payload for dispute lost', function(done) {
      var bt_payload, bt_signature, ref;
      ref = testHelper.defaultGateway.webhookTesting.sampleNotification(WebhookNotification.Kind.DisputeLost, 'my_id'),
        bt_signature = ref.bt_signature, bt_payload = ref.bt_payload;
      return testHelper.defaultGateway.webhookNotification.parse(bt_signature, bt_payload, function(err, webhookNotification) {
        GLOBAL.assert.equal(webhookNotification.kind, WebhookNotification.Kind.DisputeLost);
        GLOBAL.assert.equal(Dispute.Status.Lost, webhookNotification.dispute.status);
        GLOBAL.assert.equal(Dispute.Kind.Chargeback, webhookNotification.dispute.kind);
        GLOBAL.assert.equal('2014-03-28', webhookNotification.dispute.dateOpened);
        return done();
      });
    });
    it('returns a parsable signature and payload for dispute won', function(done) {
      var bt_payload, bt_signature, ref;
      ref = testHelper.defaultGateway.webhookTesting.sampleNotification(WebhookNotification.Kind.DisputeWon, 'my_id'),
        bt_signature = ref.bt_signature, bt_payload = ref.bt_payload;
      return testHelper.defaultGateway.webhookNotification.parse(bt_signature, bt_payload, function(err, webhookNotification) {
        GLOBAL.assert.equal(webhookNotification.kind, WebhookNotification.Kind.DisputeWon);
        GLOBAL.assert.equal(Dispute.Status.Won, webhookNotification.dispute.status);
        GLOBAL.assert.equal(Dispute.Kind.Chargeback, webhookNotification.dispute.kind);
        GLOBAL.assert.equal('2014-03-28', webhookNotification.dispute.dateOpened);
        GLOBAL.assert.equal('2014-09-01', webhookNotification.dispute.dateWon);
        return done();
      });
    });
    it('returns a parsable signature and payload for a disbursed webhook', function(done) {
      var bt_payload, bt_signature, ref;
      ref = testHelper.defaultGateway.webhookTesting.sampleNotification(WebhookNotification.Kind.Disbursement, 'my_id'),
        bt_signature = ref.bt_signature, bt_payload = ref.bt_payload;
      return testHelper.defaultGateway.webhookNotification.parse(bt_signature, bt_payload, function(err, webhookNotification) {
        GLOBAL.assert.equal(webhookNotification.kind, WebhookNotification.Kind.Disbursement);
        GLOBAL.assert.equal(webhookNotification.disbursement.id, 'my_id');
        GLOBAL.assert.equal(webhookNotification.disbursement.amount, '100.00');
        GLOBAL.assert.equal(webhookNotification.disbursement.transactionIds[0], 'afv56j');
        GLOBAL.assert.equal(webhookNotification.disbursement.transactionIds[1], 'kj8hjk');
        GLOBAL.assert.equal(webhookNotification.disbursement.success, true);
        GLOBAL.assert.equal(webhookNotification.disbursement.retry, false);
        GLOBAL.assert.equal(webhookNotification.disbursement.disbursementDate, '2014-02-10');
        GLOBAL.assert.equal(webhookNotification.disbursement.merchantAccount.id, 'merchant_account_token');
        GLOBAL.assert.equal(webhookNotification.disbursement.merchantAccount.currencyIsoCode, 'USD');
        GLOBAL.assert.equal(webhookNotification.disbursement.merchantAccount.subMerchantAccount, false);
        GLOBAL.assert.equal(webhookNotification.disbursement.merchantAccount.status, 'active');
        return done();
      });
    });
    it('returns a parsable signature and payload for disbursement exception webhook', function(done) {
      var bt_payload, bt_signature, ref;
      ref = testHelper.defaultGateway.webhookTesting.sampleNotification(WebhookNotification.Kind.DisbursementException, 'my_id'),
        bt_signature = ref.bt_signature, bt_payload = ref.bt_payload;
      return testHelper.defaultGateway.webhookNotification.parse(bt_signature, bt_payload, function(err, webhookNotification) {
        GLOBAL.assert.equal(webhookNotification.kind, WebhookNotification.Kind.DisbursementException);
        GLOBAL.assert.equal(webhookNotification.disbursement.id, 'my_id');
        GLOBAL.assert.equal(webhookNotification.disbursement.amount, '100.00');
        GLOBAL.assert.equal(webhookNotification.disbursement.transactionIds[0], 'afv56j');
        GLOBAL.assert.equal(webhookNotification.disbursement.transactionIds[1], 'kj8hjk');
        GLOBAL.assert.equal(webhookNotification.disbursement.success, false);
        GLOBAL.assert.equal(webhookNotification.disbursement.retry, false);
        GLOBAL.assert.equal(webhookNotification.disbursement.disbursementDate, '2014-02-10');
        GLOBAL.assert.equal(webhookNotification.disbursement.exceptionMessage, 'bank_rejected');
        GLOBAL.assert.equal(webhookNotification.disbursement.followUpAction, 'update_funding_information');
        GLOBAL.assert.equal(webhookNotification.disbursement.merchantAccount.id, 'merchant_account_token');
        GLOBAL.assert.equal(webhookNotification.disbursement.merchantAccount.currencyIsoCode, 'USD');
        GLOBAL.assert.equal(webhookNotification.disbursement.merchantAccount.subMerchantAccount, false);
        GLOBAL.assert.equal(webhookNotification.disbursement.merchantAccount.status, 'active');
        return done();
      });
    });
    it('builds a sample notification for a partner merchant connected webhook', function(done) {
      var bt_payload, bt_signature, ref;
      ref = testHelper.defaultGateway.webhookTesting.sampleNotification(WebhookNotification.Kind.PartnerMerchantConnected, 'my_id'),
        bt_signature = ref.bt_signature, bt_payload = ref.bt_payload;
      return testHelper.defaultGateway.webhookNotification.parse(bt_signature, bt_payload, function(err, webhookNotification) {
        GLOBAL.assert.equal(webhookNotification.kind, WebhookNotification.Kind.PartnerMerchantConnected);
        GLOBAL.assert.equal(webhookNotification.partnerMerchant.publicKey, 'public_key');
        GLOBAL.assert.equal(webhookNotification.partnerMerchant.privateKey, 'private_key');
        GLOBAL.assert.equal(webhookNotification.partnerMerchant.clientSideEncryptionKey, 'cse_key');
        GLOBAL.assert.equal(webhookNotification.partnerMerchant.merchantPublicId, 'public_id');
        GLOBAL.assert.equal(webhookNotification.partnerMerchant.partnerMerchantId, 'abc123');
        assert.ok(webhookNotification.timestamp != null);
        return done();
      });
    });
    it('builds a sample notification for a partner merchant disconnected webhook', function(done) {
      var bt_payload, bt_signature, ref;
      ref = testHelper.defaultGateway.webhookTesting.sampleNotification(WebhookNotification.Kind.PartnerMerchantDisconnected, 'my_id'),
        bt_signature = ref.bt_signature, bt_payload = ref.bt_payload;
      return testHelper.defaultGateway.webhookNotification.parse(bt_signature, bt_payload, function(err, webhookNotification) {
        GLOBAL.assert.equal(webhookNotification.kind, WebhookNotification.Kind.PartnerMerchantDisconnected);
        GLOBAL.assert.equal(webhookNotification.partnerMerchant.partnerMerchantId, 'abc123');
        assert.ok(webhookNotification.timestamp != null);
        return done();
      });
    });
    it('builds a sample notification for a partner merchant declined webhook', function(done) {
      var bt_payload, bt_signature, ref;
      ref = testHelper.defaultGateway.webhookTesting.sampleNotification(WebhookNotification.Kind.PartnerMerchantDeclined, 'my_id'),
        bt_signature = ref.bt_signature, bt_payload = ref.bt_payload;
      return testHelper.defaultGateway.webhookNotification.parse(bt_signature, bt_payload, function(err, webhookNotification) {
        GLOBAL.assert.equal(webhookNotification.kind, WebhookNotification.Kind.PartnerMerchantDeclined);
        GLOBAL.assert.equal(webhookNotification.partnerMerchant.partnerMerchantId, 'abc123');
        assert.ok(webhookNotification.timestamp != null);
        return done();
      });
    });
    it('builds a sample notification for a successfully charged subscription', function(done) {
      var bt_payload, bt_signature, ref;
      ref = testHelper.defaultGateway.webhookTesting.sampleNotification(WebhookNotification.Kind.SubscriptionChargedSuccessfully, 'my_id'),
        bt_signature = ref.bt_signature, bt_payload = ref.bt_payload;
      return testHelper.defaultGateway.webhookNotification.parse(bt_signature, bt_payload, function(err, webhookNotification) {
        var transaction;
        GLOBAL.assert.equal(webhookNotification.kind, WebhookNotification.Kind.SubscriptionChargedSuccessfully);
        GLOBAL.assert.equal(webhookNotification.subscription.id, 'my_id');
        GLOBAL.assert.equal(webhookNotification.subscription.transactions.length, 1);
        transaction = webhookNotification.subscription.transactions.pop();
        GLOBAL.assert.equal(transaction.status, 'submitted_for_settlement');
        GLOBAL.assert.equal(transaction.amount, 49.99);
        return done();
      });
    });
    it('builds a sample notification for a check notifications', function(done) {
      var bt_payload, bt_signature, ref;
      ref = testHelper.defaultGateway.webhookTesting.sampleNotification(WebhookNotification.Kind.Check, ''), bt_signature = ref.bt_signature,
        bt_payload = ref.bt_payload;
      return testHelper.defaultGateway.webhookNotification.parse(bt_signature, bt_payload, function(err, webhookNotification) {
        GLOBAL.assert.equal(webhookNotification.kind, WebhookNotification.Kind.Check);
        return done();
      });
    });
    return it('returns a parsable signature and payload for account updater daily report', function(done) {
      var bt_payload, bt_signature, ref;
      ref = testHelper.defaultGateway.webhookTesting.sampleNotification(WebhookNotification.Kind.AccountUpdaterDailyReport, 'my_id'),
        bt_signature = ref.bt_signature, bt_payload = ref.bt_payload;
      return testHelper.defaultGateway.webhookNotification.parse(bt_signature, bt_payload, function(err, webhookNotification) {
        GLOBAL.assert.equal(webhookNotification.kind, WebhookNotification.Kind.AccountUpdaterDailyReport);
        GLOBAL.assert.equal('link-to-csv-report', webhookNotification.accountUpdaterDailyReport.reportUrl);
        GLOBAL.assert.equal('2016-01-14', webhookNotification.accountUpdaterDailyReport.reportDate);
        return done();
      });
    });
  });
});
