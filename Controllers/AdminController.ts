// @ts-nocheck 
import { Request, Response } from "express";
import User from "../Models/User";

const checkAdmin = async (req: Request, res: Response) => {
  const {username} = req.params;
  try {
    const result = await User.checkAdmin(username);
    res.status(200).json({
      admin: result
    })
  } catch (err) {
    res.status(500).json({ err: (err as Error).message, success: false })
  }
}

const setAdmin = async (req: Request, res: Response) => {
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
    res.status(500).json({ err: (err as Error).message, success: false })
  }
}

const strikeUser = async (req: Request, res: Response) => {
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
    res.status(500).json({ err: (err as Error).message, success: false })
  }
}

const checkUserBan = async (req: Request, res: Response) => {
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
    res.status(500).json({ err: (err as Error).message, success: false })
  }
}

const banUser = async (req: Request, res: Response) => {
  const {username} = req.body;
  try {
    const result = await User.setBan(username, true);
    if (result.success ) {
      res.status(200).json({
        success: true
      })
    } else {
      res.status(500).json({ err: 'Network Err. Please Contanct Support for help'})
    }
  } catch (err) {
    res.status(500).json({ err: (err as Error).message, success: false })
  }
}

const setUserBan = async (req: Request, res: Response) => {
  const {username, banStatus} = req.body;
  try {
    const result = await User.setBan(username, banStatus);
    if (result.success ) {
      res.status(200).json({
        success: true
      })
    } else {
      res.status(500).json({ err: 'Network Err. Please Contanct Support for help'})
    }
  } catch (err) {
    res.status(500).json({ err: (err as Error).message, success: false })
  }
}

module.exports = {
  checkAdmin,
  setAdmin,
  strikeUser,
  checkUserBan,
  banUser,
  setUserBan,
}