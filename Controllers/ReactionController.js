// @ts-nocheck 
const {CommentLike} = require("../Models/CommentLIke");

const addCommentScore = async (req, res) => {
  try {
    const { commentId, username, score, storyId } = req.body;
    const removeOld = await CommentLike.removeLikeDiskLike(commentId, username);
    if (removeOld.success) {
      const addNew = await CommentLike.addLikeDislike(commentId, username, score, storyId);
      if (addNew.success) {
        const updatedScore = await CommentLike.updateCommentScore(commentId, score);
        if (updatedScore?.success) {
          res.status(200).json({
            success: true
          })
        }
      } else {
        res.status(500).json({ err: 'Network Object Removal Err. Please Contanct Support for help'})
      }
    } else {
      res.status(500).json({ err: 'Network Err. Please Contanct Support for help'})
    }
  } catch(err) {
    res.status(500).json({ err: (err ).message})
  }
}

const removeCommentScore = async (req, res) => {
  try {
    const { commentId, username, score } = req.body;
    const removeOld = await CommentLike.removeLikeDiskLike(commentId, username);
    if (removeOld.success) {
      res.status(200).json({
        success: true
      })
    } else {
      res.status(500).json({ err: 'Network Err. Please Contanct Support for help'})
    }
  } catch(err) {
    res.status(500).json({ err: (err ).message})
  } 
}
const geCommentReactions = async (req, res) => {
  try {
    const { username }= req.params;
    const result = await CommentLike.getReactions(username);
    if (result.success) {
      res.status(200).json({
        success: true,
        reactions: result.reactions
      })
    } else {
      res.status(500).json({ err: 'Network Err. Please Contanct Support for help'})
    }
  } catch (err) {
    res.status(500).json({ err: (err ).message})
  }
}

const addRelyScore = async (req, res) => {
  try {
    const { commentId, replyId, username, score, storyId } = req.body;
    console.log(`${commentId}, ${replyId}, ${username}, ${score}`)
    const removeOld = await CommentLike.removeLikeDiskLike(replyId, username, commentId, true);
    if (removeOld.success) {
      const addNew = await CommentLike.addLikeDislike(replyId, username, score, storyId);
      if (addNew.success) {
        const updatedScore = await CommentLike.updateReplyScore(replyId, commentId,score);
        if (updatedScore?.success) {
          res.status(200).json({
            success: true
          })
        }
      } else {
        res.status(500).json({ err: 'Network Object Removal Err. Please Contanct Support for help'})
      }
    } else {
      res.status(500).json({ err: 'Network Err. Please Contanct Support for help'})
    }
  } catch (err) {
    res.status(500).json({ err: (err ).message})
  }
}

const removeReplyScore = async (req, res) => {
  try {
    const { replyId, username, commentRefId } = req.body;
    const removeOld = await CommentLike.removeLikeDiskLike(replyId, username, commentRefId, true);
    if (removeOld.success) {
      res.status(200).json({
        success: true
      })
    } else {
      res.status(500).json({ err: 'Network Err. Please Contanct Support for help'})
    }
  } catch(err) {
    res.status(500).json({ err: (err ).message})
  } 
}
module.exports = {
  addCommentScore,
  removeCommentScore,
  geCommentReactions,
  addRelyScore,
  removeReplyScore,
}