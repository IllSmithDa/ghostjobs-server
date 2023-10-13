// @ts-nocheck 
const {User} = require("../Models/User");
const {Email} = require('../Middleware/Email');
const bcrypt = require("bcrypt");
const { EmailToken } = require("../Models/EmailToken");
const {nanoid} = require('nanoid');
const saltRounds = 10;

const hashedToken = async (token) => {
  try { 
    const tokenSalt = await bcrypt.genSalt(saltRounds);
    const hashedToken = await bcrypt.hash(token, tokenSalt);
    return {
      hashedToken,
    }
  } catch (err) {
    return {
      err: 'Encryption has failed. Contact administrator for help'
    }
  }
}


const reqResetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const result= await User.findUserbyEmail(email);
  if (!result.data.username) {
    res.status(401).json({ err: 'Cannot find existing user with email'});
    return 
  }
  const userId = result.data.id;

  const delTokenRes = await EmailToken.deleteTokenId(userId);
  if (!delTokenRes.success) {
    res.status(401).json({ err: 'Cannot interact with existing database'});
  }
  // console.log(data.email)  
  // check that the age of token is  at least 5 min long
  // const checkTokenRes = await EmailToken.checkTokenByUserId(userId);
  // if (!checkTokenRes.success) {
  //   res.status(401).json({ err: 'Cannot request password rest. Please try again in 5 mintues'});
  //   return;
  // }

  let resetToken = nanoid(48).toString('hex');
  const hash = (await hashedToken(resetToken)).hashedToken;
  const clientUrl = process.env.CLIENT_URL
  const webLink = `${clientUrl}/password-reset/${resetToken}/${userId}`;
  const tokenRes = await EmailToken.createToken(userId, hash);
  if (tokenRes.err) {
    res.status(400).json({ err: response.err})
    return;
  }
  const response = await Email.sendEmail(email, webLink);
  if (response.success) {
    res.status(200).json({ success: true })
  } else {
    res.status(400).json({ err: response.err})
  }

  // https://stackoverflow.com/questions/60151181/object-is-of-type-unknown-typescript-generics
  } catch(err) {
    res.status(401).json({ err: (err ).message })
  }

}
const compareTokens = async (token, hashedToken) => {
  console.log(token);
  console.log(hashedToken);
  const match = await bcrypt.compare(token, hashedToken);
  console.log(match);
  return match;
}

const checkPasswordValid = (password) => {
  const regex =  /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,24}$/;
  return regex.test(password);
}

const encryptUserData = async (password) => {
  try { 
    const passwordSalt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, passwordSalt);
    return {
      hashedPassword,
    }
  } catch (err) {
    return {
      err: 'Encryption has failed. Contact administrator for help'
    }
  }
}
const changePasword = async (req, res) => {
  const { userId, newPassword, resetToken } = req.body;
  try {
    const userRes = await User.findUserById(userId);
    // console.log(`found: ${userRes.success}`);
    if (userRes.success === false) {
      res.status(500).json({ err: 'Could not fetch data from the database' })
      return;
    }

    const passwordRes = checkPasswordValid(newPassword);
    if (passwordRes === false) {
      res.status(401).json({ success: false, err: 
        'Password is not valid. Password must have a minimum of 1 uppercase letter, 1 lowercase letter, 1 special character, 1 number and in total be at least 8 characters long and maximum of 24 characters long'})
      res.end();
      return;
    }

    const tokenFound = await EmailToken.findTokens(userId);
    // console.log(tokenFound);
    if (!tokenFound.success) {
      res.status(401).json({ err: 'Cannot find any existing token' });
      res.end();
      return;
    }
    const hashedToken = tokenFound.data[0].token;
    // console.log(hashedToken)
    const match = await compareTokens(resetToken, hashedToken);
  
    if(!match) {
      // req.session.destroy();
      res.status(401).json({ err: 'Cannot find any existing token' });
      res.end();
      return;
    }
    // console.log(match);
    const delTokenRes = await EmailToken.deleteTokenId(userId);
    // console.log(delTokenRes);
    if (!delTokenRes.success) {
      res.status(401).json({ err: 'email and/or password is incorrect' });
      res.end();
      return;
    }

    const encrptRes = await encryptUserData(newPassword);
    const { hashedPassword } = encrptRes;
    // console.log(hashedPassword);
    const finalRes = await User.changePasswordById(hashedPassword, userId);
    if (!finalRes.success) {
      res.status(500).json({ err: 'Could not fetch data from the database' })
      return;
    } 
    res.status(200).json({ success: true })
  } catch (err) {
    res.status(400).json({ err: (err ).message })
  }
}

const checkToken = async (req, res) => {
  const { email } = req.body;
  try {
    const userRes = await User.findUserbyEmail(email);
    if (userRes.success === false) {
      res.status(500).json({ err: 'Could not fetch data from the database' })
      return;
    }
    const userId = userRes.data.id;
    const testToken = await EmailToken.checkTokenByUserId(userId);
    if (testToken.success) {
      res.status(200).json({ success: true })
    } else {
      res.status(400).json({ err: 'Could not fetch data from the database' })
    }
  } catch (err) {
    res.status(400).json({ err: (err ).message })
  }
}

const checkEmailToken = async (req, res) => {
  const { email } = req.body;
  try {
    const userRes = await User.findUserbyEmail(email);
    if (userRes.success === false) {
      res.status(500).json({ err: 'Could not fetch data from the database' })
      return;
    }
    const userId = userRes.data.id;
    const testToken = await EmailToken.findTokens(userId);
    if (testToken.success) {
      res.status(200).json({ success: true, data: testToken.data })
    } else {
      res.status(400).json({ err: 'Could not fetch data from the database' })
    }
  } catch (err) {
    res.status(400).json({ err: (err ).message })
  }
}

module.exports = {
  reqResetPassword,
  changePasword,
  checkToken,
  checkEmailToken
}