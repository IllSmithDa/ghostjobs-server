const { client } = require('../db');

const storyReactions = {'like': 0, 'heart': 0, 'misleading': 0, 'funny':0, 'spam': 0, 'angry': 0, 'confused': 0, 'dislike': 0, 'sad': 0};

export default class StoryReaction {
  username: string;
  storyId: string;
  reaction: 'like'|'heart'|'misleading'|'funny'|'spam'|'angry'|'confuse';


  constructor(username: string, storyId: string, reaction: 'like'|'heart'|'misleading'|'funny'|'spam'|'angry'|'confuse', ) {
    this.username = username;
    this.storyId = storyId;
    this.reaction = reaction;
  }

  static async updateReactionScore (storyId: string, newReaction:string, reactionRemove : string) {
    try {
      const storyQuery = {
        text: `SELECT reactions FROM stories WHERE id=$1`,
        values: [storyId]
      }
      const storyRes = (await client.query(storyQuery)).rows[0].reactions;
      console.log(storyRes);
      if (storyRes) {
        const newReactObj = {...storyRes};
        if(reactionRemove !== '') {
          newReactObj[reactionRemove] -= 1; 
        }

        if (newReaction !== '') {
          newReactObj[newReaction] += 1;
        }
        console.log(newReactObj);
        const updateQuery = {
          text: `UPDATE stories SET reactions = $1 WHERE id=$2`,
          values: [newReactObj, storyId]
        }
        const updateRes = await client.query(updateQuery);
        if (updateRes) {
          return {
            success: true
          }
        }

      } else {
        return {
          success: false,
        }
      }
      
    } catch (err) {
      return { err: (err as Error).message, success: false};
    }
  }

  static async createReaction(username: string, storyId: string, storyTitle: string, storyAuthor: string, newReaction: string, oldReaction: string) {
    try {
      const query = {
        text: 
        `INSERT INTO reactions(username, storyId, storyTitle, storyAuthor, reaction) VALUES($1, $2, $3, $4, $5) RETURNING *`,
        values: [username, storyId, storyTitle, storyAuthor, newReaction]
      }
      const newReactionRes = await client.query(query);
      if (newReactionRes.rows) {
        console.log(newReactionRes.rows);
        const updateResult = await this.updateReactionScore(storyId, newReaction, oldReaction);
        if (updateResult?.success) {
          console.log(updateResult);
          return {
            success: true,
            data: newReactionRes.rows[0]
          }
        } else {
          return {
            success: false,
          }
        }
      }
    } catch(err) {
      return { err: (err as Error).message, success: false};
    }
  }
  static async getMyStoryReaction(storyId: string, username: string) {
    try {
      const query = {
        text: `SELECT * FROM reactions WHERE storyId = $1 AND username = $2`,
        values: [storyId, username]
      }
      const res = await client.query(query);
      return res.rows[0];
    } catch(err) {
      return { err: (err as Error).message, success: false };
    }
  }
  // https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-update/
  // https://www.techonthenet.com/postgresql/and_or.php
  static async updateReaction(username: string, storyId: string, reaction: 'like'|'heart'|'misleading'|'funny'|'spam'|'angry'|'confuse' ) {

    try {
      const query ={
        text: 'UPDATE reactions SET reaction = $1 WHERE storyId = $2 AND username = $3 RETURNING id',
        values: [reaction, storyId, username]
      }
      const res = await client.query(query);
      return {data: res.rows[0], success: true };
    } catch(err) {
      return { err: (err as Error).message, success: false };
    }
  }
  // https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-delete/
  static async removeReaction(storyId: string, username: string, removeOnly = true) {
    try {

      console.log()
      const query = {
        text: 'DELETE FROM reactions WHERE storyId=$1 AND username=$2 RETURNING *',
        values: [storyId, username]
      }
      const deleteResult = await client.query(query);
      console.log(deleteResult)
      if (deleteResult.rows.length) {
        const oldReaction = deleteResult.rows[0].reaction;
        console.log(oldReaction);
        if (removeOnly === false) {
          const updateRes = await this.updateReactionScore(storyId, '' , oldReaction);
          if (updateRes?.success) {
            return {
              success: true,
            }
          }
        }
        return {
          success: true,
        }
      }
    } catch (err) {
      return { err: (err as Error).message, success: false };
    }
  }
  
  static async getStoryReactions(username: string, limit: number, offset: number) {
    try {
      const query = {
        text: `SELECT * FROM reactions WHERE username = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
        values: [username, limit, offset]
      }
      const res = await client.query(query);
      console.log(res.rows)
      return {
        data: res.rows,
        success: true
      }
    } catch(err) {
      return { err: (err as Error).message, success: false };
    }
  }
}

