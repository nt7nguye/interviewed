const fetch = (...args) =>
	import('node-fetch').then(({default: fetch}) => fetch(...args));

const { parse } = require('dotenv');
var express = require('express');
var jwt = require('jsonwebtoken');
var common = require('../common');
var mockTxns = require('./mockTxns');
var sessionStore = require('../mockSessionStore');
var router = express.Router();

router.get('/:transactionID', sessionStore.authenticateToken, function(req, res, next) {
  if (req.email===null||!sessionStore.hasOwnProperty(req.email)){
    res.sendStatus(403);
  }

  const options = { 
    method: "GET",
    headers: {
      "Authorization": "Bearer " + sessionStore[req.email].token,
      ...common.HEADERS,
    }
  }

  fetch (common.URL+"/transactions/"+req.params.transactionID, options)
    .then(async (extendRes) => {
      if (extendRes.status!=200) {
        res.status(extendRes.status).json({"error": "Something went wrong retrieving txns"});
      } else {
        const parsedRes = await extendRes.json();
        res.json({
            "id": parsedRes.id,
            "cardholderName": parsedRes.cardholderName,
            "cardholderEmail": parsedRes.cardholderEmail,
            "nameOnCard": parsedRes.nameOnCard,
            "vcnLast4": parsedRes.vcnLast4,
            "vcnDisplayName": parsedRes.vcnDisplayName,
            "virtualCardId": parsedRes.virtualCardId,
            "status": parsedRes.status,
            "type": parsedRes.type,
            "status": parsedRes.status,
            "approvalCode": parsedRes.approvalCode,
            "authBillingAmountCents": parsedRes.authBillingAmountCents,
            "authBillingCurrency": parsedRes.authBillingCurrency,
            "authMerchantAmountCents": parsedRes.authBillingAmountCents,
            "authMerchantCurrency": parsedRes.authMerchantCurrency,
            "authExchangeRate": parsedRes.authExchangeRate,
            "clearingBillingAmountCents": parsedRes.clearingBillingAmountCents,
            "clearingBillingCurrency": parsedRes.clearingBillingCurrency,
            "clearingMerchantAmountCents": parsedRes.clearingMerchantAmountCents,
            "clearingMerchantCurrency": parsedRes.clearingMerchantCurrency,
            "clearingExchangeRate": parsedRes.clearingExchangeRate,
            "mcc": parsedRes.mcc,
            "mccGroup": parsedRes.mccGroup,
            "mccDescription": parsedRes.mccDescription,
            "merchantName": parsedRes.merchantName,
            "authedAt": parsedRes.authedAt,
            "updatedAt": parsedRes.updated,
          });
      }
    })
});

module.exports = router;
