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

db.connectClient();

app.set('trust proxy', 1) // trust first prox

// https://expressjs.com/en/resources/middleware/session.html
// https://stackoverflow.com/questions/65767024/express-session-not-working-in-production-deployment
// https://stackoverflow.com/questions/55500547/express-session-does-not-save-the-passport-user-id-when-hosting-on-heroku
app.use(expressSession({
  secret: process.env.COOKIE_SECRET,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    sameSite: 'none', 
    secure: true
  },
  proxy: true,
  name: 'new_cookie_ghostedon',
  resave: true,
  saveUninitialized: false,
  store:  new pgSession({
    conString: process.env.DATABASE_URL,
    tableName: 'user_sessions' 
  }),
  saveUninitialized: true,
}))

//https://www.passportjs.org/packages/passport-google-oauth20/
//https://stackoverflow.com/questions/55079181/what-is-the-best-practice-to-use-oauth2-react-node-js-and-passport-js-to-authe

//initialize oauth
  app.use(passport.initialize());
  app.use(passport.session());
 
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.SERVER_URL}/auth/google/callback`,
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
          req.res.redirect(process.env.CLIENT_URL)
          // // console.log(req.session)
          // done(null, user)
        } else {
          req.res.redirect(`${process.env.CLIENT_URL}/login-help`);
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