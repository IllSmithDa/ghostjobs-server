const passport = require('passport');
const GoogleStrategy = require('passport-google-oidc');
const { client } = require('../db');
import dotenv from 'dotenv';
dotenv.config();


export const googleAuth = () => {
  passport.use(new GoogleStrategy({
    clientID: process.env.OATH_CLIENT_GOOGLE_ID,
    clientSecret: process.env.OATH_CLIENT_GOOGLE_SECRET,
    callbackURL: process.env.CLIENT_URL,
  },
  function() {
   console.log('hello');
  }
  ));
};