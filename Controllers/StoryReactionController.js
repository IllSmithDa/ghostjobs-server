// @ts-nocheck 
const {StoryReaction} = require("../Models/StoryReaction");


const checkStoryReaction = async (req, res) => {
  const {storyId, username} = req.params;
  try {
    const result = await StoryReaction.getMyStoryReaction(storyId, username);
    // console.log(result)
    res.status(200).json({
      reaction: result
    })
  } catch (err) {
    res.status(500).json({err})
  }
}

const createReaction = async (req, res) => {
  const { username, storyId, storyTitle, storyAuthor, myReaction, newReaction, oldReaction } = req.body;
  console.log(`retrieved ${username} ${storyId} ${myReaction} ${storyTitle} ${storyAuthor}`)
  try {
    if (oldReaction !== '') {
      await StoryReaction.removeReaction(storyId, username);
    }
    const result = await StoryReaction.createReaction(username, storyId, storyTitle, storyAuthor, myReaction, newReaction ? '' : oldReaction);
    if (result?.success) {
      res.status(200).json({
        result: result.data
      })
    } else {
      res.status(403).json({err: 'Error, data does not match the requirements of database'})
    }
  } catch(err) {  
    res.status(500).json({err})
  }
}

const deleteReaction = async (req, res) => {
  const { username, storyId } = req.params;
  console.log(`retrieved ${username} ${storyId}`)
  try {
    const result = await StoryReaction.removeReaction(storyId, username, false);
    if (result?.success) {
      res.status(200).json({
        success: true
      })
    } else {
      res.status(403).json({err: 'Error, data does not match the requirements of database'})
    }
  } catch (err) {
    res.status(500).json({err})
  }
}

const getMyStoryReactions = async (req, res) => {
  const {username, offset, limit} = req.params;
  console.log(`retrieved ${username} ${offset} ${limit}`)
  try {
    const result = await StoryReaction.getStoryReactions(username, Number(limit), Number(offset));
    if (result.success) {
      console.log(result.data);
      res.status(200).json({
        reactions: result.data,
        success: true
      })
    }
  } catch (err) {
    res.status(401).json({ err: (err ).message, success: false })
  }
}

module.exports = {
  checkStoryReaction,
  createReaction,
  deleteReaction,
  getMyStoryReactions,
}

