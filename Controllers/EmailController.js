// @ts-nocheck 
const User = require("../Models/User");

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY)


var message = {
  from: "theblackmesa@hotmail.com",
  to: "sams404link@gmail.com",
  subject: "Message title",
  text: "Plaintext version of the message",
  html: "<p>HTML version of the message</p>"
};

const reqResetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const result= await User.findUserbyEmail(email);
    if (result.data.username) {
      // console.log(data.email)
      const response = await sgMail.send(message);
      if (response[0].statusCode === 200) {
        res.status(200).json({ success: true })
      } else {
        res.status(500).json({ err: 'Email could not be sent '})
      }
    } else {
      res.status(401).json({ err: 'Cannot find existing user with email'})
    }

  // https://stackoverflow.com/questions/60151181/object-is-of-type-unknown-typescript-generics
  } catch(err) {
    res.status(401).json({ err: (err ).message })
  }

}


module.exports = {
  reqResetPassword,
}