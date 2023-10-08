const { client } = require('../db');


/*
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR (255) REFERENCES users(username),
  userImage VARCHAR (1000),
  text VARCHAR (7500) NOT NULL,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  score VAR CHAR (10000) DEFAULT 0,
  replies J
*/
interface Reply {
  id: string,
  commentIdRef: string,
  username: string,
  userImage: string,
  score: number,
  replyText: string,
  storyTitle: string,
  storyId: string,
}

export default class Comment {
  id: string;
  username: string;
  userImage: string;
  text: string;
  storyId: string;
  score: number;

  constructor(  id: string, text: string, username: string, storyId: string, imageUrl ?: string,  score = 0) {
    this.id = id;
    this.text = text;
    this.username = username;
    this.storyId = storyId;
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_assignment
    this.userImage = imageUrl ??= '';
    this.score = score
  }
  static async createComment(username: string, storytitle: string, text: string, storyId: string, commentRefId ?:string, isReply=false, userimage ?: string) {

    try {
      console.log(text);
      const query = {
        text: ` INSERT INTO comments(username, storytitle, text, storyId, isReply, userimage, commentRefId) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *
        `,
        values: [username, storytitle, text, storyId, isReply, userimage ?? '', commentRefId]
      }
      const res = await client.query(query);
      console.log(res);
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
    } catch (err){
      console.log(err);
      return { err: (err as Error), success: false };
    }
  }

  static async getMyComments(username: string, offset: number, limit: number) {
    try {
      const query = {
        text: `SELECT * FROM comments WHERE username = $1  ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
        values: [username, limit, offset]
      }
      const res = await client.query(query);
      return {
        data: res.rows,
        success: true, 
      };
    } catch {
      return { err: 'could not retrieve comments', success: false};
    }
  }

  static async getComment(commentId: string) {
    try {
      const query = {
        text: `SELECT * FROM comments WHERE id = $1`,
        values: [commentId]
      }
      const res = await client.query(query);
      return {
        data: res.rows[0],
        success: true, 
      };
    } catch {
      return { err: 'could not retrieve comments', success: false};
    }
  }

  static async getReply(commentId: string, replyId: string) {
    try {
      const query = {
        text: `SELECT * FROM comments WHERE id = $1`,
        values: [commentId]
      }
      const res = await client.query(query);
      const replies = res.rows[0].replies;
      let reply = replies.filter((reply:Reply) => replyId === reply.id)[0];
      console.log(reply) 
      return {
        data: reply,
        success: true, 
      };
    } catch {
      return { err: 'could not retrieve comments', success: false};
    }
  }

  static async getComments(storyId: string, offset: number, limit: number) {
    try {
      const query = {
        text: `SELECT * FROM comments WHERE storyId = $1 AND isReply = $2 ORDER BY created_at DESC LIMIT $3 OFFSET $4`,
        values: [storyId, false, limit, offset]
      }
      const res = await client.query(query);
      return {
        data: res.rows,
        success: true, 
      };
    } catch {
      return { err: 'could not retrieve comments', success: false};
    }
  }
  static async deleteComment(commentId: string) {
    try {
      const query = {
        text: `DELETE FROM comments WHERE id = $1`,
        values: [commentId]
      };
      const res = await client.query(query);
      if (res) {
        return { success: true }
      }
    } catch (err) {
      return { err: (err as Error).message, success: false }
    }
    
  }
  static async editComment(commentId: string, editText: string) {
    try {
      const query = {
        text: `
          UPDATE comments SET text = $1 WHERE id = $2 
        `,
        values: [editText, commentId]
      }
      await client.query(query);
      return { success: true }
    } catch (err) {
      return { err: (err as Error).message, success: false }
    }
  }
  /*
  interface Reply {
    id: string,
    commentId: string,
    username: string,
    userImage: string,
    score: number,
    replyText: string
  }
  */

  static async addReply(commentId: string, reply:Reply) {
    try {
      // update reply that will be addeed in the array under comments, with a reference id to the individual comment so when you delete, both can be delted at once

      // get the comment that the reply is addressing
      const getReplies = {
        text: `SELECT replies from comments WHERE id = $1`,
        values: [commentId]
      }
      const replies = (await client.query(getReplies)).rows[0].replies;
      // console.log(`what: ${replies?.length}`);
      const temp = replies?.length ? replies : [];
      // add new reply to existing reply list
      const updatedReplies = JSON.stringify([...temp,  reply]);
      // console.log(updatedReplies);
      const updateCommentquery = {
        text: `
          UPDATE comments SET replies = $1 WHERE id = $2
        `,
        values: [updatedReplies, commentId]
      }
      const updateRes = await client.query(updateCommentquery );
      if (updateRes.rows) {
        return { success: true, reply };
      }
    } catch (err) {
      return { err: (err as Error).message, success: false }
    }
  }
  static async editReply(commentRefId: string, replyId:string, editText: string) {
    try {
      const getReplies = {
        text: `SELECT replies from comments WHERE id = $1`,
        values: [commentRefId]
      }
      const replies = (await client.query(getReplies)).rows[0].replies;
      const updatedReplies = replies.forEach((reply:Reply) => {
        if (reply.id === replyId) reply.replyText = editText
      })

      const updateCommentquery = {
        text: `
          UPDATE comments SET replies = $1 WHERE id = $2
        `,
        values: [updatedReplies, commentRefId]
      }
       await client.query(updateCommentquery );
      const query = {
        text: `
          UPDATE comments SET text = $1 WHERE id = $2 
        `,
        values: [editText, replyId]
      }
      await client.query(query);
      return { success: true }
    } catch (err) {
      return { err: (err as Error).message, success: false }
    }
  }
  static async deleteReplyV1(commentRefId: string, replyId: string) {
    try {
      // remove reply from reply listing
      const getReplies = {
        text: `SELECT replies from comments WHERE id = $1`,
        values: [commentRefId]
      }
      const replies = (await client.query(getReplies)).rows[0].replies;
      const filteredReplies = replies.filter((reply:Reply) => reply.id !== replyId )
      const updateCommentquery = {
        text: `
          UPDATE comments SET replies = $1 WHERE id = $2
        `,
        values: [filteredReplies, commentRefId]
      }

      const updateRes = await client.query(updateCommentquery );
      if (updateRes.rows) {
        return { success: true };
      }
    } catch (err) {
      return { err: (err as Error).message, success: false }
    }
  }
  static async deleteReplyV2(commentRefId: string, replyId: string) {
    try {
      const query = {
        text: `DELETE FROM comments WHERE id = $1`,
        values: [replyId]
      };
      const res = await client.query(query);

      if (res) {
        // remove reply from reply listing
        const getReplies = {
          text: `SELECT replies from comments WHERE id = $1`,
          values: [commentRefId]
        }
        const replies = (await client.query(getReplies)).rows[0].replies;
        const filteredReplies = replies.filter((reply:Reply) => reply.commentIdRef !== commentRefId )
        const updateCommentquery = {
          text: `
            UPDATE comments SET replies = $1 WHERE id = $2
          `,
          values: [filteredReplies, commentRefId]
        }
  
        const updateRes = await client.query(updateCommentquery );
        if (updateRes.rows) {
          return { success: true };
        }

      }
    } catch (err) {
      return { err: (err as Error).message, success: false }
    }
  }
}