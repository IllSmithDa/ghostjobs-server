const { client } = require("../db");

class Report {
  id;
  reportType;
  contentId;
  username;
  created_at;

  constructor(id, username, reportType, contentId, created_at) {
    this.username = username;
    this.id = id;
    this.reportType = reportType;
    this.contentId = contentId;
    this.created_at = created_at
  }

  static async createReport (username, reportType, contentId, offense, commentId) {
    try {
      const reportQuery = {
        text: `
        INSERT INTO reports(username, reportType, contentId, offense, commentId) VALUES($1, $2, $3, $4, $5) RETURNING *
        `,
        values: [username, reportType, contentId, offense, commentId]
      }

      const result = await client.query(reportQuery);
      if (result.rows[0]) {
        return {
          success: true,
          data: result.rows[0]
        }
      }
      return {
        success: false,
      }
    } catch (err) {
      return { err: (err ), success: false };
    }
  }
  static async getReport (reportId) {
    try {
      const reportQuery = {
        text: `
        SELECT * from reports WHERE id = $1
        `,
        values: [reportId]
      }
      const result = await client.query(reportQuery);
      if (result.rows[0]) {
        return {
          success: true,
          data: result.rows[0]
        }
      } 
      return {
        success: false,
      }
    } catch (err) {
      return { err: (err ), success: false };
    }
  }
  static async deleteReport (reportId) {
    try {
      const reportQuery = {
        text: `
          DELETE FROM reports WHERE id = $1
        `,
        values: [reportId]
      }
      const result = await client.query(reportQuery);
      if (result) {
        return {
          success: true,
        }
      } 
      return {
        success: false,
      }
    } catch (err) {
      return { err: (err ), success: false };
    }
  }

  static async getReports(offset, limit) {
    try {
      const query = {
        text: `
          SELECT * FROM reports LIMIT $1  OFFSET $2
        `,
        values: [limit, offset]
      }
      const res = await client.query(query);
      // console.log(res?.rows)
      return { data: res.rows, success: true }
    } catch (err) {
      return { err: (err ).message, success: false }
    }
  }
}

module.exports = {
  Report
}