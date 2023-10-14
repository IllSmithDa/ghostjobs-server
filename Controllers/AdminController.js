// @ts-nocheck 
const {User} = require('../Models/User');

const checkAdmin = async (req, res) => {
  const {username} = req.params;
  try {
    const result = await User.checkAdmin(username);
    res.status(200).json({
      admin: result
    })
  } catch (err) {
    res.status(500).json({ err: (err ).message, success: false })
  }
}

const setAdmin = async (req, res) => {
  const { username, adminStatus} = req.body;
  try {
    const result = await User.setAdminStatus(adminStatus, username);
    if (result.success) {
      res.status(200).json({
        success: true
      })
    } else {
      res.status(500).json({ err: 'Network Err. Please Contanct Support for help'})
    }
  } catch (err) {
    res.status(500).json({ err: (err ).message, success: false })
  }
}

const strikeUser = async (req, res) => {
  const { username, reportId } = req.body;
  try {
    const result = await User.strikeUser(username, reportId);
    if (result.success) {
      res.status(200).json({
        success: true
      })
    } else {
      res.status(500).json({ err: 'Network Err. Please Contanct Support for help'})
    }
  } catch (err) {
    res.status(500).json({ err: (err ).message, success: false })
  }
}

const checkUserBan = async (req, res) => {
  const {username} = req.params;
  try {
    const result = await User.checkBan(username);
    if (result.success ) {
      res.status(200).json({
        data: result.data
      })
    } else {
      res.status(500).json({ err: 'Network Err. Please Contanct Support for help'})
    }
  } catch (err) {
    res.status(500).json({ err: (err ).message, success: false })
  }
}

const banUser = async (req, res) => {
  const {email} = req.body;
  try {
    const result = await User.setBan(email, true);
    if (result.success ) {
      res.status(200).json({
        success: true
      })
    } else {
      res.status(500).json({ err: 'Network Err. Please Contanct Support for help'})
    }
  } catch (err) {
    res.status(500).json({ err: (err ).message, success: false })
  }
}

const setUserBan = async (req, res) => {
  const {email, banStatus} = req.body;
  try {
    const result = await User.setBan(email, banStatus);
    if (result.success ) {
      res.status(200).json({
        success: true
      })
    } else {
      res.status(500).json({ err: 'Network Err. Please Contanct Support for help'})
    }
  } catch (err) {
    res.status(500).json({ err: (err ).message, success: false })
  }
}

const unbanUser = async (req, res) => {
  const {email} = req.body;
  try {
    const result = await User.unbanUser(email);
    if (result.success ) {
      res.status(200).json({
        success: true
      })
    } else {
      res.status(500).json({ err: 'Network Err. Please Contanct Support for help'})
    }
  } catch (err) {
    res.status(500).json({ err: (err ).message, success: false })
  }
}

module.exports = {
  checkAdmin,
  setAdmin,
  strikeUser,
  checkUserBan,
  banUser,
  setUserBan,
  unbanUser,
}