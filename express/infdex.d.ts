
declare global {
  namespace Express {
    express: any
    interface Request {
      session?: Record<string,any>,
      'body-parser' ?: any,
      express: any
    }
  }
}

declare module 'express';
declare module 'body-parser';