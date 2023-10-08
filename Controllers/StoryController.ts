import { Request, Response } from "express";
import Story from "../Models/Story";
import { S3 } from "aws-sdk";

const aws = require('aws-sdk');
const { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");

// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/migrating-to-v3.html
// https://stackoverflow.com/questions/43322536/could-not-load-credentials-from-any-providers-while-using-dynamodb-locally-in
const client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
  endpoint: new aws.Endpoint('s3.us-west-1.wasabisys.com'),
  region: 'us-west-1',
  signatureVersion: 'v4',
  httpOptions: {
    timeout: 0
  }
});
const tags = {like: 0, heart: 0, misleading: 0, funny:0, spam: 0, angry: 0, confused: 0};
const stringTags = JSON.stringify(tags);


const parseTags = (stories: Story[]) => {
  stories.forEach((story:Story) => {
    const tags: string = (story.tags as unknown as string);
    story.tags = JSON.parse(tags);
  })
  return stories;
}

const postStory = async (req: Request, res:Response) => {
  const { story, title, username, selectedTag} = req.body;

  try {
    const response = await Story.createStory(username, title, selectedTag);
    if (response.success) {
      console.log(process.env.S3BUCKETNAME);
      const input = {
        Bucket: process.env.S3BUCKETNAME,
        Key: response.data.id,
        Body: story,
        ACL: 'public-read-write',
      };
      const command = new PutObjectCommand(input);
      const result = await client.send(command);
      if (result) {
        res.status(200).json({ success: true })
      }
    }
  } catch (err) {
    res.status(401).json({ err: (err as Error).message })
  }
}

// https://stackoverflow.com/questions/36942442/how-to-get-response-from-s3-getobject-in-node-js
function getObject (Bucket:string, Key:string) {
  return new Promise(async (resolve, reject) => {
    const getObjectCommand = new GetObjectCommand({ Bucket, Key })

    try {
      const response = await client.send(getObjectCommand)
  
      // Store all of data chunks returned from the response data stream 
      // into an array then use Array#join() to use the returned contents as a String
      let responseDataChunks: string[] = []

      // Handle an error while streaming the response body
      response.Body.once('error', (err: Error) => reject(err))
  
      // Attach a 'data' listener to add the chunks of data to our array
      // Each chunk is a Buffer instance
      response.Body.on('data', (chunk:any) => responseDataChunks.push(chunk))
  
      // Once the stream has no more data, join the chunks into a string and return the string
      response.Body.once('end', () => resolve(responseDataChunks.join('')))
    } catch (err) {
      // Handle the error or throw
      return reject(err)
    } 
  })
}

//https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3/command/GetObjectCommand/
const getStory = async (req: Request, res: Response) => {

  try{
    const { storyId } = req.params;
    console.log(storyId)
    const response = await Story.getStory(storyId);
    if (response?.id) {
      console.log(response.id);
      const getParams = {
        Bucket: process.env.S3BUCKETNAME, // your bucket name,
        Key: response.id// path to the object you're looking for
      }
      // const getObjectCommand = new GetObjectCommand(getParams);
      const result:any = await getObject(getParams.Bucket as string, getParams.Key);
      // console.log(result);
      res.status(200).json({
        text: result,
        ...response,
      })
    }
  } catch(err) {
    res.status(401).json({ err: (err as Error).message })
  }
}
const getStoryText = async (req: Request, res: Response) => {
  try{
    const { storyId } = req.params;
      const getParams = {
        Bucket: process.env.S3BUCKETNAME, // your bucket name,
        Key: storyId// path to the object you're looking for
      }
      // const getObjectCommand = new GetObjectCommand(getParams);
      const result:any = await getObject(getParams.Bucket as string, getParams.Key);
      console.log(result);
      res.status(200).json({
        text: result
      })
  } catch(err) {
    res.status(401).json({ err: (err as Error).message })
  }
}
const storiesByDate = async (req: Request, res: Response) => {
    let { offset, limit } = req.params;
  try {
    // console.log(offset)
    const response = await Story.getStoriesByDate(Number(offset), Number(limit));
    if (response.success) {
      res.status(200).json({
        stories: response.data
      })
    }
  } catch(err) {
    res.status(401).json({ err: (err as Error).message })
  }
}
const getMyStories = async (req:Request, res: Response) => {
  const { username, offset, limit } = req.params;
  // console.log(`story username: ${username}`)
  try {
    const response = await Story.getMyStories(username, Number(offset), Number(limit));
    if (response.success) {
      console.log(`user ${response}`)
      // const stories = parseTags(response.data);

      // stories.tags = JSON.parse(stories.tags);
      res.status(200).json({
        stories: response.data,
      })
    }
  } catch(err) {
    res.status(401).json({ err: (err as Error).message })
  }
}

const deleteStory = async (req: Request, res: Response) => {
  const { storyId } = req.params;
  console.log(`story id: ${storyId}`)
  try {
    const response = await Story.deleteStoryById(storyId);
    if (response.success) {
      // console.log(`user ${response.data}`)
      // stories.tags = JSON.parse(stories.tags);
      const params = {
        Bucket: process.env.S3BUCKETNAME, // your bucket name,
        Key: storyId// path to the object you're looking for
      }
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3/command/DeleteObjectCommand/
      const command = new DeleteObjectCommand(params);
      const response = await client.send(command);
      if (response) {
        res.status(200).json({
          success: true
        })
      } else {
        res.status(401).json({ err: 'Could not fetch data from the database' })
      }
    }
  } catch(err) {
    res.status(401).json({ err: (err as Error).message })
  }
}

const updateStory = async (req: Request, res: Response ) => {
  const {storyId, title, text, selectedTag} = req.body;
  console.log(req.body);
  try {
    const result = await Story.updateStory(storyId, title, selectedTag);
    if (result.success) {
      const input = {
        Bucket: process.env.S3BUCKETNAME,
        Key: storyId,
        Body: text,
        ACL: 'public-read-write',
      };
      const command = new PutObjectCommand(input);
      const response = await client.send(command);
      console.log(response);
      if (response) {
        res.status(200).json({ 
          success: true,
      })
      } else {
        res.status(401).json({ err: 'Could not fetch data from the database' })
      }
    }
  } catch (err) {
    res.status(401).json({ err: (err as Error).message })
  }
}

const countStories = async (req: Request, res: Response) => {
  try {
    console.log('what')
    const result = await Story.countStories();
    if (result?.success) {
      res.status(200).json({ rowCount: result.rowCount, success: true })
    } else {
      res.status(401).json({ err: 'Could not fetch data from the database' })
    }
  } catch (err) {
    res.status(500).json({ err: (err as Error).message })
  }
}

const randomStory = async (req: Request, res: Response) => {
  try {
    const { offset } = req.params;
    const result = await Story.randomStory();
    if (result?.success) {
      res.status(200).json({ story: result.data, success: true })
    } else {
      res.status(401).json({ err: 'Could not fetch data from the database' })
    }
  } catch (err) {
    res.status(500).json({ err: (err as Error).message })
  }
}

module.exports = {
  postStory,
  getStory,
  storiesByDate,
  getMyStories,
  deleteStory,
  updateStory,
  getStoryText,
  countStories,
  randomStory
}