const { client } = require("../db");

class EmailToken {

  static async createToken(userId, hash) {
    try {
      const query = {
        text: ` INSERT INTO tokens(userId, token) VALUES($1, $2) RETURNING *`,
        values: [userId, hash]
      };
      const res = await client.query(query);
      if (res.rows) {
        return {
          success: true,
        }
      } else {
        return {
          success: false,
        }
      }
    } catch (err) {
      return {
        success: false,
        err
      }
    }
  }

  static async findTokens(userId) {
    try {
      const query = {
        text: `
          SELECT * FROM tokens WHERE userId = $1
        `,
        values: [userId]
      }
      const res = await client.query(query);
      // console.log(res?.rows[0]);
      if (res.rows) {
        return { success: true, data: res.rows }
      }
      return { success: false}
    } catch(err) {
      return { err: (err ).message, success: false }
    }
  }
  
  static async deleteToken(hash) {
    try {
      const query = {
        text: `
          DELETE FROM tokens WHERE token = $1
        `,
        values: [hash]
      }
      console.log(hash);
      const res = await client.query(query);
      if (res) {
        return { data: res.rows, success: true }
      }
      return { success: true}
    } catch(err) {
      return { err: (err ).message, success: false }
    }
  }
  static async deleteTokenId(userId) {
    try {
      const query = {
        text: `
          DELETE FROM tokens WHERE userId = $1
        `,
        values: [userId]
      }
      console.log(userId);
      const res = await client.query(query);
      if (res) {
        return { data: res.rows, success: true }
      }
      return { success: true}
    } catch(err) {
      return { err: (err ).message, success: false }
    }
  }
  static async checkTokenByUserId(userId) {
    try {
      const query = {
        text: `
          SELECT * FROM tokens WHERE userId = $1
        `,
        values: [userId]
      }
      const res = await client.query(query);
      // console.log(res?.rows[0]);
      if (!res.rows[0]) {
        return { success: false }
      }
      console.log(res.rows)
      const data = res.rows[0].created_at;
      const utcCreatedDate = new Date((Date.parse(data))).toUTCString();
      const startingDate = Date.parse(utcCreatedDate);
      const localDate = (new Date()).toLocaleString();
      const utcDate = (new Date()).toUTCString();
      const newDate = Date.parse(utcDate);
      console.log(localDate);
      console.log(utcCreatedDate);
      console.log(utcDate);
      console.log(startingDate);
      console.log(newDate);
      // console.log(startingDate - currentDate);
      const diff = Math.abs(newDate - utcCreatedDate)
      console.log(diff);
      const minutesPasses = Math.floor(diff/60000);
      console.log(minutesPasses);
      return { data: res.rows, success: true }
    } catch(err) {
      return { err: (err ).message, success: false }
    }
  }
  

}


module.exports = {
  EmailToken
}