// @ts-nocheck 
import * as db from './db';
import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import User from './Models/User';
const cors = require('cors');
const corsOptions = require('./config/corsOption');
const expressSession = require('express-session');
const routes = require('./routes/routes');
const pgSession = require('connect-pg-simple')(expressSession);
const passport = require("passport");
const passportAuth = require('./passport');
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GOOGLE_CLIENT_ID = process.env.OATH_CLIENT_GOOGLE_ID;
const GOOGLE_CLIENT_SECRET = process.env.OATH_CLIENT_GOOGLE_SECRET;


dotenv.config();
const app: any = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors(corsOptions));

const port = 5000;

// db.connectClient();

app.use(expressSession({
  secret: process.env.COOKIE_SECRET,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000,
  },
  resave: true,
  saveUninitialized: false,
  store:  new pgSession({
    conString: process.env.DATABASE_URL,
    tableName: 'user_sessions' 
  }),
}))

//https://www.passportjs.org/packages/passport-google-oauth20/
//initialize oauth
  app.use(passport.initialize());
  app.use(passport.session());
 
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/auth/google/callback",
        passReqToCallback: true,
      },
      async function (req:any, accessToken:any, refreshToken:any, profile:any, done:any) {
        const email = profile.emails[0].value;
        const user = await User.findUserbyEmail(email);
        if (user.success) 
        {
          console.log(user.data.username)
          req.session.user = user.data.username;
          // https://stackoverflow.com/questions/26531143/sessions-wont-save-in-node-js-without-req-session-save
          req.res.redirect('http://localhost:3000')
          // // console.log(req.session)
          // done(null, user)
        } else {
          req.res.redirect('http://localhost:3000/login-help')
        }
      }
    )
  );

// Start the server
passportAuth(app);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.get('/auth/google', 
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

// routes(app);
export default app;