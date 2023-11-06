// @ts-nocheck 
const {Comment} = require('../Models/Comment');


const createComment = async (req, res) => {
  const { username, storyTitle, text, storyId } = req.body;
  console.log(username)
  try {
    if (username && text) {
      const result = await Comment.createComment(username, storyTitle,  text, storyId);
      if (result?.success) {
        res.status(200).json({
          success: true,
          comment: result.data
        })
      } else {
        res.status(401).json({ success: false })
      }
    }
  } catch(err) {
    res.status(401).json({ err: (err ).message, success: false })
  }
}

const getComments = async (req, res) => {
  const {storyId, offset, limit} = req.params;
  try {
    if (storyId) {
      const result = await Comment.getComments(storyId, Number(offset), Number(limit));
      if (result.success) {
        res.status(200).json({
          comments: result.data,
          success: true
        })
      }
    }
  } catch (err) {
    res.status(401).json({ err: (err ).message, success: false })
  }
}

const getComment = async (req, res) => {
  const {commentId} = req.params;
  try {
    const result = await Comment.getComment(commentId);
    if (result.success) {
      res.status(200).json({
        comment: result.data,
        success: true
      })
    } else {
      err: 'Error: Could not connect with database'
    }
  } catch (err) {
    res.status(401).json({ err: (err ).message, success: false })
  }
}

const getReply = async (req, res) => {
  const {commentId, replyId} = req.params;
  try {
    const result = await Comment.getReply(commentId, replyId);
    if (result.success) {
      res.status(200).json({
        reply: result.data,
        success: true
      })
    } else {
      err: 'Error: Could not connect with database'
    }
  } catch (err) {
    res.status(401).json({ err: (err ).message, success: false })
  }
}

const getMyComments = async (req, res) => {
  const {username, offset, limit} = req.params;
  try {
    const result = await Comment.getMyComments(username, Number(offset), Number(limit));
    if (result.success) {
      res.status(200).json({
        comments: result.data,
        success: true
      })
    }
  } catch (err) {
    res.status(500).json({ err: (err ).message, success: false })
  }
}


const deleteComment = async (req, res) => {
  const { commentId, isReply, commentRefId } = req.body;
  try {
    console.log(commentId);
    let response;
    if (isReply) {
      response = await Comment.deleteReplyV1(commentRefId, commentId)
    } else {
      response = await Comment.deleteComment(commentId);
    }
    if (response?.success) {
      res.status(200).json({
        success: true
      })
    }
  } catch(err) {
    res.status(401).json({ err: (err ).message, success: false })
  }
}

const addReplyV1 = async (req, res) => {
  // const {id, commentIdRef, username, replyText, userImage, storyTitle, storyId, score } = req.body;
  try {
    const reply = req.body;
    const result = await Comment.addReply(commentId, reply);
    console.log(result);
    if (result?.success) {
      res.status(200).json({
        success: true,
        updatedReply: result.reply,
      })
    }
    console.log(result);
  } catch (err) {
    res.status(401).json({ err: (err ).message, success: false })
  }
}

const addReplyV2 = async (req, res) => {
  const {commentId, replyUsername, replyText, userImage, storyTitle, storyId, score } = req.body;
  try {
    // https://dev.to/rahmanfadhil/how-to-generate-unique-id-in-javascript-1b13
    const commentRes = await Comment.createComment(replyUsername, storyTitle,  replyText, storyId, commentId, true);
    console.log(commentRes.data.id);
    const reply = {
      id: commentRes.data.id,
      commentIdRef: commentId,
      username: replyUsername,
      userImage: userImage ?? '',
      score,
      replyText,
      storyTitle,
      storyId
    ,}
    const result = await Comment.addReply(commentId, reply);
    console.log(result);
    if (result?.success) {
      res.status(200).json({
        success: true,
        updatedReply: result.reply,
      })
    }
    console.log(result);
  } catch (err) {
    res.status(401).json({ err: (err ).message, success: false })
  }
}

const deleteReply = async (req, res) => {
  const {commentRefId, replyId} = req.body;
  try {
    const result = await Comment.deleteReplyV1(commentRefId, replyId)
    if (result?.success) {
      res.status(200).json({
        success: true,
      })
    }
  } catch (err) {
    res.status(401).json({ err: (err ).message, success: false })
  }
}


const editComment = async (req, res) => {
  const {commentId, editedText} = req.body;
    try{

  } catch(err) {
    res.status(500).json({ err: (err ).message, success: false })
  }
}

const likeComment = async (req, res) => {
  const { score, username, commentId } = req.body;
  try {
    // https://dev.to/rahmanfadhil/how-to-generate-unique-id-in-javascript-1b13
  
  } catch (err) {
    res.status(401).json({ err: (err ).message, success: false })
  } 
}

module.exports = {
  createComment,
  getComments,
  getComment,
  deleteComment,
  getMyComments,
  addReplyV1,
  deleteReply,
  getReply,
}