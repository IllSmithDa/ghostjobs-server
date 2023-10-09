import { NextFunction, Request, Response } from "express";
const app = require('..');
const expressSession = require('express-session');
const pgSession = require('connect-pg-simple')(expressSession);

const createSession = (req:any, res:Response, next:NextFunction) => {
  app.use(expressSession({
    secret: process.env.COOKIE_SECRET,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000
    },
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

const checkSession = (req:any, res:Response, next:NextFunction) => {
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