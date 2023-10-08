const { client } = require('../db');

export default class User {
  email: string;
  username: string;
  imageUrl: string;
  private password: string;

  constructor(email: string, username: string, password: string, imageUrl: string) {
    this.email = email;
    this.username = username;
    this.password = password;
    this.imageUrl = imageUrl;
  }
  static async findUserbyUsername(username:string) {
    try {
      const query = { 
        text: `SELECT username,id, isAdmin, isbanned, strikes from Users WHERE username = $1`,
        values: [username]
      }
      const res = await client.query(query);
      if (res.rows[0]) {
        return {
          data: res.rows[0],
          success: true 
        }
      } else {
        return {
          success: false 
        }
      }
    } catch (err) {
      return { err: (err as Error).message, success: false }
    }
  }
  static async findUserbyEmail(email:string) {
    try {
      const query = { 
        text: `SELECT * from users WHERE email = $1`,
        values: [email]
      }
      const res = await client.query(query);
      console.log(`user: ${res?.rows[0]}`);
      if (res?.rows[0]) {
        return {
          data: res.rows[0],
          success: true
        }
      } else {
        return { success: false }
      }
    } catch (err) {
      return { err: (err as Error).message, success: false }
    }
  }
  static async getUserPassword(username:string) {
    try {
      const query = { 
        text: `SELECT password from users WHERE username = $1`,
        values: [username]
      }
      const res = await client.query(query);
      console.log(`user: ${res?.rows[0]}`);
      if (res?.rows[0]) {
        return {
          data: res.rows[0],
          success: true
        }
      } else {
        return { success: false }
      }
    } catch (err) {
      return { err: (err as Error).message, success: false }
    }
  }
  static async createUser(email: string, username: string, password: string) {
    try {
      const query = { 
        text: `
          INSERT INTO users(email, username, password) VALUES($1, $2, $3)`,
        values: [email, username, password]
      }
      const res = await client.query(query);
      return {
        data: res,
        success: true
      }
    } catch(err) {
      return { err: (err as Error).message, success: false }
    }
  }
  static async getUsers() {
    try {
      const res = await client.query(`
        SELECT * FROM users
      `)
      return {
        data: res.rows,
        success: true
      }
    } catch(err) {
      return { err: (err as Error).message, success: false }
    }
  }
  static async deleteUserById(userId: string) {
    try {
      const query = {
        text: `
          DELETE FROM users WHERE id = $1
        `,
        values: [userId]
      }
      const res = await client.query(query);
      return { data: res.rows, success: true }
    } catch(err) {
      return { err: (err as Error).message, success: false }
    }
  }

  static async checkAdmin(username: string) {
    try {
      const query = {
        text: `
          SELECT isAdmin FROM users WHERE username = $1
        `,
        values: [username]
      }
      const res = await client.query(query);
      // console.log(res.rows[0]);
      if (res.rows[0].isadmin) return true;
      return false;
    } catch(err) {
      return { err: (err as Error).message, success: false }
    }
  }

  static async setAdminStatus(status: boolean, username: string) {
    try { 
      const query = {
        text: `
          UPDATE users SET isAdmin = $1 WHERE username = $2 
        `,
        values: [status, username]
      }
      await client.query(query);
      return { success: true }
    } catch(err) {
      return { err: (err as Error).message, success: false }
    }
  }

  static async changePassword(newPassword: string, username: string) {
    try {
      const query = {
        text: `
          UPDATE users SET password = $1 WHERE username = $2 
        `,
        values: [newPassword, username]
      }
      await client.query(query);
      return { success: true }
    } catch(err) {
      return { err: (err as Error).message, success: false }
    }
  }
  static async changeUsername(newUsername: string, email: string) {
    try {
      const query = {
        text: `
          UPDATE users SET username = $1 WHERE email = $2 
        `,
        values: [newUsername, email]
      }
      await client.query(query);
      return { success: true }
    } catch(err) {
      return { err: (err as Error).message, success: false }
    }
  }
  static async changeUserEmail(newEmail: string, username: string) {
    try {
      const query = {
        text: `
          UPDATE users SET email = $1 WHERE username = $2 
        `,
        values: [newEmail, username]
      }
      await client.query(query);
      return { success: true }
    } catch(err) {
      return { err: (err as Error).message, success: false }
    }
  }
  static async strikeUser(username: string, reportId: string) {
    let isBanned = false;
    try {
      console.log(username);
      const finduser = { 
        text: `SELECT strikes from users WHERE username = $1`,
        values: [username]
      }
      const res = await client.query(finduser);
      console.log(res.rows[0])
      let currentStrikes:number = Number(res.rows[0].strikes);
      currentStrikes += 1;
      if (currentStrikes === 10) isBanned = true;
      const query = {
        text: `
          UPDATE users SET strikes = $1, isbanned = $2 WHERE username = $3
        `,
        values: [currentStrikes, isBanned, username]
      }
      const strikeRes = await client.query(query);
      if (strikeRes) {
        const delReportQuery = {
          text: `
            DELETE FROM reports WHERE id = $1
          `,
          values: [reportId]
        }
        const delReportRes = await client.query(delReportQuery);
        if (delReportRes) {
          return { success: true }
        }
      }
      return { success: false }
    } catch(err) {
      return { err: (err as Error).message, success: false }
    }
  }
  static async checkBan (username: string) {
    try {
      const query = {
        text: `
          SELECT isbanned, strikes FROM users WHERE username = $1
        `,
        values: [username]
      }
      const res = await client.query(query);
      // console.log(res.rows[0]);
      if (res.rows[0]) return {
        success: true,
        data: res.rows[0]
      }
      return  {
        success: false
      }
    } catch(err) {
      return { err: (err as Error).message, success: false }
    }
  }
  
  static async setBan (username: string, banStatus: boolean) {
    try {
      const query = {
        text: `
          UPDATE users SET isbanned = $1 WHERE username = $2
        `,
        values: [banStatus, username]
      }
      const res = await client.query(query);
      // console.log(res.rows[0]);
      if (res) return {
        success: true,
      }
      return  {
        success: false
      }
    } catch(err) {
      return { err: (err as Error).message, success: false }
    }
  }
}