// @ts-nocheck 
const passport = require("passport");


module.exports = (server) => {
  // const session = function (req, res) {
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
    function (req, res) {
      // res.status(200).send({ success: true });
      console.log('help' + req.session.user);
      res.redirect(process.env.CLIENT_URL);
      res.end();
    }
  );

}


passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});