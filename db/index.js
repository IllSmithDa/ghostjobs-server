require('dotenv').config();
const { Pool, Client } = require('pg');
 
const pool = new Pool()
let client = new Client((process.env.DATABASE_URL));
 
const connectClient = async () => {
  client = new Client((process.env.DATABASE_URL));
  await client.connect();

  // await client.query(
  //   `DROP TABLE users CASCADE`
  // )

  // create user table if not exists
  // https://superuser.com/questions/1502690/a-not-null-column-of-type-timestamp-without-a-default-value-in-mysql
  // await client.query(`
  //   CREATE TABLE IF NOT EXISTS users (
  //     id BIGSERIAL PRIMARY KEY, 
  //     username VARCHAR ( 255 ) UNIQUE NOT NULL,
  //     password VARCHAR ( 255 ) NOT NULL,
  //     email VARCHAR ( 255 ) UNIQUE NOT NULL,
  //     imageUrl VARCHAR (1000),
  //     created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  //     isAdmin BOOLEAN DEFAULT FALSE,
  //     strikes INTEGER DEFAULT 0,
  //     isbanned BOOLEAN DEFAULT FALSE
  //   )
  // `)

  // await client.query(
  //   `
  //   ALTER TABLE users
  //   ADD COLUMN isbanned BOOLEAN DEFAULT FALSE
  //   `
  // )
  // console.log(await client.query('SELECT NOW()'))

  // https://www.npmjs.com/package/connect-pg-simple (includes table guide)
  // 
  // await client.query(
  //   `DROP TABLE user_sessions CASCADE`
  // )
  
  // await client.query(`
  //   CREATE TABLE IF NOT EXISTS "user_sessions" (
  //     sid varchar NOT NULL COLLATE "default",
  //     "sess" json NOT NULL,
  //     "expire" timestamp(6) NOT NULL,
  //     PRIMARY KEY (sid)
  //   )`
  // )
  // const res = await client.query(`
  //   SELECT sid FROM user_sessions
  // `)
  // console.log(res.rows);
  //   await client.query(`  
  //    ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE   INITIALLY IMMEDIATE;
  //   `)
  
  //  await client.query(`
  //  CREATE INDEX "IDX_session_expire" ON "session" ("expire");
  // `)


  // await client.query(
  //   `DROP TABLE IF EXISTS stories CASCADE`
  // )

  // https://www.postgresql.org/docs/current/tutorial-fk.html
  // https://www.w3schools.com/sql/sql_ref_foreign_key.asp
  // await client.query(`
  //   CREATE TABLE IF NOT EXISTS "stories" (
  //     id BIGSERIAL PRIMARY KEY, 
  //     title VARCHAR (255) NOT NULL,
  //     tags VARCHAR (255),
  //     reactions JSON,
  //     username VARCHAR (255),
  //     created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP()
  //   )
  // `)
  
  // await client.query( 
  //   `
  //   ALTER TABLE stories
  //   ADD COLUMN authorImage VARCHAR(7500)
  //   `
  // )
// await client.query(
//   `DROP TABLE iF EXISTS comments CASCADE`
// )

// await client.query(
//    `
//    ALTER TABLE comments
//    ADD COLUMN isReply BOOLEAN DEFAULT FALSE 
//    `
// )
//https://www.commandprompt.com/education/postgresql-delete-cascade-with-examples/
//   await client.query(` 
//       CREATE TABLE IF NOT EXISTS "comments" (
//         id BIGSERIAL PRIMARY KEY,
//         commentRefId VARCHAR(1000),
//         storyid BIGSERIAL REFERENCES stories(id) ON DELETE CASCADE,
//         username VARCHAR (255),
//         storytitle VARCHAR (255),
//         userImage VARCHAR (1000),
//         text VARCHAR (7500) NOT NULL,
//         created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(),
//         score INTEGER DEFAULT 0,
//         isReply BOOLEAN DEFAULT FALSE,
//         replies JSON
//       )
// `)
// await client.query(
//   `DROP TABLE iF EXISTS commentlikes`
// )
//
  //await client.query(`
  //  CREATE TABLE IF NOT EXISTS "commentlikes" (
  //    id BIGSERIAL PRIMARY KEY,
  //    score INTEGER DEFAULT 0,
  //    commentId VARCHAR (255),
  //    username VARCHAR (255),
  //    storyId BIGSERIAL REFERENCES stories(id) ON DELETE CASCADE
  //  )
  //`)

  // await client.query(
  //   `DROP TABLE iF EXISTS reactions`
  // )

  // await client.query(`
  //     CREATE TABLE IF NOT EXISTS "reactions" (
  //       id BIGSERIAL PRIMARY KEY,
  //       username VARCHAR (255),
  //       storyid  BIGSERIAL REFERENCES stories(id) ON DELETE CASCADE,
  //       storyTitle VARCHAR (255),
  //       storyAuthor VARCHAR (255),
  //       reaction VARCHAR(255),
  //       created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP()
  //     ) 
  // `)


  // await client.query(
  //   `DROP TABLE iF EXISTS reports`
  // )


  // await client.query(
  //   `
  //   CREATE TABLE IF NOT EXISTS "reports"(
  //     id BIGSERIAL PRIMARY KEY,
  //     commentId VARCHAR (255),
  //     reportType VARCHAR (255),
  //     offense VARCHAR (255),
  //     contentId VARCHAR (255) UNIQUE,
  //     username VARCHAR(255) REFERENCES users(username),
  //     created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP()
  //   )
  //   `
  // )
  // await client.query(
  //   `
  //   ALTER TABLE reports
  //   ADD COLUMN commentId VARCHAR (255)
  //   `
  // )

  // pg admin cannot expire tokens but set it to delete all tokens under userId when user complete process or when user requests new token
  // await client.query(
  //   `DROP TABLE iF EXISTS token`
  // )
  await client.query(
    
    `CREATE TABLE IF NOT EXISTS "tokens" (
      id BIGSERIAL PRIMARY KEY,
      userId BIGSERIAL REFERENCES users(id) ON DELETE CASCADE,
      token VARCHAR(1000) NOT NULL,
      created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP()
    )
    
    `
  )
}

module.exports = {
  client,
  connectClient,
}
//      FOREIGN KEY (username) REFERENCES Users,

