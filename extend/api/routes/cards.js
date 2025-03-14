const fetch = (...args) =>
	import('node-fetch').then(({default: fetch}) => fetch(...args));

const { parse } = require('dotenv');
var express = require('express');
var jwt = require('jsonwebtoken');
var common = require('../common');
var sessionStore = require('../mockSessionStore');
var mockTxns = require('./mockTxns');
var router = express.Router();

router.get('/', sessionStore.authenticateToken, function(req, res, next) {
  if (req.email===null||!sessionStore.hasOwnProperty(req.email)){
    res.sendStatus(403);
  }

  const options = {
    method: "GET",
    headers: {
      "Authorization": "Bearer "+ sessionStore[req.email].token,
      ...common.HEADERS,
    }
  }

  fetch(common.URL+"/virtualcards", options)
    .then(async (extendRes) => {
      if (extendRes.status!==200) {
        res.status(extendRes.status).json({"error": "Something went wrong retrieving cards"});
      } else {
        const parsedRes = await extendRes.json();
        res.json({
          "virtualCards": Object.entries(parsedRes.virtualCards).map(([key, value]) => ({
            "id": value.id,
            "firstName": value.recipient.firstName,
            "lastName": value.recipient.lastName,
            "cardImageUrl": value.cardImage.urls.large,
            "displayName": value.displayName,
            "currency": value.currency,
            "balanceCents": value.balanceCents,
            "address": value.address,
            "expires": value.expires,
            "last4": value.last4,
          }))
        }
        );
      }
    })
});

router.get('/:vcID/transactions', sessionStore.authenticateToken, function(req, res, next) {
  if (req.email===null||!sessionStore.hasOwnProperty(req.email)){
    res.sendStatus(403);
  }

  // Endpoint "/virtualcards/{card_id}/transactions" not returning any transactions
  const options = {
    method: "GET",
    headers: {
      "Authorization": "Bearer "+ sessionStore[req.email].token,
      ...common.HEADERS,
    }
  }

  fetch(common.URL+"/virtualcards/"+req.params.vcID+"/transactions", options)
    .then(async (extendRes) => {
      if (extendRes.status!==200) {
        res.status(extendRes.status).json({"error": "Something went wrong retrieving transactions"});
      } else {
        var parsedRes = await extendRes.json();
        if (parsedRes.transactions.length===0) {
          parsedRes = mockTxns;
        }
        res.json({
          "transactions": Object.entries(parsedRes.transactions).map(([key, value]) => ({
            "id": value.id,
            "cardholderName": value.cardholderName,
            "cardholderEmail": value.cardholderEmail,
            "nameOnCard": value.nameOnCard,
            "vcnLast4": value.vcnLast4,
            "vcnDisplayName": value.vcnDisplayName,
            "virtualCardId": value.virtualCardId,
            "status": value.status,
            "type": value.type,
            "status": value.status,
            "approvalCode": value.approvalCode,
            "authBillingAmountCents": value.authBillingAmountCents,
            "authBillingCurrency": value.authBillingCurrency,
            "authMerchantAmountCents": value.authBillingAmountCents,
            "authMerchantCurrency": value.authMerchantCurrency,
            "authExchangeRate": value.authExchangeRate,
            "clearingBillingAmountCents": value.clearingBillingAmountCents,
            "clearingBillingCurrency": value.clearingBillingCurrency,
            "clearingMerchantAmountCents": value.clearingMerchantAmountCents,
            "clearingMerchantCurrency": value.clearingMerchantCurrency,
            "clearingExchangeRate": value.clearingExchangeRate,
            "mcc": value.mcc,
            "mccGroup": value.mccGroup,
            "mccDescription": value.mccDescription,
            "merchantName": value.merchantName,
            "authedAt": value.authedAt,
            "updatedAt": value.updated,
          }))
        });
      }}
    );
});


module.exports = router;
