// @ts-nocheck 
// const passport = require('..')

//initialize oauth
// app.use(passport.initialize());
// app.use(passport.session());


 // const GoogleStrategy = require("passport-google-oauth20").Strategy;
 // const GOOGLE_CLIENT_ID = process.env.OATH_CLIENT_GOOGLE_ID;
 // const GOOGLE_CLIENT_SECRET = process.env.OATH_CLIENT_GOOGLE_SECRET;
 // 
 // passport.use(
 //   new GoogleStrategy(
 //     {
 //       clientID: GOOGLE_CLIENT_ID,
 //       clientSecret: GOOGLE_CLIENT_SECRET,
 //       callbackURL: "http://localhost:5000/auth/google/callback"
 //     },
 //     function (accessToken, refreshToken, profile, done) {
 //       done(null, profile);
 //     }
 //   )
 // );


const oauthLoginUser = (req, res) =>{
  console.log(req.app)
  req.app.passport.authenticate('google', { scope : ['profile', 'email'] });
}
  const callbackRoute = (req, res) => {
  console.log('test')
  req.app.passport.authenticate('google', {
    successRedirect:`${process.env.CLIENT_URL}/`,
    failureRedirect: '/failed',
  })
}
const oauthRegister = async (req, res) => {

}
module.exports = {
  oauthLoginUser,
  callbackRoute,
}