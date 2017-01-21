var express = require("express");
const jwt = require('jsonwebtoken');  
var apiRoutes = express.Router(); 

//Environment configration
var config = require('../config/env/development');
if (process.env.NODE_ENV === 'development') {
    config = require('../config/env/development');
} else if (process.env.NODE_ENV === 'production') {
    config = require('../config/env/production');
}

// route middleware to verify a token
exports.checkAuth = function(req, res, next) {

  // check header or url parameters or post parameters for token
  // var token = req.body.x-auth-token || req.query.x-auth-token || req.headers['x-auth-token'];

 var token = req.headers['x-auth-token'];

//  console.log(token)
//  console.log(config.secret)

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, config.secret, function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded.id;    
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'Unauthorized Access.' 
    });
    
  }
};