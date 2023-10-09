import { Request, Response } from "express";
import Report from "../Models/Report";
import Story from "../Models/Story";
import User from "../Models/User";
import Comment from "../Models/Comment";

const postReport = async (req: Request, res: Response) => {
  try {
    const {
      username,
      reportType,
      contentId,
      commentId,
      offense,
    } = req.body;

    const result = await Report.createReport(username, reportType, contentId, offense, commentId);
    if (result.success) {
      res.status(200).json({
        success: true,
        data: result.data
      })
    } else {
      res.status(401).json({
        err: 'Error: Could not connect with database'
      })
    }
  } catch (err) {
    res.status(500).json({ err: (err as Error).message})
  }
}

const getReport = async (req: Request, res: Response) => {
  try {
    const {
      reportId
    } = req.params;

    const result = await Report.getReport(reportId);
    if (result.success) {
      res.status(200).json({
        success: true,
        data: result.data
      })
    } else {
      res.status(401).json({
        err: 'Error: Could not connect with database'
      })
    }
  } catch (err) {
    res.status(500).json({ err: (err as Error).message})
  }
}

const deleteReport = async (req: Request, res: Response) => {
  try {
    const {
      reportId
    } = req.params;
    const result = await Report.deleteReport(reportId);
    if (result.success) {
      res.status(200).json({
        success: true,
      })
    } else {
      res.status(401).json({
        err: 'Error: Could not connect with database'
      })
    }
  } catch (err) {
    res.status(500).json({ err: (err as Error).message})
  }
}

const getReports = async (req:Request, res: Response) => {
  const { offset, limit } = req.params;
  // console.log(`story username: ${username}`)
  try {
    const response = await Report.getReports(Number(offset), Number(limit));
    if (response.success) {
      // const stories = parseTags(response.data);

      // stories.tags = JSON.parse(stories.tags);
      res.status(200).json({
        reports: response.data,
      })
    } else {
      res.status(401).json({
        err: 'Error: Could not connect with database'
      })
    }
  } catch(err) {
    res.status(401).json({ err: (err as Error).message })
  }
}

const strikeUser = async (req: Request, res: Response) => {
  const { type, contentId, commentId, username, reportId} = req.body;
  try {
    let result;
    if (type === 'story') {
      result = await Story.deleteStoryById(contentId);
    } else if (type === 'comment') {
      result = await Comment.deleteComment(contentId);
    } else {
      result = await Comment.deleteReplyV1(commentId, contentId);
    }
    if (result?.success) {
      const strikeResult = User.strikeUser(username, reportId);
      if ((await strikeResult).success) {
        res.status(200).json({
          success: true,
        })
      } else {
        res.status(500).json({
          err: 'Error: Could not connect with database'
        })
      }
    } else {
      res.status(500).json({
        err: 'Error: Could not connect with database'
      })
    }
  } catch (err) {
    res.status(401).json({ err: (err as Error).message })
  }
}

//alternative version where content is edited rather than deleted

module.exports = {
  postReport,
  getReport,
  deleteReport,
  getReports,
  strikeUser
}