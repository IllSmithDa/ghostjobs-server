// @ts-nocheck 
const app = require('..');
const expressSession = require('express-session');
const pgSession = require('connect-pg-simple')(expressSession);

//https://stackoverflow.com/questions/65767024/express-session-not-working-in-production-deployment
const createSession = (req, res, next) => {
  app.use(expressSession({
    secret: process.env.COOKIE_SECRET,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: 'none', 
      secure: true,
    },
    name: 'new_cookie_ghostedon',
    resave: true,
    saveUninitialized: true,
    store:  new pgSession({
      conString: process.env.DATABASE_URL,
      tableName: 'User_sessions' 
    }),
  }));
  next();
  // req.session = session;
  // if(req.session) {
  //   res.status(200).json({ success: true });
  // } else {
  //   res.status(400).json({ login: false });
  // }
}

const checkSession = (req, res, next) => {
  console.log(req.session)
  if(req.session.user) {
   res.locals.username = req.session.user;
   next();
  } else {
   res.status(403).json({ login: false })
  }
}

module.exports = 
{
  checkSession,
  createSession,
}