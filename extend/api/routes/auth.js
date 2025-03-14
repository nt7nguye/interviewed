//  Work around to use ES6 in CommonJS
const fetch = (...args) =>
	import('node-fetch').then(({default: fetch}) => fetch(...args));

var jwt = require('jsonwebtoken');
var express = require('express');
var common = require('../common');
var sessionStore = require('../mockSessionStore');
var router = express.Router();

// A simple check to see if user is authenticated
router.get('/', sessionStore.authenticateToken, function(req, res, next) {
  res.status(200);
});

router.post('/', function(req, res, next) {
  if (!Object.keys(req.body).length || !req.body.email) {
    res.status(400).json({error: "No login email provided"});
  } else if (!req.body.password){
    res.status(400).json({error: "No password provided"});
  } else {
    const options = {
      method: "POST",
      headers: common.HEADERS, 
      body: JSON.stringify({
        "email": req.body.email,
        "password": req.body.password,
      }),
    }

    fetch(common.URL+"/signin", options) 
      .then(async (extendRes) => {
        if (extendRes.status!==200){
          res.status(extendRes.status).json({"error": "Incorrect login information"});
        } else {
          const parsedRes = await extendRes.json();
          const email = parsedRes.user.email;

          // Save session 
          sessionStore[email]=req.session;
          sessionStore[email].token=parsedRes.token;
          sessionStore[email].refreshToken=parsedRes.refreshToken;
          
          // Return basic info
          res.json({
            "firstName": parsedRes.user.firstName,
            "lastName": parsedRes.user.lastName,
            "email": parsedRes.user.email,
            "phone": parsedRes.user.phone,
            "token": jwt.sign({"email": email}, process.env.BEARER_TOKEN_SECRET, { expiresIn: '1800s' }),
          });
        }});
  }
});

module.exports = router;
