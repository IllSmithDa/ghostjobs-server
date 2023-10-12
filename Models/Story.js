const { client } = require('../db');

const storyReactions = {'like': 0, 'heart': 0, 'misleading': 0, 'funny':0, 'spam': 0, 'angry': 0, 'confused': 0, 'dislike': 0, 'sad': 0};
class Story {
  username;
  storyTitle;
  text;
  tags;
  

  constructor(text, username, storyTitle, tags) {
    this.username = username;
    this.storyTitle = storyTitle;
    this.text = text;
    this.tags = tags;
  }
  //https://node-postgres.com/features/queries
  static async createStory(username, title, stringTags) {
    console.log(storyReactions.like)
    try {
      const query = { 
        text: `
          INSERT INTO stories(title, username, tags, reactions) VALUES($1, $2, $3, $4) RETURNING id`,
        values: [title, username, stringTags, JSON.stringify(storyReactions)]
      }
      const res = await client.query(query);
      console.log(res);
      return {data: res.rows[0], success: true };
    } catch (err) {
      return { err: (err ).message, success: false }
    }
  }

  static async getStory(id) {
    try {
      const query = {
        text: `
          SELECT * FROM stories WHERE id = $1
        `,
        values: [id]
      }
      const res = await client.query(query);
      console.log(res?.rows[0]);
      return res?.rows[0];
    } catch (err) {
      return { err: (err ).message, success: false }
    }
  }

  //https://www.commandprompt.com/education/how-to-sort-table-data-by-date-in-postgresql/
  static async getStoriesByDate(offset, limit) {
    try {
      const query = {
        text: `
          SELECT * FROM stories ORDER BY created_at DESC LIMIT $1  OFFSET $2
        `,
        values: [limit, offset]
      }
      const res = await client.query(query);
      return { data: res.rows, success: true }
    } catch (err) {
      return { err: (err ).message, success: false }
    }
  }
 
  static async getMyStories(username, offset, limit) {
    try {
      const query = {
        text: `
          SELECT * FROM stories WHERE username = $1 ORDER BY created_at DESC LIMIT $2  OFFSET $3
        `,
        values: [username, limit, offset]
      }
      const res = await client.query(query);
      console.log(res?.rows)
      return { data: res.rows, success: true }
    } catch (err) {
      return { err: (err ).message, success: false }
    }
  }

  static async deleteStoryById(storyId) {
    try {
      const query = {
        text: `
          DELETE FROM stories WHERE id = $1
        `,
        values: [storyId]
      }
      console.log(storyId);
      const res = await client.query(query);
      return { data: res.rows, success: true }
    } catch(err) {
      return { err: (err ).message, success: false }
    }
  }

  // /https://www.postgresql.org/docs/current/sql-update.html
  static async updateStory (storyId, updatedTitle, tags) {
    try {
      // console.log('hello 2')
      const query = {
        text: `
          UPDATE stories SET title = $1, tags = $2 WHERE id = $3 
        `,
        values: [updatedTitle, tags, storyId]
      }
      await client.query(query);
      console.log('reached here')
      return { success: true }
    } catch(err) {
      return { err: (err ).message, success: false }
    }
  }

  // https://stackoverflow.com/questions/19471756/how-to-make-a-like-search-in-postgresql-and-node-js
  static async searchStory (searchParams, limit, offset) {
    try{
      const query = {
        text: `
          SELECT * FROM stories WHERE title ILIKE $1 OR tags ILIKE $1 OR username ILIKE $1
          ORDER BY created_at DESC LIMIT $2  OFFSET $3
        `,
        values: [`%${searchParams}%`, limit, offset]
      }
      const res = await client.query(query);
      console.log(res);
      return { data: res.rows, success: true }
    } catch (err) {
      return { err: (err ).message, success: false }
    }
  }

  static async countStories () {
    try {
      const rowQuery = {
        text: `
          SELECT Count(*) FROM stories
        `
      }
      const rowCount = await client.query(rowQuery);
      console.log(rowCount.rows[0].count);
      return {
        rowCount: rowCount.rows[0].count,
        success: true,
      }
    } catch (err) {
      return { err: (err ).message, success: false }
    } 
  }

  // https://stackoverflow.com/questions/5297396/quick-random-row-selection-in-postgres
  static async randomStory () {
    try {

      const rowCount = Number((await this.countStories()).rowCount);
      // random selection here
      const offSetCount = Math.floor(Math.random() * rowCount);
      const query = {
        text: `
          SELECT id FROM stories OFFSET $1 LIMIT 1
        `,
        values: [offSetCount]
      }
      const result = await client.query(query);
      return {
        data: result.rows[0],
        success: true,
      }
    } catch (err) {
      return { err: (err ).message, success: false }
     }
  }
}

module.exports = {
  Story
}