const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const redis = require("redis");
const FacebookStrategy = require('passport-facebook').Strategy;
const configAuth=require('./auth.js');
const app = express();
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());



passport.serializeUser(function(user, cb) {
    cb(null, user);
  });
  
  passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
  });

app.get('/auth/facebook',
    passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/failure' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });

    passport.use(new FacebookStrategy({
        clientID: configAuth.facebookauth.clientId,
        clientSecret:  configAuth.facebookauth.clientSecret,
        callbackURL: configAuth.facebookauth.callbackUrl
      },
      function(accessToken, refreshToken, profile, cb) {
        // User.findOrCreate({ facebookId: profile.id }, function (err, user) {
          return cb(null, profile);
        // });
      }
    ));
app.get('/', (req, res) => {
    console.log(req.user)
    res.send({ success: true });
})
app.get('/failure', (req, res) => {
    res.send({ success: false, message: 'Invalid username or password.' });
})
app.listen(3000, () => {
    console.log('server listening at 3002');
})