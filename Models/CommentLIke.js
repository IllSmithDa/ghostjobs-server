const { client } = require('../db');

class CommentLike {

  static async getReactions (username) {
    try {
      const query = {
        text: `SELECT * from commentlikes WHERE username = $1`,
        values: [username]
      }
      const res = await client.query(query);
      if (res) {
        return {
          success: true,
          reactions: res.rows.length ? res.rows : [],
        }
      } else {
        return {
          success: false, 
        }
      }
    } catch (err) {
      return { err: (err ).message, success: false }
    }
  }

  static async updateCommentScore (commentId, score) {
    try {
      const query = { 
        text: `SELECT * from comments WHERE id = $1`,
        values: [commentId]
      }
      const res = await client.query(query);
      console.log(`user: ${res?.rows[0]}`);
      if (res?.rows[0]) {
        const updatedScore = parseInt(res.rows[0].score) + score
        const updateScoreQuery = {
          text: `
            UPDATE comments SET score = $1 WHERE id = $2 
          `,
          values: [updatedScore, commentId]
        }
        await client.query(updateScoreQuery);
        return {
          success: true
        }
      } else {
        return { success: false }
      }
    } catch (err) {
      return { err: (err ).message, success: false }
    }
  }

  static async addLikeDislike (commentId, username, score, storyId) {
    try {
      const query = {
        text: ` INSERT INTO commentlikes(commentId, username, score, storyId) VALUES($1, $2, $3, $4) RETURNING *
        `,
        values: [commentId, username, score, storyId]
      }
      console.log(`updating reply score var: ${username}, ${commentId}, ${score}`)
      console.log('reached');
      const res = await client.query(query);
      console.log(res.rows[0]);
      if (res.rows) {
        return {
          data: res.rows[0],
          success: true
        }
      } else {
        return {
          sucess: false
        }
      }
    } catch (err) {
      return { err: (err ), success: false };
    }
  }

  static async updateReplyScore (replyId, commentRefId, score) {
    try {
      console.log(`updating reply score var: ${replyId}, ${commentRefId}, ${score}`)
      const getReplies = {
        text: `SELECT replies from comments WHERE id = $1`,
        values: [commentRefId]
      }
      console.log(`id comment: ${commentRefId}, ${replyId} ${score}`)
      const replies = (await client.query(getReplies)).rows[0].replies;
      console.log(`found replies ${replies}`);
      replies.forEach((reply) => {
        if (reply.id === replyId) reply.score = score
      })
      console.log(`updated replies ${replies[0].score}`);
      console.log(`updated replies ${replies[0].id}`);
      const newReplies = JSON.stringify([...replies]);
      const updateReplyquery = {
        text: `
          UPDATE comments SET replies = $1 WHERE id = $2
        `,
        values: [newReplies, commentRefId]
      }
      console.log('last time')
      const result = await client.query(updateReplyquery);
      console.log(`anything: ${result}`);
      if (result.rows) {
        console.log('updated scucess')
        return {
          success: true
        }
      } else {
        console.log('updated failed')
        return {
          success: false
        }
      }
    } catch (err) {
      return { err: (err ).message, success: false }
    }
  }
  static async removeLikeDiskLike (commentId, username, commentRefId, isReply=false) {
    try {
      const query = {
        text: `
          DELETE FROM commentlikes WHERE commentId = $1 AND username = $2 RETURNING *
        `,
        values: [commentId, username]
      }
      console.log(`${commentId}, ${commentRefId}, ${username}`)
      const res = await client.query(query);
      console.log(`found: ${res.rows[0]}`);
      if (res.rows[0]) {
        const updatedScore = parseInt(res.rows[0].score) * -1;
        const updatedComment = isReply ?
        await this.updateReplyScore(commentId, commentRefId ?? '', updatedScore):
        await this.updateCommentScore(commentId, updatedScore);
        if (updatedComment?.success) {
          console.log('success')
          return { success: true }
        } else {
          return { success: false }
        }
      }
      console.log('does not exist ')
      return { success: true }
    } catch(err) {
      return { err: (err ).message, success: false }
    }

  }
}

module.exports = {
  CommentLike,
}
