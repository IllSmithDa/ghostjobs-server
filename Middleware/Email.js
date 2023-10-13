const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

//https://docs.sendgrid.com/ui/account-and-settings/how-to-set-up-domain-authentication
// https://docs.sendgrid.com/for-developers/sending-email/sender-identity
// https://docs.sendgrid.com/ui/sending-email/sender-verification
// https://www.npmjs.com/package/@sendgrid/mail

class Email {
  static async sendEmail (toEmail, webURL) {
    const msg = {
      to: toEmail, // Change to your recipient
      from: 'support@ghostedon.com', // Change to your verified sender
      subject: 'GhostedOn Password Reset',
      text: 'You have requested to reset your password. Please, click the link below to reset your password.</',
      html: `<div><p>You have requested to reset your password. Please, click the link below to reset your password.</p><a href="${webURL}">Reset Password</a></div>`,
    }

    try {
      await sgMail.send(msg);
      return {
        success: true,
      }
    } catch (err) {
      return {
        success: false,
        err: err
      }
    }
  }
  

}

module.exports = {
  Email,
}