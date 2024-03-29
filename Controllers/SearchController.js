// @ts-nocheck 
const {Story} = require("../Models/Story");

const searchStories = async (req, res) => {
  const { searchQuery, limit, offset } = req.body;
  try {
    const result = await Story.searchStory(searchQuery, Number(limit), Number(offset));
    if (result.success) {
      res.status(200).json({
        stories: result.data
      })
    } else {
      res.status(500).json({ err: 'Could not reach the database. Contact admin for additional help'})
    }
  } catch (err) {
    res.status(401).json({ err: (err ).message })
  }
}

module.exports = {
  searchStories,
}