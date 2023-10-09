
declare global {
  namespace Express {
    interface Request {
      session?: Record<string,any>,
    }
  }
  declare module 'express';
  declare module 'body-parser';
}
