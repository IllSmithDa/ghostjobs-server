const passport = require("passport");
import { Express} from 'express';
import { Request, Response } from 'express-serve-static-core';


module.exports = (server:Express) => {
  // const session = function (req: any, res:Response) {
  //   var temp = req.session.passport; // {user: 1}
  //   req.session.regenerate(function(err){
  //       //req.session.passport is now undefined
  //       req.session.passport = temp;
  //       req.session.save(function(err){
  //           res.send(200);
  //       });
  //   });
  // };
  server.get('/auth/google', 
    passport.authenticate('google', {
      scope: [
        'https://www.googleapis.com/auth/userinfo.email'
      ]
    })
    
  );
  server.get('/auth/google/callback/', 
    passport.authenticate('google', {
      failureRedirect: '/failed',
    }),
    function (req:any, res) {
      // res.status(200).send({ success: true });
      console.log('help' + req.session.user);
      res.redirect('http://localhost:3000');
      res.end();
    }
  );

}


passport.serializeUser((user:any, done:any) => {
  done(null, user);
});

passport.deserializeUser((user:any, done:any) => {
  done(null, user);
});